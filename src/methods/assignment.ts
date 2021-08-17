import AssignmentInfo from "../classes/AssignmentInfo";
import Session from "../classes/Session";
import NetSchoolApi from "../NetSchoolApi-safe";

export interface AssignmentCredentials {
  studentId?: number;
  id: number;
}

export default function (
  this: NetSchoolApi,
  credentials: AssignmentCredentials
) {
  const { studentId = this.session?.studentsId?.[0] ?? 2004, id } = credentials;

  if (!this.studentExists(studentId))
    throw new Error(`Student ${studentId} not found`);

  const { accessToken: at } = this.session as Session;

  return this.Client.get(`student/diary/assigns/${id}?studentId=${studentId}`, {
    headers: { at },
  })
    .then((res) => res.json())
    .then((data) => new AssignmentInfo(data));
}
