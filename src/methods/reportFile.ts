import NS from "@NS";
import Client from "@/classes/Client";
import { sessionValid } from "@/utils/checks";
import Context from "@/classes/Context";

//? Типы данных

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
   */
  transport?: 0 | 1;
}

/** Сообщения от сервера */
type Message = {
  /** Идентификатор сообщения */
  C: string;
  /** Сообщения */
  M: {
    /** Какая-то служебная фигня */
    H: "QueueHub";
    /** Тип сообщения */
    M: "error" | "progress" | "complete";
    /** Данные сообщения */
    A: {
      /** Какая-то служебная фигня */
      ComponentId: string;
      /** Сами данные */
      Data: string;
      /** Номер задачи */
      TaskId: number;
      /** Детали */
      Details?: string;
    }[];
  }[];
};

/** Фильтры отчета */
type Filter = {
  filterId: string;
  filterValue: string | number;
};

/** Параметры отчета */
type Param = {
  name: string;
  value: string | number;
};

/** Параметры для запуска формирования отчета */
type Query = {
  _: string;
  at: string;
  tid?: string;
  transport: "webSockets" | "longPolling";
  clientProtocol: number;
  connectionData: string;
  connectionToken?: string;
};

/** Ответ сервера на открытие соединения */
interface NegotiateObject {
  Url: string;
  ConnectionId: string;
  TryWebSockets: boolean;
  ProtocolVersion: string;
  ConnectionToken: string;
  KeepAliveTimeout: number;
  DisconnectTimeout: number;
  ConnectionTimeout: number;
  TransportConnectTimeout: number;
}

//? Функции помощники

/**
 * Получаем токен соединения
 * @param client клиент
 * @param params параметры для запроса
 */
async function negotiate(client: Client, params: Query) {
  return client
    .get("signalr/negotiate", { params })
    .then((res) => res.json() as Promise<NegotiateObject>);
}

/**
 * Формируем задачу
 * @param client клиент
 * @param url ссылка для запроса
 * @param params параметры запроса
 * @param filters фильтры запроса
 * @returns номер задачи
 */
async function getTaskId(
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
 * Форматируем сообщение
 * @param msg сообщение от сервера
 */
function messageHandler(msg: Message) {
  const { C: messageId, M } = msg;
  let error = M.find((m) => m.M === "error")?.A[0].Details;
  let fileCode = M.find((m) => m.M === "complete")?.A[0].Data;

  return { error, fileCode, messageId };
}

/**
 * Уведомляем сервер о открытии соединения
 * @param client клиент
 * @param params параметры для запроса
 */
async function startConnection(client: Client, params: Query) {
  return client
    .get("signalr/start", { params })
    .then((res) => res.json() as Promise<{ Response: string }>)
    .then(({ Response }) => {
      if (Response !== "started")
        throw new Error(
          "Соединение не удалось запустить, причина в том: " + Response
        );
      else return true;
    });
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
  context: Context,
  params: Query,
  taskId: number,
  timeout: number
) {
  // Создаем WebSocket
  const ws = client.ws("signalr/connect", { params });

  // Обрабатывает сообщения
  return new Promise<string>((resolve, reject) => {
    let fileCode: string | undefined;
    let timeoutId = 0 as unknown as NodeJS.Timeout;

    // Открываем соединение
    ws.once("open", async () => {
      // Открываем соединение
      await startConnection(client, params).catch(() => ws.close(4001));

      // Устанавливаем тайм-аут
      if (timeout > 0) timeoutId = setTimeout(() => ws.close(4010), timeout);

      // Уведомляем сервер о задаче
      const msg: (string | number)[] = [taskId];
      if (context.compareServerVersion("5.24.0.0") != -1) msg.push("report-v2");
      ws.send(
        JSON.stringify({
          I: 0,
          H: "queuehub",
          M: "StartTask",
          A: msg,
        })
      );
    });

    // Слушаем сообщения
    ws.on("message", (msg: string) => {
      // Пытаемся преобразовать сообщение в JSON
      let data: { error?: string; fileCode?: string; messageId: string };
      try {
        data = messageHandler(JSON.parse(msg));
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
      await client.post("signalr/abort", { params });

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

/**
 * Получение отчета с помощью Long Polling
 * @param client клиент
 * @param context контекст
 * @param params параметры запроса
 * @param taskId номер задачи
 * @param timeout время ожидания ответа
 * @returns идентификатор отчета
 */
async function longPollingConnection(
  client: Client,
  context: Context,
  params: Query,
  taskId: number,
  timeout: number
) {
  // Создаем соединение
  let messageId = await client
    .post("signalr/connect", { params })
    .then((res) => res.json())
    .then(({ C }) => C);

  // Открываем соединение
  let fileCode: string | undefined;
  let timeoutId = 0 as unknown as NodeJS.Timeout;
  let timeoutIsOut = false;
  await startConnection(client, params);

  // Устанавливаем тайм-аут
  if (timeout > 0) timeoutId = setTimeout(() => (timeoutIsOut = true), timeout);

  // Уведомляем сервер о задаче
  const msg: (string | number)[] = [taskId];
  if (context.compareServerVersion("5.24.0.0") != -1) msg.push("report-v2");
  await client.post("signalr/send", {
    params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body:
      "data=" +
      JSON.stringify({
        I: 0,
        H: "queuehub",
        M: "StartTask",
        A: msg,
      }),
  });

  // Получаем сообщения
  while (!timeoutIsOut && !fileCode) {
    // Получаем сообщение
    let data = await client
      .post("signalr/poll", {
        params,
        ...Client.formData({ messageId }),
      })
      .then((res) => res.json())
      .then(messageHandler);
    messageId = data.messageId;

    // Обрабатываем ошибку
    if (data.error) {
      console.error(data.error);
      throw new Error("Error in task.\nError: " + data.error);
    }

    // Обрабатываем идентификатор отчета
    if (data.fileCode) fileCode = data.fileCode;
  }

  if (timeoutIsOut) throw new Error("Response time expired");
  if (!fileCode) throw new Error("Server didn't respond");
  clearTimeout(timeoutId);
  return fileCode;
}

export default async function reportFile(
  this: NS,
  credentials: Credentials
): Promise<string> {
  const { url, filters, yearId, timeout = 6e4, transport } = credentials;
  const { client, session, context } = await sessionValid.call(this);

  // Параметры запроса
  const query: Query = {
    _: session.ver,
    at: session.accessToken,
    transport: "webSockets",
    clientProtocol: 1.5,
    connectionData: '[{"name":"queuehub"}]',
  };
  const params: Param[] = [
    { name: "DATEFORMAT", value: context.server.dateFormat },
    {
      name: "SCHOOLYEARID",
      value: (yearId ? yearId : context.year.id).toString(),
    },
    { name: "SERVERTIMEZONE", value: 3 },
    { name: "FULLSCHOOLNAME", value: context.school.fullName },
  ];

  // Получаем токен подключения
  const { ConnectionId, ConnectionToken } = await negotiate(client, query);
  query.tid = ConnectionId[0];
  query.connectionToken = ConnectionToken;

  // Получаем номер задачи
  const taskId = await getTaskId(client, url, params, filters);

  // Получаем идентификатор отчета
  let fileCode: string | undefined;
  if (
    transport == 0 ||
    (!transport && context.compareServerVersion("5.24.0.0") == -1)
  ) {
    query.transport = "webSockets";
    fileCode = await webSocketsConnection(
      client,
      context,
      query,
      taskId,
      timeout
    );
  } else if (
    transport == 1 ||
    (!transport && context.compareServerVersion("5.24.0.0") > -1)
  ) {
    query.transport = "longPolling";
    fileCode = await longPollingConnection(
      client,
      context,
      query,
      taskId,
      timeout
    );
  }

  // Возвращаем отчет
  if (!fileCode) throw new Error("Server didn't respond");
  return (await client.get("files/" + fileCode)).text();
}
