import NS from "@NS";
import Diary from "@classes/Diary";
import Session from "@classes/Session";

export interface Credentials {
  studentId?: number;
  start: Date;
  end: Date;
}

export default async function (this: NS, credentials: Credentials) {
  if ((await this.sessionValid()) == false)
    throw new Error("Сначала надо открыть сессию. (.logIn)");

  const { Client: client, session } = this;
  const { accessToken: at, ver: vers, yearId, studentsId } = session as Session;
  let { studentId, start, end } = credentials;

  if (!studentId) studentId = studentsId[0];
  if (!this.studentExists(studentId))
    throw new Error(`Нет пользователя ${studentId}`);

  return client
    .get("student/diary", {
      params: {
        vers,
        yearId,
        studentId,
        weekEnd: end.toJSON(),
        weekStart: start.toJSON(),
      },
      headers: { at },
    })
    .then((res) => res.json())
    .then((data) => new Diary(data));
}
