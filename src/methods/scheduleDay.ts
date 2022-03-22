import NS from "@NS";
import Client from "@classes/Client";
import ScheduleDay from "@classes/ScheduleDay";

function date2str(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 100;

  return day + "." + month + "." + year;
}

export interface Credentials {
  studentId?: number;
  classId?: number;
  date?: Date;
}

export default async function (this: NS, credentials: Credentials = {}) {
  if (!(await this.sessionValid()) || !this.context)
    throw new Error("Сначала надо открыть сессию.");

  const { client, context } = this;
  let { studentId, classId, date } = credentials;
  if (!date) date = new Date();
  if (!studentId) studentId = context.defaultStudent();
  else if (!context.studentExists(studentId)) {
    throw new Error(`Нет пользователя ${studentId}`);
  }
  if (!classId) classId = context.defaultClass();
  else if (!context.classExists(classId)) {
    throw new Error(`Нет класса ${classId}`);
  }

  const htmlText = await client
    .post(
      "../asp/Calendar/DayViewS.asp",
      Client.formData({
        AT: this.session?.accessToken,
        VER: this.session?.ver,
        DATE: date2str(date),
        PCLID_IUP: classId + "_0",
        LoginType: 0,
      })
    )
    .then((res) => res.text());

  return new ScheduleDay({
    date: date.toJSON().replace(/T.+/, "T00:00"),
    htmlText,
  });
}
