import Session from "@classes/Session";
import Client from "@classes/Client";

export default async function (client: Client, session: null | Session) {
  if (!session) return true;

  return client
    .get("context/expired?token=" + session.accessToken)
    .then((res) => res.json() as Promise<boolean>);
}
