/**
 * К сожалению в Node.js нет нормального клиента для http запросов,
 * например как httpx в python. Поэтому приходится делать этот класс.
 *
 * В основном этот класс нужен для хранения/обновления куки-файлов и
 * отправки асинхронных запрос (как node-fetch, но легче)
 */

import * as path from "path";
import fetch, { HeadersInit, RequestInit } from "node-fetch";

export class Client {
  static formData(
    body: { [key: string]: any },
    headers?: HeadersInit
  ): RequestInit {
    const data = [];
    for (let key in body) data.push(key + "=" + body[key]);

    return {
      body: encodeURI(data.join("&")),
      headers: {
        ...headers,
        "content-type": "application/x-www-form-urlencoded",
      },
    };
  }

  private origin: string;
  private _path = "/";
  private _cookie: { [key: string]: string } = {};

  /**
   *
   * @param origin Ссылка на сайт, например http://example.com
   */
  constructor(origin: string) {
    this.origin = origin;
  }

  /** Дефолтный путь */
  get path() {
    return this._path;
  }

  /** Изменить дефолтный путь */
  set path(value: string) {
    if (!/^\//.test(value)) value = "/" + value;

    this._path = value;
  }

  /** Сохраненные куки в виде строки */
  private get cookie() {
    let cookies = [];

    for (let name in this._cookie)
      cookies.push(name + "=" + this._cookie[name]);

    return cookies.join("; ");
  }

  /** Сохранение куки */
  private saveCookie(cookies?: string[]) {
    const setCookies = cookies?.map((cookie) =>
      cookie.substring(0, cookie.indexOf(";"))
    );

    const newCookies = setCookies?.map((cookie) => {
      const index = cookie.indexOf("=");
      const name = cookie.substring(0, index);
      const value = cookie.substring(index + 1);

      return { name, value };
    });

    newCookies?.forEach(({ name, value }) => {
      this._cookie[name] = value;
    });
  }

  request(pathname: string, init?: RequestInit) {
    return fetch(this.origin + path.posix.join(this.path, pathname), {
      ...init,
      headers: {
        ...init?.headers,
        cookie: this.cookie,
        referer: this.origin,
      },
    }).then((res) => (this.saveCookie(res.headers.raw()?.["set-cookie"]), res));
  }

  // Дальше тупа упрощение

  /**
   * `get` запрос
   * @param path ссылка на ресурсу
   * @param init доп. данные запроса
   */
  get(path: string, init?: RequestInit) {
    return this.request(path, { method: "get", ...init });
  }

  /**
   * `post` запрос
   * @param path ссылка на ресурсу
   * @param init доп. данные запроса
   */
  post(path: string, init?: RequestInit) {
    return this.request(path, { method: "post", ...init });
  }
}
