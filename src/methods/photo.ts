import NS from "@NS";
import Client from "@classes/Client";

export interface Credentials {
  studentId?: number;
}

export default async function (this: NS, credentials: Credentials = {}) {
  if (!(await this.sessionValid()) || !this.context)
    throw new Error("Сначала надо открыть сессию.");

  const { client, context } = this;
  let { studentId } = credentials;
  if (!studentId) {
    studentId = context.defaultStudent();
  } else if (!context.studentExists(studentId)) {
    throw new Error(`Нет пользователя ${studentId}`);
  }

  // Просто получаем куки
  await client.post(
    "../asp/MySettings/MySettings.asp",
    Client.formData(
      { ver: this.session?.ver, at: this.session?.accessToken },
      { params: { at: this.session?.accessToken } }
    )
  );

  return client
    .get("users/photo", {
      params: {
        AT: this.session?.accessToken,
        VER: this.session?.ver,
        userId: studentId,
      },
    })
    .then((res) => res.buffer());
}
