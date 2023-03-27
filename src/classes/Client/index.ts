import WS, { ClientOptions } from "ws";
import fetch, { Response, RequestInit } from "node-fetch";

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

export type DecodeCookie = { [key: string]: string };
export type ExtraHeaders = { key: string; value: string | Function }[];
export type ExtraHeadersRaw = { [key: string]: string };

export interface InitWS extends ClientOptions {
  params?: { [key: string]: any };
}
export interface InitRequest extends RequestInit {
  params?: { [key: string]: any };
}

export default class Client {
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

  private origin: string;

  constructor(origin: string) {
    if (!isAbsolute(origin)) throw new Error("origin must be an absolute path");

    this.origin = new URL(origin).origin;
    this.headers.set("Origin", this.origin);
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

  public join(...paths: string[]) {
    return joinURL(this.origin, this.path.get(), ...paths);
  }

  private async isSecurityWarning(res: Response) {
    return (
      res.headers.get("content-type")?.includes?.("text/html") &&
      +(res.headers.get("content-length") ?? "") < 1000 &&
      !res.headers.has("filename") &&
      (await res.clone().text()).includes("/asp/SecurityWarning.asp")
    );
  }

  public ws(url: string, init?: InitWS) {
    if (!isAbsolute(url)) url = this.join(url);
    if (init?.params) url += encodeQuery(init.params);

    return new WS(url.replace("http", "ws"), {
      ...init,
      headers: {
        ...init?.headers,
        ...this.headers.get(),
      },
    });
  }

  public async request(url: string, init?: InitRequest): Promise<Response> {
    if (!isAbsolute(url)) url = this.join(url);
    if (init?.params) url += encodeQuery(init.params);

    const res = await fetch(url, {
      ...init,
      headers: {
        ...this.headers.get(),
        ...init?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(
        "Fetch failed.\n\t- url: " + url + "\n\t- status: " + res.status
      );
    }
    if (await this.isSecurityWarning(res)) {
      await this.post(
        "../asp/SecurityWarning.asp",
        Client.formData({
          at: this.headers.get().at,
          WarnType: 2,
        })
      );
      return this.request(url, init);
    }

    this.cookie.set(res.headers.raw()?.["set-cookie"]);

    return res;
  }

  public get(url: string, init?: Omit<InitRequest, "method">) {
    return this.request(url, { ...init, method: "get" });
  }

  public post(url: string, init?: Omit<InitRequest, "method">) {
    return this.request(url, { ...init, method: "post" });
  }
}
