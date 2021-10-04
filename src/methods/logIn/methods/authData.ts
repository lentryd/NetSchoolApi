import { Client } from "@classes/Client";

export interface AuthData {
  lt: string;
  ver: string;
  salt: string;
}

export default function (client: Client) {
  return client
    .post("auth/getData")
    .then((res) => res.json() as Promise<AuthData>)
    .then((data) => {
      if (!data || !data.lt || !data.ver || !data.salt) {
        throw new Error("Сетевой не вернул данные для авторизации.");
      } else {
        return data;
      }
    });
}
