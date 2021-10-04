import NS from "@NS";

import signIn from "./methods/signIn";
import openSession from "./methods/openSession";

export default function (this: NS) {
  const { Client: client, credentials } = this;
  const { login, password, schoolName: school } = credentials;

  return signIn(login, password, school, client)
    .then(openSession.bind(null, client))
    .then((session) => (this.session = session));
}
