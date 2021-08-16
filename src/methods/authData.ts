import NetSchoolApi from "../NetSchoolApi-safe";

export interface AuthData {
  lt: string;
  ver: string;
  salt: string;
}

export default function authData(this: NetSchoolApi): Promise<AuthData> {
  return this.Client.post("auth/getdata").then((res) => res.json());
}
