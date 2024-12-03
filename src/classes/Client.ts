import { HttpsProxyAgent } from "https-proxy-agent";
import WebClient, { Response, InitRequest } from "@lentryd/web-client";

export async function isSecurityWarning(res: Response) {
  return (
    res.headers.get("content-type")?.includes?.("text/html") &&
    +(res.headers.get("content-length") ?? "") < 1000 &&
    !res.headers.has("filename") &&
    (await res.clone().text()).includes("/asp/SecurityWarning.asp")
  );
}

export async function requestHook(
  this: Client,
  res: Response,
  url: string,
  init?: InitRequest
) {
  if (await isSecurityWarning(res)) {
    await this.post(
      "../asp/SecurityWarning.asp",
      Client.formData({
        at: this.headers.get().at,
        WarnType: 2,
      })
    );

    return this.request(url, init);
  }
}

export * from "@lentryd/web-client";
export default class Client extends WebClient {
  /**
   * Получает прокси для запросов
   * @returns Прокси
   */
  getProxy() {
    return this.agent.get();
  }

  /**
   * Задает прокси для запросов
   * @param url Ссылка на прокси
   * @returns
   */
  setProxy(url: string) {
    return this.agent.set(new HttpsProxyAgent(url));
  }
}
