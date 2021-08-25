import { Client } from "../classes/Client";
import NetSchoolApi from "../NetSchoolApi-safe";

export default function logOut(this: NetSchoolApi) {
  return this.Client.post(
    "../asp/logout.asp",
    Client.formData({ at: this.session?.accessToken })
  ).then((res) => {
    if (res.status != 200)
      throw new Error("Не удалось выйти, код: " + res.status);

    this.session = null;
    return true;
  });
}
