import NetSchoolApi_safe, { Credentials } from "./NetSchoolApi-safe";
import { Credentials as DiaryCredentials } from "./methods/diary";

export default class NetSchoolApi extends NetSchoolApi_safe {
  constructor(credentials: Credentials) {
    super(credentials);

    console.info(
      "\x1b[46m\x1b[30m INFO \x1b[0m",
      `Класс для пользователя ${this.credentials.login} создан.`
    );

    // Если нажали Ctrl + C, то закрываем сессию
    process.addListener("SIGINT", this.closeSession.bind(this));

    // Прежде чем завершить процесс, мы закрываем сессию
    process.addListener("beforeExit", this.closeSession.bind(this));

    // Если произошла ошибка, мы также закрываем сессию
    process.addListener("uncaughtException", this.closeSession.bind(this));
    process.addListener("unhandledRejection", this.closeSession.bind(this));
  }

  openSession() {
    return new Promise((resolve) => {
      if (!this.session || this.session.isExpired()) {
        console.info(
          "\x1b[46m\x1b[30m INFO \x1b[0m",
          `У пользователя ${this.credentials.login} нет открытого сеанс. Сейчас мы откроем его 😄`
        );

        resolve(
          this.logIn().then((session) => {
            console.info(
              "\x1b[42m\x1b[30m DONE \x1b[0m",
              `Сеанс ${this.credentials.login} успешно открыт.`
            );
            return session;
          })
        );
      } else {
        resolve(this.session);
      }
    });
  }

  closeSession(err: any) {
    // Если поймали ошибку, то показываем ее
    if (err) {
      console.error(
        "\x1b[41m\x1b[30m ERROR \x1b[0m",
        "Ошибка в коде привела к закрытию сессии.\n",
        err
      );
    }

    // Сессия еще даже не создана, отдыхаем
    if (!this.session) return true;

    // Сессия уже завершена
    if (this.session.isExpired()) return true;

    // Уведомляем об открытой сессии
    console.info(
      "\x1b[46m\x1b[30m INFO \x1b[0m",
      `У пользователя ${this.credentials.login} обнаружен открытый сеанс. Мы закроем его сейчас 😄`
    );

    // Закрываем сессию и уведомляем об этот пользователя
    return this.logOut()
      .then(() =>
        console.info(
          "\x1b[42m\x1b[30m DONE \x1b[0m",
          `Сеанс ${this.credentials.login} успешно закрыт, хорошего дня 😏`
        )
      )
      .catch((err) =>
        console.error(
          "\x1b[41m\x1b[30m ERROR \x1b[0m",
          `Не удалось закрыт сеанс ${this.credentials.login} 😔\n`,
          err
        )
      )
      .finally(() => process.exit());
  }

  diary(credentials: DiaryCredentials) {
    return this.openSession().then(() => super.diary(credentials));
  }
}
