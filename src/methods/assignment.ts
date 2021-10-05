import NS from "@NS";
import Session from "@classes/Session";
import AssignmentInfo from "@classes/AssignmentInfo";

export interface Credentials {
  studentId?: number;
  id: number;
}

export default async function (this: NS, credentials: Credentials) {
  if ((await this.sessionValid()) == false)
    throw new Error("Сначала надо открыть сессию. (.logIn)");

  const { Client: client, session } = this;
  const { accessToken: at, studentsId } = session as Session;
  let { studentId, id } = credentials;

  if (!studentId) studentId = studentsId[0];
  if (!this.studentExists(studentId))
    throw new Error(`Нет пользователя ${studentId}`);

  return client
    .get(`student/diary/assigns/${id}`, {
      params: { studentId },
      headers: { at },
    })
    .then((res) => res.json())
    .then((data) => new AssignmentInfo(data));
}
