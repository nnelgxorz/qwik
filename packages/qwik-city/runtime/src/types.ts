import type { NoSerialize, QRL, Signal, ValueOrPromise } from '@builder.io/qwik';
import type {
  RequestEvent,
  RequestEventAction,
  RequestEventLoader,
  RequestHandler,
  ResolveSyncValue,
} from '@builder.io/qwik-city/middleware/request-handler';
import type * as zod from 'zod';

export type {
  Cookie,
  CookieOptions,
  CookieValue,
  DeferReturn,
  RequestEvent,
  RequestEventAction,
  RequestEventCommon,
  RequestEventLoader,
  RequestHandler,
  ResolveSyncValue,
  ResolveValue,
} from '@builder.io/qwik-city/middleware/request-handler';

export interface RouteModule<BODY = unknown> {
  onDelete?: RequestHandler<BODY> | RequestHandler<BODY>[];
  onGet?: RequestHandler<BODY> | RequestHandler<BODY>[];
  onHead?: RequestHandler<BODY> | RequestHandler<BODY>[];
  onOptions?: RequestHandler<BODY> | RequestHandler<BODY>[];
  onPatch?: RequestHandler<BODY> | RequestHandler<BODY>[];
  onPost?: RequestHandler<BODY> | RequestHandler<BODY>[];
  onPut?: RequestHandler<BODY> | RequestHandler<BODY>[];
  onRequest?: RequestHandler<BODY> | RequestHandler<BODY>[];
}

/**
 * @alpha
 */
export interface PageModule extends RouteModule {
  readonly default: any;
  readonly head?: ContentModuleHead;
  readonly headings?: ContentHeading[];
  readonly onStaticGenerate?: StaticGenerateHandler;
}

export interface LayoutModule extends RouteModule {
  readonly default: any;
  readonly head?: ContentModuleHead;
}

export interface MenuModule {
  readonly default: ContentMenu;
}

/**
 * @alpha
 */
export interface RouteLocation {
  readonly params: Readonly<Record<string, string>>;
  readonly url: URL;
  /**
   * @deprecated Please use `url` instead of href
   */
  readonly href: string;
  /**
   * @deprecated Please use `url` instead of pathname
   */
  readonly pathname: string;
  /**
   * @deprecated Please use `url` instead of query
   */
  readonly query: URLSearchParams;
  readonly isNavigating: boolean;
}

/**
 * @alpha
 */
export type RouteNavigate = QRL<(path?: string, forceReload?: boolean) => Promise<void>>;

export type RouteAction = Signal<RouteActionValue>;

export type RouteActionResolver = { status: number; result: any };
export type RouteActionValue =
  | {
      id: string;
      data: FormData | Record<string, any> | undefined;
      output?: RouteActionResolver;
      resolve?: NoSerialize<(data: RouteActionResolver) => void>;
    }
  | undefined;

export type MutableRouteLocation = Mutable<RouteLocation>;

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

/**
 * @alpha
 */
export interface DocumentHeadValue {
  /**
   * Sets `document.title`.
   */
  readonly title?: string;
  /**
   * Used to manually set meta tags in the head. Additionally, the `data`
   * property could be used to set arbitrary data which the `<head>` component
   * could later use to generate `<meta>` tags.
   */
  readonly meta?: readonly DocumentMeta[];
  /**
   * Used to manually append `<link>` elements to the `<head>`.
   */
  readonly links?: readonly DocumentLink[];
  /**
   * Used to manually append `<style>` elements to the `<head>`.
   */
  readonly styles?: readonly DocumentStyle[];
  /**
   * Arbitrary object containing custom data. When the document head is created from
   * markdown files, the frontmatter attributes that are not recognized as a well-known
   * meta names (such as title, description, author, etc...), are stored in this property.
   */
  readonly frontmatter?: Readonly<Record<string, any>>;
}

/**
 * @alpha
 */
export type ResolvedDocumentHead = Required<DocumentHeadValue>;

/**
 * @alpha
 */
export interface DocumentMeta {
  readonly content?: string;
  readonly httpEquiv?: string;
  readonly name?: string;
  readonly property?: string;
  readonly key?: string;
  readonly itemprop?: string;
}

/**
 * @alpha
 */
export interface DocumentLink {
  as?: string;
  crossorigin?: string;
  disabled?: boolean;
  href?: string;
  hreflang?: string;
  id?: string;
  imagesizes?: string;
  imagesrcset?: string;
  integrity?: string;
  media?: string;
  prefetch?: string;
  referrerpolicy?: string;
  rel?: string;
  sizes?: string;
  title?: string;
  type?: string;
  key?: string;
}

/**
 * @alpha
 */
export interface DocumentStyle {
  readonly style: string;
  readonly props?: Readonly<{ [propName: string]: string }>;
  readonly key?: string;
}

/**
 * @alpha
 */
export interface DocumentHeadProps extends RouteLocation {
  readonly head: ResolvedDocumentHead;
  readonly withLocale: <T>(fn: () => T) => T;
  readonly resolveValue: ResolveSyncValue;
}

/**
 * @alpha
 */
export type DocumentHead = DocumentHeadValue | ((props: DocumentHeadProps) => DocumentHeadValue);

export type ContentStateInternal = NoSerialize<ContentModule[]>;

/**
 * @alpha
 */
export interface ContentState {
  readonly headings: ContentHeading[] | undefined;
  readonly menu: ContentMenu | undefined;
}

/**
 * @alpha
 */
export interface ContentMenu {
  readonly text: string;
  readonly href?: string;
  readonly items?: ContentMenu[];
}

/**
 * @alpha
 */
export interface ContentHeading {
  readonly text: string;
  readonly id: string;
  readonly level: number;
}

export type ContentModuleLoader = () => Promise<ContentModule>;
export type EndpointModuleLoader = () => Promise<RouteModule>;
export type ModuleLoader = ContentModuleLoader | EndpointModuleLoader;
export type MenuModuleLoader = () => Promise<MenuModule>;

/**
 * @alpha
 */
export type RouteData =
  | [pattern: RegExp, loaders: ModuleLoader[]]
  | [pattern: RegExp, loaders: ModuleLoader[], paramNames: string[]]
  | [
      pattern: RegExp,
      loaders: ModuleLoader[],
      paramNames: string[],
      originalPathname: string,
      routeBundleNames: string[]
    ];

/**
 * @alpha
 */
export type MenuData = [pathname: string, menuLoader: MenuModuleLoader];

/**
 * @alpha
 */
export interface QwikCityPlan {
  readonly routes: RouteData[];
  readonly serverPlugins?: RouteModule[];
  readonly basePathname?: string;
  readonly menus?: MenuData[];
  readonly trailingSlash?: boolean;
  readonly cacheModules?: boolean;
}

/**
 * @alpha
 * @deprecated Please update to `PathParams` instead
 */
export declare type RouteParams = Record<string, string>;

/**
 * @alpha
 */
export declare type PathParams = Record<string, string>;

export type ContentModule = PageModule | LayoutModule;

export type ContentModuleHead = DocumentHead | ResolvedDocumentHead;

export type LoadedRoute = [
  params: PathParams,
  mods: (RouteModule | ContentModule)[],
  menu: ContentMenu | undefined,
  routeBundleNames: string[] | undefined
];

export interface LoadedContent extends LoadedRoute {
  pageModule: PageModule;
}

/**
 * @alpha
 * @deprecated Please use `RequestHandler` instead.
 */
export type EndpointHandler<BODY = unknown> = RequestHandler<BODY>;

export type RequestHandlerBody<BODY> = BODY | string | number | boolean | undefined | null | void;

export type RequestHandlerBodyFunction<BODY> = () =>
  | RequestHandlerBody<BODY>
  | Promise<RequestHandlerBody<BODY>>;

export interface EndpointResponse {
  status: number;
  loaders: Record<string, unknown>;
  formData?: FormData;
  action?: string;
}

export interface ClientPageData extends Omit<EndpointResponse, 'status'> {
  status: number;
  href: string;
  redirect?: string;
}

/**
 * @alpha
 */
export type StaticGenerateProps = {
  resolveValue: ResolveSyncValue;
};
/**
 * @alpha
 */
export type StaticGenerateHandler = (
  ev: StaticGenerateProps
) => Promise<StaticGenerate> | StaticGenerate;

/**
 * @alpha
 */
export interface StaticGenerate {
  params?: PathParams[];
}

export interface QwikCityRenderDocument extends Document {}

export interface QwikCityEnvData {
  params: PathParams;
  response: EndpointResponse;
  loadedRoute: LoadedRoute | null;
}

export interface SimpleURL {
  origin: string;
  href: string;
  pathname: string;
  search: string;
  hash: string;
}

export type Editable<T> = {
  -readonly [P in keyof T]: T[P];
};

type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
  : never;

type StrictUnion<T> = Prettify<StrictUnionHelper<T, T>>;

type Prettify<T> = {} & {
  [K in keyof T]?: T[K];
};

/**
 * @alpha
 */
export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>;

/**
 * @alpha
 */
export type JSONObject = { [x: string]: JSONValue };

export type GetValidatorType<B extends TypedDataValidator> = B extends TypedDataValidator<
  infer TYPE
>
  ? zod.infer<TYPE>
  : never;

/**
 * @alpha
 */
export interface ActionOptions {
  readonly id?: string;
  readonly validation?: DataValidator[];
}

/**
 * @alpha
 */
export interface ActionOptionsWithValidation<B extends TypedDataValidator = TypedDataValidator> {
  readonly id?: string;
  readonly validation: [val: B, ...a: DataValidator[]];
}

/**
 * @alpha
 */
export interface CommonLoaderActionOptions {
  readonly id?: string;
  readonly validation?: DataValidator[];
}

export type FailOfRest<REST extends readonly DataValidator[]> = REST extends readonly DataValidator<
  infer ERROR
>[]
  ? ERROR
  : never;

/**
 * @alpha
 */
export interface ActionConstructor {
  // With validation
  <O, B extends TypedDataValidator>(
    actionQrl: (data: GetValidatorType<B>, event: RequestEventAction) => ValueOrPromise<O>,
    options: B | ActionOptionsWithValidation<B>
  ): Action<
    StrictUnion<O | FailReturn<zod.typeToFlattenedError<GetValidatorType<B>>>>,
    GetValidatorType<B>,
    false
  >;

  // With multiple validators
  <O, B extends TypedDataValidator, REST extends DataValidator[]>(
    actionQrl: (data: GetValidatorType<B>, event: RequestEventAction) => ValueOrPromise<O>,
    options: B,
    ...rest: REST
  ): Action<
    StrictUnion<O | FailReturn<zod.typeToFlattenedError<GetValidatorType<B>>> | FailOfRest<REST>>,
    GetValidatorType<B>,
    false
  >;

  // Without validation
  <O>(
    actionQrl: (
      form: JSONObject,
      event: RequestEventAction,
      options: ActionOptions
    ) => ValueOrPromise<O>,
    options?: ActionOptions
  ): Action<O>;

  // Without validation
  <O, REST extends DataValidator[]>(
    actionQrl: (form: JSONObject, event: RequestEventAction) => ValueOrPromise<O>,
    ...rest: REST
  ): Action<StrictUnion<O | FailReturn<FailOfRest<REST>>>>;
}

/**
 * @alpha
 */
export interface ActionConstructorQRL {
  // With validation
  <O, B extends TypedDataValidator>(
    actionQrl: QRL<(data: GetValidatorType<B>, event: RequestEventAction) => ValueOrPromise<O>>,
    options: B | ActionOptionsWithValidation<B>
  ): Action<
    StrictUnion<O | FailReturn<zod.typeToFlattenedError<GetValidatorType<B>>>>,
    GetValidatorType<B>,
    false
  >;

  // With multiple validators
  <O, B extends TypedDataValidator, REST extends DataValidator[]>(
    actionQrl: QRL<(data: GetValidatorType<B>, event: RequestEventAction) => ValueOrPromise<O>>,
    options: B,
    ...rest: REST
  ): Action<
    StrictUnion<O | FailReturn<zod.typeToFlattenedError<GetValidatorType<B>>> | FailOfRest<REST>>,
    GetValidatorType<B>,
    false
  >;

  // Without validation
  <O>(
    actionQrl: QRL<
      (form: JSONObject, event: RequestEventAction, options: ActionOptions) => ValueOrPromise<O>
    >,
    options?: ActionOptions
  ): Action<O>;

  // Without validation
  <O, REST extends DataValidator[]>(
    actionQrl: QRL<(form: JSONObject, event: RequestEventAction) => ValueOrPromise<O>>,
    ...rest: REST
  ): Action<StrictUnion<O | FailReturn<FailOfRest<REST>>>>;
}

/**
 * @alpha
 */
export interface LoaderOptions {
  id?: string;
}

/**
 * @alpha
 */
export interface LoaderConstructor {
  // Without validation
  <O>(
    loaderFn: (event: RequestEventLoader) => ValueOrPromise<O>,
    options?: LoaderOptions
  ): Loader<O>;

  // With validation
  <O, REST extends readonly DataValidator[]>(
    loaderFn: (event: RequestEventLoader) => ValueOrPromise<O>,
    ...rest: REST
  ): Loader<StrictUnion<O | FailReturn<FailOfRest<REST>>>>;
}

/**
 * @alpha
 */
export interface LoaderConstructorQRL {
  // Without validation
  <O>(
    loaderQrl: QRL<(event: RequestEventLoader) => ValueOrPromise<O>>,
    options?: LoaderOptions
  ): Loader<O>;

  // With validation
  <O, REST extends readonly DataValidator[]>(
    loaderQrl: QRL<(event: RequestEventLoader) => ValueOrPromise<O>>,
    ...rest: REST
  ): Loader<StrictUnion<O | FailReturn<FailOfRest<REST>>>>;
}

export type LoaderStateHolder = Record<string, Signal<any>>;

/**
 * @alpha
 */
export interface ActionReturn<RETURN> {
  readonly status?: number;
  readonly value: RETURN;
}

/**
 * @alpha
 */
export interface ActionStore<RETURN, INPUT, OPTIONAL extends boolean = true> {
  /**
   * It's the "action" path that a native `<form>` should have in order to call the action.
   *
   * ```tsx
   *  <form action={action.actionPath} />
   * ```
   *
   * Most of the time this property should not be used directly, instead use the `Form` component:
   *
   * ```tsx
   * import {action$, Form} from '@builder.io/qwik-city';
   *
   * export const useAddUser = action$(() => { ... });
   *
   * export default component$(() => {
   *   const action = useAddUser()l
   *   return (
   *     <Form action={action}/>
   *   );
   * });
   * ```
   */
  readonly actionPath: string;

  /**
   * Reactive property that becomes `true` only in the browser, when a form is submited and switched back to false when the action finish, ie, it describes if the action is actively running.
   *
   * This property is specially useful to disable the submit button while the action is processing, to prevent multiple submissions, and to inform visually to the user that the action is actively running.
   *
   * It will be always `false` in the server, and only becomes `true` briefly while the action is running.
   */
  readonly isRunning: boolean;

  /**
   * Returned HTTP status code of the action after its last execution.
   *
   * It's `undefined` before the action is first called.
   */
  readonly status?: number;

  /**
   * When calling an action through a `<form>`, this property contains the previously submitted `FormData`.
   *
   * This is useful to keep the filled form data even after a full page reload.
   *
   * It's `undefined` before the action is first called.
   */
  readonly formData: FormData | undefined;

  /**
   * Returned succesful data of the action. This reactive property will contain the data returned inside the `action$` function.
   *
   * It's `undefined` before the action is first called.
   */
  readonly value: RETURN | undefined;

  /**
   * Method to execute the action programatically from the browser. Ie, instead of using a `<form>`, a 'click' handle can call the `run()` method of the action
   * in order to execute the action in the server.
   */
  readonly run: QRL<
    OPTIONAL extends true
      ? (form?: INPUT | FormData | SubmitEvent) => Promise<ActionReturn<RETURN>>
      : (form: INPUT | FormData | SubmitEvent) => Promise<ActionReturn<RETURN>>
  >;
}

/**
 * @alpha
 */
export type FailReturn<T> = T & {
  failed: true;
};

/**
 * @alpha
 */
export type LoaderSignal<T> = T extends () => ValueOrPromise<infer B>
  ? Readonly<Signal<ValueOrPromise<B>>>
  : Readonly<Signal<T>>;

/**
 * @alpha
 */
export interface Loader<RETURN> {
  /**
   * Returns the `Signal` containing the data returned by the `loader$` function.
   * Like all `use-` functions and methods, it can only be invoked within a `component$()`.
   */
  (): LoaderSignal<RETURN>;

  /**
   * @deprecated - call as a function instead
   */
  use(): LoaderSignal<RETURN>;
}

export interface LoaderInternal extends Loader<any> {
  readonly __brand?: 'server_loader';
  __qrl: QRL<(event: RequestEventLoader) => ValueOrPromise<any>>;
  __id: string;
  __validators: DataValidator[] | undefined;
  (): LoaderSignal<any>;
}

/**
 * @alpha
 */
export interface Action<RETURN, INPUT = Record<string, any>, OPTIONAL extends boolean = true> {
  /**
   * Returns the `ActionStore` containing the current action state and methods to invoke it from a component$().
   * Like all `use-` functions and methods, it can only be invoked within a `component$()`.
   */
  (): ActionStore<RETURN, INPUT, OPTIONAL>;

  /**
   * @deprecated - call as a function instead
   */
  use(): ActionStore<RETURN, INPUT, OPTIONAL>;
}

export interface ActionInternal extends Action<any, any> {
  readonly __brand: 'server_action';
  __id: string;
  __qrl: QRL<(form: JSONObject, event: RequestEventAction) => ValueOrPromise<any>>;
  __validators: DataValidator[] | undefined;

  (): ActionStore<any, any>;
}

export type ValidatorReturn<T extends Record<string, any> = {}> =
  | ValidatorReturnSuccess
  | ValidatorReturnFail<T>;

export interface ValidatorReturnSuccess {
  readonly success: true;
  readonly data?: any;
}

export interface ValidatorReturnFail<T extends Record<string, any> = {}> {
  readonly success: false;
  readonly error: T;
  readonly status?: number;
}

/**
 * @alpha
 */
export interface DataValidator<T extends Record<string, any> = {}> {
  validate(ev: RequestEvent, data: unknown): Promise<ValidatorReturn<T>>;
}

/**
 * @alpha
 */
export interface TypedDataValidator<T extends zod.ZodType = any> {
  __zod: zod.ZodSchema<T>;
  validate(ev: RequestEvent, data: unknown): Promise<zod.SafeParseReturnType<T, T>>;
}

export interface ValidatorConstructor {
  <T extends ValidatorReturn>(
    validator: (ev: RequestEvent, data: unknown) => ValueOrPromise<T>
  ): T extends ValidatorReturnFail<infer ERROR> ? DataValidator<ERROR> : DataValidator<never>;
}

export interface ValidatorConstructorQRL {
  <T extends ValidatorReturn>(
    validator: QRL<(ev: RequestEvent, data: unknown) => ValueOrPromise<T>>
  ): T extends ValidatorReturnFail<infer ERROR> ? DataValidator<ERROR> : DataValidator<never>;
}

/**
 * @alpha
 */
export interface ZodConstructor {
  <T extends zod.ZodRawShape>(schema: T): TypedDataValidator<zod.ZodObject<T>>;
  <T extends zod.ZodRawShape>(schema: (z: typeof zod) => T): TypedDataValidator<zod.ZodObject<T>>;
  <T extends zod.Schema>(schema: T): TypedDataValidator<T>;
  <T extends zod.Schema>(schema: (z: typeof zod) => T): TypedDataValidator<T>;
}

/**
 * @alpha
 */
export interface ZodConstructorQRL {
  <T extends zod.ZodRawShape>(schema: QRL<T>): TypedDataValidator<zod.ZodObject<T>>;
  <T extends zod.ZodRawShape>(schema: QRL<(zs: typeof zod) => T>): TypedDataValidator<
    zod.ZodObject<T>
  >;
  <T extends zod.Schema>(schema: QRL<T>): TypedDataValidator<T>;
  <T extends zod.Schema>(schema: QRL<(z: typeof zod) => T>): TypedDataValidator<T>;
}

export interface ServerFunction {
  (this: RequestEvent, ...args: any[]): any;
}

export interface ServerConstructorQRL {
  <T extends ServerFunction>(fnQrl: QRL<T>): QRL<T>;
}
