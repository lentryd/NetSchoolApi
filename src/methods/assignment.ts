import NS from "@NS";
import AssignmentInfo from "@classes/AssignmentInfo";

export interface Credentials {
  studentId?: number;
  id: number;
}

export default async function (this: NS, credentials: Credentials) {
  if (!(await this.sessionValid()) || !this.context) {
    throw new Error("Сначала надо открыть сессию. (.logIn)");
  }

  const { client, context } = this;
  let { studentId, id } = credentials;
  if (!studentId) {
    studentId = context.defaultStudent();
  } else if (!context.studentExists(studentId)) {
    throw new Error(`Нет пользователя ${studentId}`);
  }

  return client
    .get(`student/diary/assigns/${id}`, { params: { studentId } })
    .then((res) => res.json())
    .then((data) => new AssignmentInfo(data));
}
