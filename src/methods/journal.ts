import NS from "@NS";
import Journal from "@/classes/Journal";
import { date2JSON } from "@/utils/dateNum";
import {
  classIdValid,
  dateValid,
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

  let { start, end, termId, classId, studentId } = credentials;
  termId = termIdValid.call(this, termId);
  classId = classIdValid.call(this, classId);
  studentId = studentIdValid.call(this, studentId);
  const termDates = await termDateValid.call(this, termId, start, end);
  start = termDates.start;
  end = termDates.end;

  const htmlText = await this.reportFile({
    url: "reports/studenttotal/queue",
    filters: [
      {
        filterId: "SID",
        filterValue: studentId,
      },
      {
        filterId: "PCLID",
        filterValue: classId,
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
  });

  return new Journal({
    htmlText,
    subjects: context.subjects,
    hasTerms: context.user.terms.length > 0,
  });
}
