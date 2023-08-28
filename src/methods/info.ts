import NS from "@NS";
import Info from "@/classes/Info";
import { sessionValid } from "@/utils/checks";

export default async function (this: NS) {
  const { client } = await sessionValid.call(this);

  return client
    .get("mysettings")
    .then((res) => res.json())
    .then((data) => new Info(data));
}
