import NS from "@NS";
import Diary from "@classes/Diary";

export interface Credentials {
  studentId?: number;
  start?: Date;
  end?: Date;
}

export default async function (this: NS, credentials: Credentials = {}) {
  const { client, context } = this;
  if (!context || !(await this.sessionValid()))
    throw new Error("Сначала надо открыть сессию.");

  let { studentId, start, end } = credentials;
  if (!studentId) {
    studentId = context.defaultStudent();
  } else if (!context.studentExists(studentId)) {
    throw new Error(`Нет пользователя ${studentId}`);
  }

  if (!start || !end) {
    const { weekStart } = await client
      .get("student/diary/init")
      .then((res) => res.json());

    start = end = new Date(weekStart);
    end.setDate(end.getDate() + 7);
  }

  return client
    .get("student/diary", {
      params: {
        yearId: context.year.id,
        studentId,
        weekEnd: end.toJSON(),
        weekStart: start.toJSON(),
      },
    })
    .then((res) => res.json())
    .then((data) => new Diary(data));
}
