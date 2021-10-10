import NS from "@NS";

export default async function (this: NS) {
  const { client, session } = this;
  if (!session) return false;

  return client
    .get("context/expired?token=" + session.accessToken)
    .then((res) => res.json() as Promise<boolean>)
    .then((d) => !d);
}
