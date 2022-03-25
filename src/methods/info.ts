import NS from "@NS";
import Info from "@classes/Info";

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

  return client
    .get("mysettings")
    .then((res) => res.json())
    .then((data) => new Info(data));
}
