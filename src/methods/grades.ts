import NS from "@NS";
import Grades from "@/classes/Grades";
import { date2JSON } from "@/utils/dateNum";
import {
  sessionValid,
  dateValid,
  termIdValid,
  classIdValid,
  studentIdValid,
  termDateValid,
} from "@/utils/checks";

export interface Credentials {
  /** ID предмета */
  subjectId: number;
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

export default async function grades(this: NS, credentials: Credentials) {
  const { context } = await sessionValid.call(this);
  let { subjectId, start, end, termId, classId, studentId, transport } =
    credentials;

  // Проверяем существует ли предмет
  if (!context.subjectExists(subjectId))
    throw new Error(`Предмета ${subjectId} не существует`);

  // Проверяем валидность данных
  const termData = termIdValid.call(this, termId);
  const classData = classIdValid.call(this, classId);
  const studentData = studentIdValid.call(this, studentId);

  // Если не указаны даты, то берем текущий учебный год
  const termDates = await termDateValid.call(this, termData.id, start, end);
  start = termDates.start;
  end = termDates.end;

  const [types, htmlText] = await Promise.all([
    this.assignmentTypes(),
    this.reportFile({
      url: "reports/studentgrades/queue",
      filters: [
        {
          filterId: "SID",
          filterValue: studentData.value,
        },
        {
          filterId: "PCLID_IUP",
          filterValue: classData.value,
        },
        {
          filterId: "SGID",
          filterValue: subjectId,
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
    }),
  ]);

  return new Grades({
    types,
    htmlText,
    hasTerms: context.user.terms.length > 0,
  });
}
