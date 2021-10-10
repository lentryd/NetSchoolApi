import Client from "@classes/Client";
import Session from "@classes/Session";

import checkSession from "@checks/checkSession";
import studentExists from "@checks/studentExists";

import logIn from "@methods/logIn";
import logOut from "@methods/logOut";

import diary from "@methods/diary";
import assignment from "@methods/assignment";
import assignmentTypes from "@methods/assignmentTypes";

import { Credentials as DiaryCredentials } from "@methods/diary";
import { Credentials as AssignmentCredentials } from "@methods/assignment";

export interface Credentials {
  login: string;
  origin: string;
  school: number | string;
  password: string;
}

export default class NetSchoolApiSafe {
  client: Client;
  session: null | Session = null;

  /**
   * Создание пользователя
   * @param credentials Авторизационные данные пользователя
   */
  constructor(public credentials: Credentials) {
    this.client = new Client(credentials.origin);

    this.client.path.set("webApi");
    this.client.headers.set("at", () =>
      this.session?.isValid() ? this.session.accessToken : undefined
    );
  }

  // ⭐️ Управление сессией

  /** Открытие сессии в "Сетевой город. Образование" */
  logIn() {
    return logIn.call(this);
  }

  /** Закрытие сессии в "Сетевой город. Образование" */
  logOut() {
    return logOut.call(this);
  }

  // ⭐️ Различные проверки

  /** Проверка сессии через API "Сетевой город. Образование"*/
  sessionValid() {
    return checkSession.call(this);
  }

  /** Существует ли `id` ученика */
  studentExists(id: number) {
    return studentExists.call(this, id);
  }

  // ⭐️ Получение данных

  /** Дневник пользователя*/
  diary(credentials: DiaryCredentials) {
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
}
