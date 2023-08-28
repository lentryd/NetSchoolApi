import NS from "@NS";
import { InitRequest } from "@/classes/Client";
import { sessionValid } from "@/utils/checks";

export default async function (this: NS, url: string, init?: InitRequest) {
  const { client } = await sessionValid.call(this);

  return client.request("../" + url, init);
}
