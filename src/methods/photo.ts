import NS from "@NS";
import Client from "@classes/Client";
import { sessionValid, studentIdValid } from "@utils/checks";

export interface Credentials {
  studentId?: number;
}

export default async function (this: NS, credentials: Credentials = {}) {
  const { client, session } = await sessionValid.call(this);
  const { accessToken: at, ver } = session;
  const userId = studentIdValid.call(this, credentials.studentId);

  // Просто получаем куки
  await client.post(
    "../asp/MySettings/MySettings.asp",
    Client.formData({ at, ver }, { params: { at } })
  );

  return client
    .get("users/photo", { params: { at, ver, userId } })
    .then((res) => res.buffer());
}
