import { Client } from "@classes/Client";

import { SignIn } from "./signIn";
import appContext from "./appContext";
import studentsList from "./studentsList";
import Session from "@/classes/Session";

export default function (client: Client, { at, ver, timeOut }: SignIn) {
  const expiryDate = Date.now() + timeOut;

  return Promise.all([appContext(client, at), studentsList(client, at)]).then(
    ([c, studentsId]) =>
      new Session({
        ...c,
        ver,
        expiryDate,
        studentsId,
        accessToken: at,
      })
  );
}
