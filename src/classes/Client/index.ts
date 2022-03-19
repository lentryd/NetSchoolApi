import fetch, { RequestInit } from "node-fetch";

// Работа с куки
import decodeCookie from "./methods/cookie/decode";
import encodeCookie from "./methods/cookie/encode";

// Работа с заголовками
import getHeaders from "./methods/headers/get";
import setHeaders from "./methods/headers/set";
import delHeaders from "./methods/headers/del";

// Работа с ссылками
import joinURL from "./methods/url/join";
import isAbsolute from "./methods/url/isAbsolute";
import encodeQuery from "./methods/url/encodeQuery";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type DecodeCookie = { [key: string]: string };
export type ExtraHeaders = { key: string; value: string | Function }[];
export type ExtraHeadersRaw = { [key: string]: string };

export interface InitRequest extends RequestInit {
  params?: { [key: string]: any };
}

export default class {
  private origin: string;

  constructor(origin: string) {
    if (!isAbsolute(origin)) throw new Error("origin must be an absolute path");

    this.origin = new URL(origin).origin;
    this.headers.set("Referer", this.origin);
    this.headers.set("Cookie", () => this.cookie.get());
  }

  private _cookie: DecodeCookie = {};
  private cookie = {
    get: () => {
      return encodeCookie(this._cookie);
    },
    set: (cookie?: string[]) => {
      for (let { key, val } of decodeCookie(cookie) ?? [])
        this._cookie[key] = val;

      return this.cookie.get();
    },
  };

  private _headers: ExtraHeaders = [];
  public headers = {
    get: () => {
      return getHeaders(this._headers);
    },
    set: (key: string, value: string | Function) => {
      this._headers = setHeaders(this._headers, key, value);
      return this.headers.get();
    },
    del: (key: string) => {
      this._headers = delHeaders(this._headers, key);
      return this.headers.get();
    },
  };

  private _path = "/";
  public path = {
    get: () => {
      return this._path;
    },
    set: (path: string) => {
      if (isAbsolute(path)) throw new Error("path must be relative to origin");
      this._path = path;

      return this.path.get();
    },
  };

  private join(...paths: string[]) {
    return joinURL(this.origin, this.path.get(), ...paths);
  }

  public async request(url: string, init?: InitRequest) {
    if (!isAbsolute(url)) url = this.join(url);
    if (init?.params) url += encodeQuery(init.params);

    const res = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        ...this.headers.get(),
      },
    });

    this.cookie.set(res.headers.raw()?.["set-cookie"]);

    return res;
  }

  public get(url: string, init?: Omit<InitRequest, "method">) {
    return this.request(url, { ...init, method: "get" });
  }

  public post(url: string, init?: Omit<InitRequest, "method">) {
    return this.request(url, { ...init, method: "post" });
  }

  static formData(
    body: { [key: string]: any },
    init?: InitRequest
  ): InitRequest {
    const data = [];
    for (let key in body) data.push(key + "=" + body[key]);

    return {
      ...init,
      body: encodeURI(data.join("&")),
      headers: {
        ...init?.headers,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
  }
}
