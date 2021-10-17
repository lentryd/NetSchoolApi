import Client from "@classes/Client";

export interface AuthData {
  lt: string;
  ver: string;
  salt: string;
}

export default async function (client: Client) {
  const data: AuthData = await client
    .post("/auth/getData")
    .then((res) => res.json());

  if (!data.lt || !data.ver || !data.salt) {
    throw new Error("Сетевой не вернул данные для авторизации.");
  } else {
    return data;
  }
}
