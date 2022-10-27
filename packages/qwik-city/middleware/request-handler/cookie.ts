export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';

export interface CookieOptions {
  domain?: string;
  expires?: number | Date | string;
  httpOnly?: boolean;
  maxAge?: number | [number, TimeUnit];
  path?: string;
  sameSite?: boolean | 'lax' | 'none' | 'strict';
  secure?: boolean;
}

export interface CookieValue {
  value: string;
  json: <T = unknown>() => T;
  number: () => number;
}

const UNIT: Record<TimeUnit, number> = {
  seconds: 1,
  minutes: 1 * 60,
  hours: 1 * 60 * 60,
  days: 1 * 60 * 60 * 24,
  weeks: 1 * 60 * 60 * 24 * 7,
};

const handleOptions = (options: CookieOptions): string[] => {
  const opts: string[] = [];

  if (options.domain) {
    opts.push(`Domain=${options.domain}`);
  }

  if (options.expires) {
    const resolvedValue =
      typeof options.expires === 'number' || typeof options.expires == 'string'
        ? options.expires
        : options.expires.toISOString();
    opts.push(`Expires=${resolvedValue}`);
  }

  if (options.httpOnly) {
    opts.push('HttpOnly');
  }

  if (options.maxAge) {
    const resolvedValue =
      typeof options.maxAge === 'number'
        ? options.maxAge
        : options.maxAge[0] * UNIT[options.maxAge[1]];
    opts.push(`MaxAge=${resolvedValue}`);
  }

  if (options.path) {
    opts.push(`Path=${options.path}`);
  }

  if (options.sameSite) {
    opts.push(`SameSite`);
  }

  if (options.secure) {
    opts.push('Secure');
  }

  return opts;
};

const createCookie = (name: string, value: string, options: CookieOptions = {}) => {
  return [`${name}=${value}`, ...handleOptions(options)].join('; ');
};

export class Cookie {
  private readonly _cookie: Record<string, string>;
  private readonly _headers: Record<string, string>;

  constructor(cookieString: string) {
    const parsedCookie: Record<string, string> = cookieString
      .split(';')
      .reduce((prev, cookie_value) => {
        const split = cookie_value.split('=');
        return { ...prev, [split[0]]: split[1] };
      }, {});
    this._cookie = parsedCookie;
    this._headers = {};
  }

  public get(name: string): CookieValue | null {
    const cookie = this._cookie[name];
    if (!cookie) {
      return null;
    }
    const value = cookie.split('=')[1];
    return {
      value,
      json() {
        return JSON.parse(value);
      },
      number() {
        return Number(value);
      },
    };
  }

  public set(
    name: string,
    value: string | number | Record<string, any>,
    options: CookieOptions = {}
  ) {
    let resolvedValue = typeof value === 'string' ? value : JSON.stringify(value);
    this._headers[name] = createCookie(name, resolvedValue, options);
  }

  public has(name: string) {
    return !!this._cookie[name];
  }

  public delete(name: string) {
    const value = this._cookie[name];
    if (value) {
      this.set(name, value, { expires: new Date(0) });
    }
  }

  public *headers(): IterableIterator<string> {
    for (const header of Object.values(this._headers)) {
      yield header;
    }
  }
}