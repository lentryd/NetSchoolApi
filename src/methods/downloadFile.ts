import NS from "@NS";
import { sessionValid, studentIdValid } from "@utils/checks";

export interface Credentials {
  studentId?: number;
  assignId: number;
  id: number;
}

export default async function (this: NS, credentials: Credentials) {
  const { client } = await sessionValid.call(this);

  let { id, assignId, studentId } = credentials;
  studentId = studentIdValid.call(this, studentId);

  const response = await client
    .post("student/diary/get-attachments", {
      params: { studentId },
      headers: {
        Referer: client.join("../angular/school/studentdiary/"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignId: [assignId],
      }),
    })
    .then((res) => res.text());

  if (!response.includes(id.toString()))
    throw new Error(`Нет файла ${id} для задания ${assignId}`);

  return client.get(`attachments/${id}`).then((res) => res.buffer());
}
