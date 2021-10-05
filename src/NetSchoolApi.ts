import NS, { Credentials } from "@NS";

export default class NetSchoolApi extends NS {
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

  /** Экстренное закрытие сессии */
  closeSession(err: any) {
    // Если поймали ошибку, то показываем ее
    if (err) {
      console.error(
        "\x1b[41m\x1b[30m ERROR \x1b[0m",
        "Ошибка в коде привела к закрытию сессии.\n",
        err
      );
    }

    return super.sessionValid().then((d) => {
      if (!d) {
        return true;
      } else {
        super
          .logOut()
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
    });
  }

  /** Повторное открытие сессии (всегда возвращает `true`) */
  sessionValid() {
    return super
      .sessionValid()
      .then((valid) => {
        if (valid) return;

        console.info(
          "\x1b[46m\x1b[30m INFO \x1b[0m",
          `У пользователя ${this.credentials.login} нет открытого сеанс. Сейчас мы откроем его 😄`
        );
        return super.logIn().then(() => {
          console.info(
            "\x1b[42m\x1b[30m DONE \x1b[0m",
            `Сеанс для ${this.credentials.login} успешно открыт.`
          );
        });
      })
      .then(() => true);
  }
}
