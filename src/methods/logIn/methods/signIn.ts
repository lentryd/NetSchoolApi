import { Client } from "@classes/Client";

import passwordHash from "./passwordHash";
import authData, { AuthData } from "./authData";
import schoolInfo, { SchoolInfo } from "./schoolInfo";

function formData(
  login: string,
  password: string,
  { lt, ver, salt }: AuthData,
  school: SchoolInfo
) {
  return Client.formData({
    un: login,
    lt,
    ver,
    loginType: 1,
    ...school,
    ...passwordHash(salt, password),
  });
}

interface SignInObject {
  at: string;
  timeOut: number;
}

export interface SignIn {
  at: string;
  ver: string;
  timeOut: number;
}

export default function (
  login: string,
  password: string,
  school: string | number,
  client: Client
): Promise<SignIn> {
  let ver = "";

  return Promise.all([authData(client), schoolInfo(client, school)])
    .then(([authData, schoolInfo]) => {
      ver = authData.ver;

      return formData(login, password, authData, schoolInfo);
    })
    .then((init) => client.post("/login", init))
    .then((res) => res.json() as Promise<SignInObject>)
    .then((data) => {
      if (!data) {
        throw new Error("Не удалось войти");
      } else {
        return {
          at: data.at,
          ver,
          timeOut: data.timeOut,
        };
      }
    });
}
