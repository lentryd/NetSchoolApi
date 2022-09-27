import NS from "@NS";
import Diary from "@classes/Diary";
import { sessionValid, dateValid, studentIdValid } from "@utils/checks";

export interface Credentials {
  studentId?: number;
  start?: Date;
  end?: Date;
}

export default async function (this: NS, credentials: Credentials = {}) {
  const { client, context } = await sessionValid.call(this);

  let { studentId, start, end } = credentials;
  studentId = studentIdValid.call(this, studentId);
  if (start && end) dateValid.call(this, start, end);
  else {
    const { weekStart } = await client
      .get("student/diary/init")
      .then((res) => res.json() as any);

    start = new Date(weekStart);
    end = new Date(weekStart);
    end.setDate(end.getDate() + 7);
  }

  return client
    .get("student/diary", {
      params: {
        yearId: context.year.id,
        studentId,
        weekEnd: end.toJSON().replace(/T.+/, ""),
        weekStart: start.toJSON().replace(/T.+/, ""),
      },
    })
    .then((res) => res.json() as any)
    .then((data) => new Diary(data));
}
