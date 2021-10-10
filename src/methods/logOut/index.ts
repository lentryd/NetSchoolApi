import NS from "@NS";
import Session from "@classes/Session";

import expiredSession from "./methods/expiredSession";
import signOut from "./methods/signOut";

export default function (this: NS) {
  const { client, session } = this;

  return expiredSession(client, session).then((expired) =>
    expired
      ? undefined
      : signOut(client, session as Session).then(() => (this.session = null))
  );
}
