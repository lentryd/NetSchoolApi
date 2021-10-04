import { Client } from "@classes/Client";

interface Student {
  studentId: number;
  nickName: string;
  className?: any;
  classId: number;
  iupGrade: number;
}

interface DiaryInit {
  ttsuRl: string;
  weight: boolean;
  maxMark: number;
  yaClass: boolean;
  students: Student[];
  weekStart: Date;
  externalUrl: string;
  newDiskToken: string;
  withLaAssigns: boolean;
  yaClassAuthUrl?: any;
  currentStudentId: number;
  newDiskWasRequest: boolean;
}

export default function (client: Client, at: string) {
  return client
    .get("student/diary/init", { headers: { at } })
    .then((res) => res.json() as Promise<DiaryInit>)
    .then((data) => {
      if (!data || !data.students) {
        throw new Error("Сетевой не вернул данные дневника");
      } else {
        return data.students.map(({ studentId }) => studentId);
      }
    });
}
