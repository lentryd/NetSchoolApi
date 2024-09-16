import Client, { InitRequest, requestHook } from "@/classes/Client";
import Session from "@/classes/Session";
import Context from "@/classes/Context";

import logIn from "@/methods/logIn";
import logOut from "@/methods/logOut";
import context from "@/methods/context";
import sessionValid from "@/methods/sessionValid";

import info from "@/methods/info";
import photo from "@/methods/photo";

import diary from "@/methods/diary";
import assignment from "@/methods/assignment";
import downloadFile from "@/methods/downloadFile";
import assignmentTypes from "@/methods/assignmentTypes";

import scheduleDay from "@/methods/scheduleDay";
import scheduleWeek from "@/methods/scheduleWeek";

import reportFile from "@/methods/reportFile";
import grades from "@/methods/grades";
import journal from "@/methods/journal";

import fetch from "@/methods/fetch";

import { Credentials as PhotoCredentials } from "@/methods/photo";
import { Credentials as DiaryCredentials } from "@/methods/diary";
import { Credentials as AssignmentCredentials } from "@/methods/assignment";
import { Credentials as DownloadFileCredentials } from "@/methods/downloadFile";
import { Credentials as ScheduleDayCredentials } from "@/methods/scheduleDay";
import { Credentials as ScheduleWeekCredentials } from "@/methods/scheduleWeek";
import { Credentials as ReportFileCredentials } from "@/methods/reportFile";
import { Credentials as GradesCredentials } from "@/methods/grades";
import { Credentials as JournalCredentials } from "@/methods/journal";

export type PasswordType = string | { hash: string; length: number };

export interface Credentials {
  login: string;
  origin: string;
  school: number | string;
  password: PasswordType;
}

export default class NetSchoolApiSafe {
  public context: null | Context = null;
  protected session: null | Session = null;

  protected client: Client;
  protected credentials: Credentials;

  /**
   * Создание пользователя
   * @/param credentials Данные пользователя
   */
  constructor(credentials: Credentials) {
    this.credentials = credentials;
    this.client = new Client(credentials.origin);
    this.client.onResponse(requestHook.bind(this.client));

    this.client.path.set("webapi");
    this.client.headers.set("at", () =>
      this.session?.isValid() ? this.session.accessToken : undefined
    );
  }

  // ⭐️ Пусть будет

  /** Произвольные запросы к сетевому */
  fetch(url: string, init?: InitRequest) {
    return fetch.call(this, url, init);
  }

  // ⭐️ Сессия

  /** Открытие сессии в "Сетевой город. Образование" */
  async logIn() {
    await logIn.call(this);

    if (!this.context) this.context = await context.call(this);

    return this.session;
  }

  /** Закрытие сессии в "Сетевой город. Образование" */
  async logOut() {
    await logOut.call(this);

    return (this.session = null);
  }

  /** Проверка сессии через API "Сетевой город. Образование"*/
  sessionValid() {
    return sessionValid.call(this);
  }

  // ⭐️ Пользователь

  /** Информация пользователя */
  info() {
    return info.call(this);
  }

  /** Фото пользователя */
  photo(credentials?: PhotoCredentials) {
    return photo.call(this, credentials);
  }

  // ⭐️ Дневник

  /** Дневник пользователя*/
  diary(credentials?: DiaryCredentials) {
    return diary.call(this, credentials);
  }

  /** Информация о задание */
  assignment(credentials: AssignmentCredentials) {
    return assignment.call(this, credentials);
  }

  /** Скачивание файла */
  downloadFile(credentials: DownloadFileCredentials) {
    return downloadFile.call(this, credentials);
  }

  /** Типы заданий */
  assignmentTypes() {
    return assignmentTypes.call(this);
  }

  // ⭐️ Расписание

  /** Расписание на день */
  scheduleDay(credentials?: ScheduleDayCredentials) {
    return scheduleDay.call(this, credentials);
  }

  /** Расписание на неделю */
  scheduleWeek(credentials?: ScheduleWeekCredentials) {
    return scheduleWeek.call(this, credentials);
  }

  // ⭐️ Отчеты
  reportFile(credentials: ReportFileCredentials) {
    return reportFile.call(this, credentials);
  }

  /** Отчет об успеваемости (по предмету) */
  grades(credentials: GradesCredentials) {
    return grades.call(this, credentials);
  }

  /** Отчет об успеваемости (полный) */
  journal(credentials: JournalCredentials) {
    return journal.call(this, credentials);
  }
}
