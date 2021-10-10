import NS from "@NS";
import Session from "@classes/Session";

import signIn from "./methods/signIn";
import openSession from "./methods/openSession";
import expiredSession from "@methods/logOut/methods/expiredSession";

export default async function (this: NS) {
  const { client, session, credentials } = this;
  const { login, password, school } = credentials;

  if ((await expiredSession(client, session)) == false)
    return session as Session;

  return signIn(login, password, school, client)
    .then((data) =>
      !session
        ? openSession(client, data)
        : new Session({
            ...session,
            accessToken: data.at,
            expiryDate: Date.now() + data.timeOut,
            ver: data.ver,
          })
    )
    .then((session) => (this.session = session));
}
