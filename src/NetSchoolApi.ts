import NS, { Credentials } from "@NS";
import Session from "@classes/Session";

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
    process.addListener("uncaughtException", (err) =>
      this.console.error(
        `В классе пользователя ${this.credentials.login} произошла ошибка\n`,
        err
      )
    );
  }

  /** Открытие сессии (только если она закрыта) */
  async logIn(): Promise<Session> {
    const valid = await super.sessionValid();

    if (valid) return this.session as any;
    else return super.logIn() as any;
  }

  /** Закрытие сессии (только если она открыта) */
  async logOut() {
    const valid = await super.sessionValid();

    if (valid) return super.logOut();
    else return null;
  }

  /** Повторное открытие сессии (всегда возвращает `true`) */
  async sessionValid(): Promise<true> {
    await super.logIn();

    return true;
  }

  /** Экстренное закрытие сессии */
  private async closeProcess() {
    // Закрываем сессию
    await this.logOut();

    // Уведомляем о закрытии
    this.console.done(`Сеанс ${this.credentials.login} успешно закрыт`);

    process.exit();
  }
}
