import Client from "@classes/Client";
import Session from "@classes/Session";
import Context from "@classes/Context";

import logIn from "@methods/logIn";
import logOut from "@methods/logOut";
import context from "@methods/context";
import sessionValid from "@methods/sessionValid";

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
}
