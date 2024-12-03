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
  /** Дата начала отчета (если `termId` не указан, либо равен `-1`, то должна быть в пределах учебного года, иначе в пределах выбранной четверти)  */
  start?: Date;
  /** Дата окончания отчета (если `termId` не указан, либо равен `-1`, то должна быть в пределах учебного года, иначе в пределах выбранной четверти) */
  end?: Date;
  /** ID четверти (берется текущая четверть) */
  termId?: number;
  /** ID класса (обычно берется первый из массива) */
  classId?: number;
  /** ID студента (обычно берется первый из массива) */
  studentId?: number;
  /** Какой протокол использовать
   *
   * 0 - Web Sockets, 1 - Long Polling
   *
   * если отсутствует, то используется Web Sockets или Long Polling (в зависимости от версии сервера)
   */

  transport?: 0 | 1;
}

export default async function journal(this: NS, credentials: Credentials = {}) {
  const { context } = await sessionValid.call(this);
  let { start, end, termId, classId, studentId, transport } = credentials;

  // Проверяем валидность данных
  const termData = termIdValid.call(this, termId);
  const classData = classIdValid.call(this, classId);
  const studentData = studentIdValid.call(this, studentId);

  // Если не указаны даты, то берем текущий учебный год
  const termDates = await termDateValid.call(this, termData.id, start, end);
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
        filterValue: studentData.value,
      },
      {
        filterId: "PCLID",
        filterValue: classData.id.toString(),
      },
      {
        filterId: "TERMID",
        filterValue: termData.value,
      },
      {
        filterId: "period",
        filterValue: date2JSON(start) + " - " + date2JSON(end),
      },
    ],
    transport,
  });

  return new Journal({
    htmlText,
    terms: context.user.terms,
    subjects: context.subjects,
  });
}
