import type { PageModule, QwikCityPlan, RouteData, PathParams } from '@builder.io/qwik-city';
import type { StaticGenerateOptions, StaticGenerateResult, StaticRoute, System } from './types';
import { createRouteTester } from './routes';
import { generateNotFoundPages } from './not-found';
import { getPathnameForDynamicRoute } from '../utils/pathname';
import { msToString } from '../utils/format';
import { pathToFileURL } from 'node:url';
import { relative } from 'node:path';
import { bold, green, dim, red, magenta } from 'kleur/colors';
import { formatError } from '../buildtime/vite/format-error';
import { buildErrorMessage } from 'vite';
import type {
  ActionInternal,
  LoaderInternal,
  ResolveSyncValue,
  StaticGenerateProps,
} from '../runtime/src/types';
import { useQwikCityEnv } from '../runtime/src/use-functions';

export async function mainThread(sys: System) {
  const opts = sys.getOptions();
  validateOptions(opts);

  const main = await sys.createMainProcess!();
  const log = await sys.createLogger();
  log.info('\n' + bold(green('Starting Qwik City SSG...')));

  const qwikCityPlan: QwikCityPlan = (await import(pathToFileURL(opts.qwikCityPlanModulePath).href))
    .default;

  const queue: StaticRoute[] = [];
  const active = new Set<string>();
  const routes = qwikCityPlan.routes || [];
  const trailingSlash = !!qwikCityPlan.trailingSlash;
  const includeRoute = createRouteTester(opts.basePathname || '/', opts.include, opts.exclude);

  return new Promise<StaticGenerateResult>((resolve, reject) => {
    try {
      const timer = sys.createTimer();
      const generatorResult: StaticGenerateResult = {
        duration: 0,
        rendered: 0,
        errors: 0,
        staticPaths: [],
      };

      let isCompleted = false;
      let isRoutesLoaded = false;

      const completed = async () => {
        const closePromise = main.close();

        await generateNotFoundPages(sys, opts, routes);

        generatorResult.duration = timer();

        if (generatorResult.errors === 0) {
          log.info(`\n${green('SSG results')}`);
          if (generatorResult.rendered > 0) {
            log.info(
              `- Generated: ${dim(
                `${generatorResult.rendered} page${generatorResult.rendered === 1 ? '' : 's'}`
              )}`
            );
          }

          log.info(`- Duration: ${dim(msToString(generatorResult.duration))}`);

          const total = generatorResult.rendered + generatorResult.errors;
          if (total > 0) {
            log.info(
              `- Average: ${dim(msToString(generatorResult.duration / total) + ' per page')}`
            );
          }
          log.info(``);
        }

        closePromise
          .then(() => {
            setTimeout(() => resolve(generatorResult));
          })
          .catch(reject);
      };

      const next = () => {
        while (!isCompleted && main.hasAvailableWorker() && queue.length > 0) {
          const staticRoute = queue.shift();
          if (staticRoute) {
            render(staticRoute);
          }
        }

        if (!isCompleted && isRoutesLoaded && queue.length === 0 && active.size === 0) {
          isCompleted = true;
          completed();
        }
      };

      let isPendingDrain = false;
      const flushQueue = () => {
        if (!isPendingDrain) {
          isPendingDrain = true;
          setTimeout(() => {
            isPendingDrain = false;
            next();
          });
        }
      };

      const render = async (staticRoute: StaticRoute) => {
        try {
          active.add(staticRoute.pathname);

          const result = await main.render({ type: 'render', ...staticRoute });

          active.delete(staticRoute.pathname);

          if (result.error) {
            const err = new Error(result.error.message);
            err.stack = result.error.stack;
            log.error(`\n${bold(red('Error during SSG'))}`);
            log.error(red(err.message));
            log.error(`  Pathname: ${magenta(staticRoute.pathname)}`);
            Object.assign(formatError(err), {
              plugin: 'qwik-ssg',
            });
            log.error(buildErrorMessage(err));

            generatorResult.errors++;
          }

          if (result.filePath != null) {
            generatorResult.rendered++;
            generatorResult.staticPaths.push(result.pathname);
            const base = opts.rootDir ?? opts.outDir;
            const path = relative(base, result.filePath);
            const lastSlash = path.lastIndexOf('/');
            log.info(`${dim(path.slice(0, lastSlash + 1))}${path.slice(lastSlash + 1)}`);
          }

          flushQueue();
        } catch (e) {
          isCompleted = true;
          reject(e);
        }
      };

      const addToQueue = (pathname: string | undefined | null, params: PathParams | undefined) => {
        if (pathname) {
          pathname = new URL(pathname, `https://qwik.builder.io`).pathname;

          if (pathname !== opts.basePathname) {
            if (trailingSlash) {
              if (!pathname.endsWith('/')) {
                const segments = pathname.split('/');
                const lastSegment = segments[segments.length - 1];

                if (!lastSegment.includes('.')) {
                  pathname += '/';
                }
              }
            } else {
              if (pathname.endsWith('/')) {
                pathname = pathname.slice(0, pathname.length - 1);
              }
            }
          }

          if (includeRoute(pathname) && !queue.some((s) => s.pathname === pathname)) {
            queue.push({
              pathname,
              params,
            });
            flushQueue();
          }
        }
      };

      const loadStaticRoute = async (route: RouteData) => {
        const [_, loaders, paramNames, originalPathname] = route;
        const modules = await Promise.all(loaders.map((loader) => loader()));
        const pageModule: PageModule = modules[modules.length - 1] as any;

        // if a module has a "default" export, it's a page module
        // if a module has a "onGet" or "onRequest" export, it's an endpoint module for static generation
        const env = useQwikCityEnv();
        const isValidStaticModule: boolean =
          pageModule && (pageModule.default || pageModule.onRequest || pageModule.onGet);
        const endpoint = env!.response;
        const resolveValue = ((loaderOrAction: LoaderInternal | ActionInternal) => {
          const id = loaderOrAction.__id;
          if (loaderOrAction.__brand === 'server_loader') {
            if (!(id in endpoint.loaders)) {
              throw new Error(
                'You can not get the returned data of a loader that has not been executed for this request.'
              );
            }
          }
          const data: any = endpoint.loaders[id];
          if (data instanceof Promise) {
            throw new Error(
              'Loaders returning a function can not be refered to in the head function.'
            );
          }
          return data;
        }) as any as ResolveSyncValue;

        if (isValidStaticModule) {
          if (Array.isArray(paramNames) && paramNames.length > 0) {
            if (typeof pageModule.onStaticGenerate === 'function' && paramNames.length > 0) {
              // dynamic route page module
              const props: StaticGenerateProps = {
                resolveValue,
              };
              const staticGenerate = await pageModule.onStaticGenerate(props);
              if (Array.isArray(staticGenerate.params)) {
                for (const params of staticGenerate.params) {
                  const pathname = getPathnameForDynamicRoute(
                    originalPathname!,
                    paramNames,
                    params
                  );
                  addToQueue(pathname, params);
                }
              }
            }
          } else {
            // static route page module
            addToQueue(originalPathname, undefined);
          }
        }
      };

      const loadStaticRoutes = async () => {
        await Promise.all(routes.map(loadStaticRoute));
        isRoutesLoaded = true;
        flushQueue();
      };

      loadStaticRoutes();
    } catch (e) {
      reject(e);
    }
  });
}

function validateOptions(opts: StaticGenerateOptions) {
  if (!opts.qwikCityPlanModulePath) {
    throw new Error(`Missing "qwikCityPlanModulePath" option`);
  }
  if (!opts.renderModulePath) {
    throw new Error(`Missing "renderModulePath" option`);
  }

  let siteOrigin = opts.origin;
  if (typeof siteOrigin !== 'string' || siteOrigin.trim().length === 0) {
    throw new Error(`Missing "origin" option`);
  }
  siteOrigin = siteOrigin.trim();
  if (!siteOrigin.startsWith('https://') && !siteOrigin.startsWith('http://')) {
    throw new Error(
      `"origin" must start with a valid protocol, such as "https://" or "http://", received "${siteOrigin}"`
    );
  }
  try {
    new URL(siteOrigin);
  } catch (e) {
    throw new Error(`Invalid "origin": ${e}`);
  }
}
