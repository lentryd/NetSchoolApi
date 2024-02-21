import NS from "@NS";
import Journal from "@/classes/Journal";
import { date2JSON } from "@/utils/dateNum";
import {
  classIdValid,
  sessionValid,
  studentIdValid,
  termDateValid,
  termIdValid,
} from "@/utils/checks";

export interface Credentials {
  start?: Date;
  end?: Date;
  termId?: number;
  classId?: number;
  studentId?: number;
}

export default async function journal(this: NS, credentials: Credentials = {}) {
  const { context } = await sessionValid.call(this);

  // Проверяем параметры
  let { start, end, termId, classId, studentId } = credentials;
  termId = termIdValid.call(this, termId);
  classId = classIdValid.call(this, classId);
  studentId = studentIdValid.call(this, studentId);
  const termDates = await termDateValid.call(this, termId, start, end);
  start = termDates.start;
  end = termDates.end;

  // Получаем текст отчета
  const htmlText = await this.reportFile({
    url:
      context.compareServerVersion("5.24.0.0") == -1
        ? "reports/studenttotal/queue"
        : "v2/reports/studenttotal/queue",
    filters: [
      {
        filterId: "SID",
        filterValue: studentId.toString(),
      },
      {
        filterId: "PCLID",
        filterValue: classId.toString(),
      },
      {
        filterId: "TERMID",
        filterValue: termId.toString(),
      },
      {
        filterId: "period",
        filterValue: date2JSON(start) + " - " + date2JSON(end),
      },
    ],
  });

  return new Journal({
    htmlText,
    terms: context.user.terms,
    subjects: context.subjects,
  });
}
