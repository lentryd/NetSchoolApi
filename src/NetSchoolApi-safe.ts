import Client from "@classes/Client";
import Session from "@classes/Session";
import Context from "@classes/Context";

import logIn from "@methods/logIn";
import logOut from "@methods/logOut";
import context from "@methods/context";
import sessionValid from "@methods/sessionValid";

import info from "@methods/info";
import photo from "@methods/photo";

import diary from "@methods/diary";
import assignment from "@methods/assignment";
import assignmentTypes from "@methods/assignmentTypes";

import scheduleDay from "@methods/scheduleDay";
import scheduleWeek from "@methods/scheduleWeek";

import { Credentials as PhotoCredentials } from "@methods/photo";
import { Credentials as DiaryCredentials } from "@methods/diary";
import { Credentials as AssignmentCredentials } from "@methods/assignment";
import { Credentials as ScheduleDayCredentials } from "@methods/scheduleDay";
import { Credentials as ScheduleWeekCredentials } from "@methods/scheduleWeek";

export interface Credentials {
  login: string;
  origin: string;
  school: number | string;
  password: string;
}

export default class NetSchoolApiSafe {
  public context: null | Context = null;
  protected session: null | Session = null;

  protected client: Client;
  protected credentials: Credentials;

  /**
   * Создание пользователя
   * @param credentials Данные пользователя
   */
  constructor(credentials: Credentials) {
    this.credentials = credentials;
    this.client = new Client(credentials.origin);

    this.client.path.set("webApi");
    this.client.headers.set("at", () =>
      this.session?.isValid() ? this.session.accessToken : undefined
    );
  }

  // ⭐️ Сессия

  /** Открытие сессии в "Сетевой город. Образование" */
  async logIn() {
    await logIn.call(this);

    if (!this.context) {
      this.context = await context.call(this);
    }

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
}
