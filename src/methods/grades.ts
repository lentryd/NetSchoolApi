import NS from "@NS";
import Grades from "@classes/Grades";
import { date2JSON } from "@utils/dateNum";
import {
  sessionValid,
  dateValid,
  classIdValid,
  studentIdValid,
} from "@utils/checks";

export interface Credentials {
  subjectId: number;
  start?: Date;
  end?: Date;
  classId?: number;
  studentId?: number;
}

export default async function grades(this: NS, credentials: Credentials) {
  const { context } = await sessionValid.call(this);

  let { subjectId, start, end, classId, studentId } = credentials;
  if (!context.subjectExists(subjectId))
    throw new Error(`Предмета ${subjectId} не существует`);
  classId = classIdValid.call(this, classId);
  studentId = studentIdValid.call(this, studentId);
  if (!start) start = context.year.start;
  if (!end) end = context.year.end;
  dateValid.call(this, start, end);

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
          filterId: "period",
          filterValue: date2JSON(start) + " - " + date2JSON(end),
        },
      ],
    }),
  ]);

  return new Grades({ types, htmlText });
}
