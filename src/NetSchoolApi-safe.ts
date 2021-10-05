import { Client } from "@classes/Client";
import Session from "@classes/Session";
import AssignmentTypes from "@classes/AssignmentTypes";

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
  origin: string;
  login: string;
  password: string;
  school: number | string;
}

export default class NetSchoolApiSafe {
  Client: Client;
  session: null | Session = null;

  constructor(public credentials: Credentials) {
    this.Client = new Client(credentials.origin);
    this.Client.path = "/webApi";
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
  assignmentTypes(): Promise<AssignmentTypes> {
    return assignmentTypes.call(this);
  }
}
