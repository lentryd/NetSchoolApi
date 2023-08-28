import Session from "@/classes/Session";
import Client from "@/classes/Client";

export default function (client: Client, session: Session) {
  const { accessToken: at, ver } = session;

  return client.post("../asp/logout.asp", Client.formData({ at, ver }));
}
