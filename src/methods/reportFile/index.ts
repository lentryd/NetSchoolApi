import NS from "@NS";
import Client from "@/classes/Client";
import { sessionValid } from "@/utils/checks";
import legacy from "./legacy";

//? Типы данных

/** Фильтры отчета */
export type Filter = {
  filterId: string;
  filterValue: string | number;
};
/** Параметры отчета */
export type Param = {
  name: string;
  value: string | number;
};
export type Message =
  | {
      type: 1;
      target: "progress";
      arguments: Array<{
        taskId: number;
        status: string;
      }>;
    }
  | {
      type: 1;
      target: "complete";
      arguments: Array<{
        taskId: number;
        data: string;
        componentId: string;
      }>;
    }
  | {
      type: 3;
      invocationId: string;
      result: {
        success: boolean;
        message: any;
      };
    }
  | { error: string };
/** Параметры для инициализации */
export interface Credentials {
  /** Ссылка для запроса */
  url: string;
  /** Фильтры запроса */
  filters: Filter[];
  /** Идентификатор года отчета */
  yearId?: number;
  /** Время ожидания ответа */
  timeout?: number;
  /** Какой протокол использовать
   *
   * 0 - Web Sockets, 1 - Long Polling
   *
   * если отсутствует, то используется Web Sockets или Long Polling (в зависимости от версии сервера)
   * @deprecated в новых версиях сервера не используется longPolling
   */
  transport?: 0 | 1;
}

//? Функции помощники

/**
 * Формируем задачу
 * @param client клиент
 * @param url ссылка для запроса
 * @param params параметры запроса
 * @param filters фильтры запроса
 * @returns номер задачи
 */
export async function getTaskId(
  client: Client,
  url: string,
  params: Param[],
  filters: Filter[]
): Promise<number> {
  return await client
    .post(url, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ params, selectedData: filters }),
    })
    .then((res) => res.json())
    .then(({ taskId }) => taskId);
}

/**
 * Форматируем сообщение для WebSocket (с блядскими символами)
 * @param message сообщение (объект)
 * @param send нужно ли преобразовать в JSON
 * @returns сообщение (строка или буфер)
 */
function formatMsg(message: any, send: boolean = false): Buffer | any {
  if (send) return Buffer.from(JSON.stringify(message) + "");
  else return JSON.parse(message.toString().replace("", ""));
}

/**
 * Форматируем сообщение
 * @param msg сообщение от сервера
 */
function messageHandler(msg: Message) {
  // Обработка сообщения
  const data = {
    error: undefined as string | undefined,
    fileCode: undefined as string | undefined,
  };

  // Если отчет готов
  if ("type" in msg && msg.type === 1 && msg.target === "complete") {
    data.fileCode = msg.arguments.find((arg) => {
      const keys = Object.keys(arg);

      return keys.includes("taskId") && keys.includes("data");
    })?.data;
  }
  // Если произошла ошибка
  if ("error" in msg) data.error = msg.error;

  return data;
}

/**
 * Получение отчета с помощью Web Sockets
 * @param client клиент
 * @param context контекст
 * @param params параметры запроса
 * @param taskId номер задачи
 * @param timeout время ожидания ответа
 * @returns идентификатор отчета
 */
async function webSocketsConnection(
  client: Client,
  endpoint: string,
  at: string,
  taskId: number,
  timeout: number
) {
  // Создаем WebSocket
  const ws = client.ws(endpoint, { params: { at } });

  // Обрабатывает сообщения
  return new Promise<string>((resolve, reject) => {
    let fileCode: string | undefined;
    let timeoutId = 0 as unknown as NodeJS.Timeout;

    // Открываем соединение
    ws.once("open", async () => {
      // Устанавливаем тайм-аут
      if (timeout > 0) timeoutId = setTimeout(() => ws.close(4010), timeout);
      // Открываем соединение
      ws.send(formatMsg({ protocol: "json", version: 1 }, true));
      // Уведомляем сервер о задаче
      ws.send(
        formatMsg(
          {
            arguments: [taskId, "report-v2"],
            invocationId: "0",
            target: "startTask",
            type: 1,
          },
          true
        )
      );
    });

    // Слушаем сообщения
    ws.on("message", (msg: Buffer) => {
      // Пытаемся преобразовать сообщение в JSON
      let data: { error?: string; fileCode?: string };
      try {
        data = messageHandler(formatMsg(msg));
      } catch (e) {
        return;
      }

      // Обрабатываем ошибку
      if (data.error) {
        console.error(data.error);
        ws.close(4003, data.error);
      }

      // Обрабатываем
      if (data.fileCode) {
        fileCode = data.fileCode;
        ws.close(4000);
      }
    });

    // Обрабатываем ошибки соединения
    ws.once("error", (err) => ws.close(4002, err.message));

    // Закрываем соединение
    ws.once("close", async (code, message) => {
      clearTimeout(timeoutId);

      switch (code) {
        // Если соединение закрыто успешно
        case 1000:
        case 4000:
          if (!fileCode) return reject(new Error("Server didn't respond"));
          resolve(fileCode);
          break;

        // Если произошла ошибка инициализации
        case 4001:
          reject(new Error("Error during initialization"));
          break;

        // Если произошла ошибка с соединением
        case 4002:
          reject(new Error("Error in socket.\nError: " + message));
          break;

        // Если произошла ошибка с задачей
        case 4003:
          reject(new Error("Error in task.\nError: " + message));
          break;

        // Если вышло время ожидания
        case 4010:
          reject(new Error("Response time expired"));
          break;

        // Неизвестная ошибка
        default:
          reject(new Error("Unknown error.\nError: " + message));
      }
    });
  });
}

export default async function reportFile(
  this: NS,
  credentials: Credentials
): Promise<string> {
  const { url, filters, yearId, timeout = 6e4, transport } = credentials;
  const { client, session, context } = await sessionValid.call(this);

  // Параметры запроса
  const params: Param[] = [
    { name: "DATEFORMAT", value: context.server.dateFormat },
    {
      name: "SCHOOLYEARID",
      value: (yearId ? yearId : context.year.id).toString(),
    },
    { name: "SERVERTIMEZONE", value: 3 },
    { name: "FULLSCHOOLNAME", value: context.school.fullName },
  ];

  // Получаем идентификатор отчета
  let fileCode: string | undefined;

  // Если версия сервера меньше
  if (context.compareServerVersion("5.29.0.0") == -1) {
    fileCode = await legacy.call(this, params, credentials);
  }
  // Если версия сервера больше или равна
  else {
    // Получаем идентификатор задачи
    const taskId = await getTaskId(client, url, params, filters);
    // Формируем endpoint для ws
    const endpoint = context.compareServerVersion("5.32.0.0") == -1 ? 'queueHub' : 'signalr/queueHub';

    // Получаем идентификатор отчета
    fileCode = await webSocketsConnection(
      client,
      endpoint,
      session.accessToken,
      taskId,
      timeout
    );
  }

  // Возвращаем отчет
  if (!fileCode) throw new Error("Server didn't respond");
  return (await client.get("files/" + fileCode)).text();
}
