import NS from "@NS";

import signOut from "./signOut";

export default async function (this: NS) {
  const { session } = this;

  if (session) await signOut.call(this, session);
  this.session = null;
}
