import * as crypto from "crypto";
import { Client } from "../classes/Client";
import Session from "../classes/Session";
import NetSchoolApi from "../NetSchoolApi-safe";

interface LogInContext {
  at: string;
  timeOut: number;
}

interface DiaryInfo {
  students: { studentId: number }[];
  currentStudentId: number;
}

interface Context {
  userId: number;
  schoolId: number;
  schoolYearId: number;
  globalYearId: number;
}

function md5(str: string): string {
  return crypto.createHash("md5").update(str).digest("hex");
}

function passwordHash(salt: string, password: string) {
  const pw2 = md5(salt + md5(password));
  const pw = pw2.substring(0, password.length);

  return { pw, pw2 };
}

function formData(this: NetSchoolApi) {
  return Promise.all([this._ttsLogin(), this._authData()]).then(
    ([school, { lt, ver, salt }]) => ({
      loginType: 1,
      un: this.credentials.login,
      ...passwordHash(salt, this.credentials.password),
      ...school,
      lt,
      ver,
    })
  );
}

function logInContext(this: NetSchoolApi): Promise<LogInContext> {
  return formData
    .call(this)
    .then((data) => this.Client.post("/login", Client.formData(data)))
    .then((res) => res.json());
}

function diaryInfo(this: NetSchoolApi, at: string): Promise<DiaryInfo> {
  return this.Client.get("student/diary/init", { headers: { at } }).then(
    (res) => res.json()
  );
}

function context(this: NetSchoolApi, at: string): Promise<Context> {
  return this.Client.get("context", { headers: { at } }).then((res) =>
    res.json()
  );
}

export default function logIn(this: NetSchoolApi): Promise<Session> {
  let userId = 0;
  let yearId = 0;
  let schoolId = 0;
  let studentsId: number[] = [];
  let expiryDate = 0;
  let accessToken = "";
  let globalYearId = 0;

  return logInContext
    .call(this)
    .then(({ at, timeOut }) => {
      accessToken = at;
      expiryDate = Date.now() + timeOut;

      return diaryInfo.call(this, at);
    })
    .then((diaryInfo) => {
      studentsId = diaryInfo.students.map(({ studentId }) => studentId);

      return context.call(this, accessToken);
    })
    .then((context) => {
      userId = context.userId;
      yearId = context.schoolYearId;
      schoolId = context.schoolId;
      globalYearId = context.globalYearId;

      this.session = new Session({
        userId,
        yearId,
        schoolId,
        expiryDate,
        studentsId,
        accessToken,
        globalYearId,
      });
      return this.session;
    });
}
