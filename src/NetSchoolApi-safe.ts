import { Httpx } from "./classes/Httpx";
import Session from "./classes/Session";
import Diary from "./classes/Diary";
import AssignmentInfo from "./classes/AssignmentInfo";
import authData from "./methods/authData";
import diary, { DiaryCredentials } from "./methods/diary";
import assignment, { AssignmentCredentials } from "./methods/assignment";
import logIn from "./methods/logIn";
import logOut from "./methods/logOut";
import studentExists from "./methods/studentExists";
import ttsLogin from "./methods/ttsLogin";

export interface Credentials {
  origin: string;
  login: string;
  password: string;
  schoolName: string;
}

export default class NetSchoolApi_safe {
  Client: Httpx;
  session: null | Session = null;

  constructor(public credentials: Credentials) {
    this.Client = new Httpx(credentials.origin);
    this.Client.path = "/webapi";
  }

  // ⭐️ Управление аккаунтом

  /** Открытие сессии в "Сетевой город. Образование" */
  logIn(): Promise<Session> {
    return logIn.call(this);
  }

  /** Закрытие сессии в "Сетевой город. Образование" */
  logOut(): Promise<boolean> {
    return logOut.call(this);
  }

  // ⭐️ Проверки данные

  /** Существует ли `id` ученика */
  studentExists(id: number): boolean {
    return studentExists.call(this, id);
  }

  // ⭐️ Получение данных

  /** Дневник пользователя*/
  diary(credentials: DiaryCredentials): Promise<Diary> {
    return diary.call(this, credentials);
  }

  /** Информация о задание */
  assignment(credentials: AssignmentCredentials): Promise<AssignmentInfo> {
    return assignment.call(this, credentials);
  }

  // ⭐️ Просто надо (возможно потом их уберу)

  _authData = authData.bind(this);
  _ttsLogin = ttsLogin.bind(this);
}
