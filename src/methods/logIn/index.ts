import NS from "@NS";
import Session from "@classes/Session";

import signIn from "./methods/signIn";

export default async function (this: NS) {
  const { client, credentials } = this;
  const { at: accessToken, ver, timeOut } = await signIn(client, credentials);

  this.session = new Session({
    ver,
    accessToken,
    expiryDate: Date.now() + timeOut,
  });
}
