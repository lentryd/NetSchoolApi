import { Credentials } from "@NS";
import Client from "@classes/Client";

import authData from "./authData";
import schoolInfo from "./schoolInfo";
import passwordHash from "./passwordHash";

interface SignInObject {
  at: string;
  timeOut: number;
}

export interface SignIn {
  at: string;
  ver: string;
  timeOut: number;
}

export default async function (
  client: Client,
  credentials: Credentials
): Promise<SignIn> {
  const { login: un, password, school: schoolCr } = credentials;

  const [{ lt, ver, salt }, school] = await Promise.all([
    authData(client),
    schoolInfo(client, schoolCr),
  ]);

  const { at, timeOut }: SignInObject = await client
    .post(
      "/login",
      Client.formData({
        un,
        lt,
        ver,
        loginType: 1,
        ...school,
        ...passwordHash(salt, password),
      })
    )
    .then((res) => res.json());

  return { at, ver, timeOut };
}
