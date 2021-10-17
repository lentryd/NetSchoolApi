import NS from "@NS";

import signOut from "./signOut";

export default async function (this: NS) {
  const { client, session } = this;

  if (session) await signOut(client, session);

  this.session = null;
}
