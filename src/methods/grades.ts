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
  subjectId: number;
  start?: Date;
  end?: Date;
  termId?: number;
  classId?: number;
  studentId?: number;
}

export default async function grades(this: NS, credentials: Credentials) {
  const { context } = await sessionValid.call(this);

  let { subjectId, start, end, termId, classId, studentId } = credentials;
  if (!context.subjectExists(subjectId))
    throw new Error(`Предмета ${subjectId} не существует`);
  termId = termIdValid.call(this, termId);
  classId = classIdValid.call(this, classId);
  studentId = studentIdValid.call(this, studentId);
  const termDates = await termDateValid.call(this, termId, start, end);
  start = termDates.start;
  end = termDates.end;

  const [types, htmlText] = await Promise.all([
    this.assignmentTypes(),
    this.reportFile({
      url: "reports/studentgrades/queue",
      filters: [
        {
          filterId: "SID",
          filterValue: studentId,
        },
        {
          filterId: "PCLID_IUP",
          filterValue: classId + "_0",
        },
        {
          filterId: "SGID",
          filterValue: subjectId,
        },
        {
          filterId: "TERMID",
          filterValue: termId,
        },
        {
          filterId: "period",
          filterValue: date2JSON(start) + " - " + date2JSON(end),
        },
      ],
    }),
  ]);

  return new Grades({
    types,
    htmlText,
    hasTerms: context.user.terms.length > 0,
  });
}
