import Diary from "../classes/Diary";
import Session from "../classes/Session";
import NetSchoolApi from "../NetSchoolApi-safe";

export interface DiaryCredentials {
  studentId?: number;
  start: Date;
  end: Date;
}

export default function (this: NetSchoolApi, credentials: DiaryCredentials) {
  const {
    studentId = this.session?.studentsId?.[0] ?? 2004,
    start: startDate,
    end: endDate,
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
