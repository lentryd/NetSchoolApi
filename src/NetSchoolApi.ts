import NS, { Credentials } from "@NS";

export default class NetSchoolApi extends NS {
  /** Уведомления */
  private console = {
    info(title: string, ...optionalParams: any[]) {
      console.info("\x1b[46m\x1b[30m INFO \x1b[0m", title);
      if (!!optionalParams) console.info(...optionalParams);
    },

    done(title: string, ...optionalParams: any[]) {
      console.info("\x1b[42m\x1b[30m DONE \x1b[0m", title);
      if (!!optionalParams) console.info(...optionalParams);
    },

    error(title: string, ...optionalParams: any[]) {
      console.error("\x1b[41m\x1b[30m ERROR \x1b[0m", title);
      if (!!optionalParams) console.error(...optionalParams);
    },
  };

  constructor(credentials: Credentials) {
    super(credentials);

    this.console.info(`Класс пользователя ${this.credentials.login} создан`);

    // Если нажали Ctrl + C, то закрываем сессию
    process.addListener("SIGINT", this.closeProcess.bind(this));

    // Прежде чем завершить процесс, мы закрываем сессию
    process.addListener("beforeExit", this.closeProcess.bind(this));

    // Если произошла ошибка, мы также закрываем сессию
    process.addListener("uncaughtException", this.closeProcess.bind(this));
    process.addListener("unhandledRejection", this.closeProcess.bind(this));
  }

  /** Открытие сессии (только если она закрыта) */
  async logIn() {
    const valid = await super.sessionValid();

    if (valid) return this.session;
    else return super.logIn();
  }

  /** Закрытие сессии (только если она открыта) */
  async logOut() {
    const valid = await super.sessionValid();

    if (valid) return super.logOut();
    else return null;
  }

  /** Повторное открытие сессии (всегда возвращает `true`) */
  async sessionValid() {
    await super.logIn();

    return true;
  }

  /** Экстренное закрытие сессии */
  async closeProcess(err: any) {
    // Если поймали ошибку, то показываем ее
    if (err)
      this.console.error("Ошибка в коде привела к закрытию сессии.", err);

    // Закрываем сессию
    await this.logOut();

    // Уведомляем о закрытии
    this.console.done(`Сеанс ${this.credentials.login} успешно закрыт`);

    process.exit();
  }
}
