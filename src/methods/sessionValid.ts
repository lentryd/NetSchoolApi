import NS from "@NS";

export default async function (this: NS) {
  const { client, session } = this;
  if (!session) return false;

  const { accessToken: token } = session;

  return client
    .get("context/expired", { params: { token } })
    .then((res) => res.json())
    .then((b) => (typeof b == "boolean" ? !b : false));
}
