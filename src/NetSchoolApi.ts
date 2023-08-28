import NS, { Credentials } from "@NS";
import Session from "@/classes/Session";

let activeClasses = 0;
const errors: string[] = [];

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

  /** Начался ли процесс закрытия */
  private startClosing = false;

  constructor(credentials: Credentials) {
    super(credentials);

    activeClasses++;
    this.console.info(`Класс пользователя ${this.credentials.login} создан`);

    // Если нажали Ctrl + C, то закрываем сессию
    process.addListener("SIGINT", this.closeProcess.bind(this));

    // Прежде чем завершить процесс, мы закрываем сессию
    process.addListener("beforeExit", this.closeProcess.bind(this));

    // Если произошла ошибка, мы закрываем сессию
    process.addListener("uncaughtException", (err) => {
      if (!errors.includes(err.name)) {
        this.console.error("Ошибка в коде привела к закрытию программы", err);
        errors.push(err.name);
      }
      this.closeProcess.bind(this);
    });
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
    if (!(await super.sessionValid())) await super.logIn();

    return true;
  }

  /** Экстренное закрытие сессии */
  private async closeProcess() {
    if (this.startClosing) return;
    this.startClosing = true;

    // Закрываем сессию
    await this.logOut()
      .then(() =>
        this.console.done(`Сеанс ${this.credentials.login} успешно закрыт`)
      )
      .catch((err) =>
        this.console.error(
          `Ошибка закрытия сессии ${this.credentials.login}`,
          err
        )
      );

    // Уменьшаем счетчик
    activeClasses--;

    // Если счетчик пуст, то закрываем процесс
    if (activeClasses === 0) process.exit(0);
  }
}
