import NS from "@NS";
import Diary, { DiaryObject } from "@/classes/Diary";
import { sessionValid, dateValid, studentIdValid } from "@/utils/checks";
import { AttachmentObject, AnswerFilesObject } from "@/classes/Attachment";

type AttachmentRaw = {
  assignmentId: number;
  attachments: AttachmentObject[];
  answerFiles: AnswerFilesObject[];
};

export interface Credentials {
  studentId?: number;
  start?: Date;
  end?: Date;
}

export default async function (this: NS, credentials: Credentials = {}) {
  const { client, context } = await sessionValid.call(this);

  let { studentId, start, end } = credentials;
  studentId = studentIdValid.call(this, studentId).id;
  if (start && end) dateValid.call(this, start, end);
  else {
    const { weekStart } = await client
      .get("student/diary/init")
      .then((res) => res.json() as any);

    start = new Date(weekStart);
    end = new Date(weekStart);
    end.setDate(end.getDate() + 7);
  }

  const diaryRaw = await client
    .get("student/diary", {
      params: {
        yearId: context.year.id,
        studentId,
        weekEnd: end.toJSON().replace(/T.+/, ""),
        weekStart: start.toJSON().replace(/T.+/, ""),
      },
    })
    .then((res) => res.json() as unknown as DiaryObject);

  const assignments: number[] = [];
  diaryRaw.weekDays?.forEach((day) => {
    day.lessons.forEach((lesson) => {
      lesson.assignments?.forEach((assignment) => {
        assignments.push(assignment.id);
      });
    });
  });

  const attachmentsRaw = await client
    .post("student/diary/get-attachments", {
      params: { studentId },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignId: assignments,
      }),
    })
    .then((res) => res.json() as unknown as AttachmentRaw[]);

  const diaryObject = diaryRaw;
  if (diaryObject.weekDays)
    diaryObject.weekDays = diaryObject.weekDays.map((day) => ({
      ...day,
      lessons: day.lessons.map((lesson) => ({
        ...lesson,
        assignments: lesson.assignments?.map((assignment) => {
          const item = attachmentsRaw.find(
            ({ assignmentId }) => assignment.id === assignmentId
          );

          return {
            ...assignment,
            attachments: item?.attachments ?? [],
            answerFiles: item?.answerFiles ?? [],
          };
        }),
      })),
    }));

  return new Diary(diaryObject);
}
