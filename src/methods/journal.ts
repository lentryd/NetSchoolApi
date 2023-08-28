import NS from "@NS";
import Journal from "@/classes/Journal";
import { date2JSON } from "@/utils/dateNum";
import {
  classIdValid,
  dateValid,
  sessionValid,
  studentIdValid,
} from "@/utils/checks";

export interface Credentials {
  start?: Date;
  end?: Date;
  classId?: number;
  studentId?: number;
}

export default async function journal(this: NS, credentials: Credentials = {}) {
  const { context } = await sessionValid.call(this);

  let { start, end, classId, studentId } = credentials;
  classId = classIdValid.call(this, classId);
  studentId = studentIdValid.call(this, studentId);
  if (!start) start = context.year.start;
  if (!end) end = context.year.end;
  dateValid.call(this, start, end);

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
        filterId: "period",
        filterValue: date2JSON(start) + " - " + date2JSON(end),
      },
    ],
  });

  return new Journal({ htmlText, subjects: context.subjects });
}
