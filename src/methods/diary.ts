import Diary from "../classes/Diary";
import Session from "../classes/Session";
import NetSchoolApi from "../NetSchoolApi-safe";

export interface Credentials {
  studentId?: number;
  startDate: Date;
  endDate: Date;
}

export default function (this: NetSchoolApi, credentials: Credentials) {
  const {
    studentId = this.session?.studentsId?.[0] ?? 2004,
    startDate,
    endDate,
  } = credentials;

  if (!this.studentExists(studentId))
    throw new Error(`Student ${studentId} not found`);

  const { accessToken, yearId } = this.session as Session;

  return this.Client.get(
    "student/diary?" +
      `yearId=${yearId}&` +
      `studentId=${studentId}&` +
      `weekEnd=${endDate.toJSON()}&` +
      `weekStart=${startDate.toJSON()}`,
    { headers: { at: accessToken } }
  )
    .then((res) => res.json())
    .then((data) => new Diary(data));
}
