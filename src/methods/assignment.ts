import NS from "@NS";
import { sessionValid, studentIdValid } from "@utils/checks";
import AssignmentInfo from "@classes/AssignmentInfo";

export interface Credentials {
  studentId?: number;
  id: number;
}

export default async function (this: NS, credentials: Credentials) {
  const { client } = await sessionValid.call(this);

  let { id, studentId } = credentials;
  studentId = studentIdValid.call(this, credentials.studentId);

  return client
    .get(`student/diary/assigns/${id}`, { params: { studentId } })
    .then((res) => res.json() as any)
    .then((data) => new AssignmentInfo(data));
}
