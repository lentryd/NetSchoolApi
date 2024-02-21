import NS from "@NS";
import { sessionValid } from "@/utils/checks";

type Filter = {
  filterId: string;
  filterValue: string | number;
};

type Query = {
  _: string;
  at: string;
  tid?: string;
  transport: "webSockets";
  clientProtocol: number;
  connectionData: string;
  connectionToken?: string;
};

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

export interface Credentials {
  url: string;
  filters: Filter[];
  yearId?: number;
  timeout?: number;
}

export default async function reportFile(
  this: NS,
  credentials: Credentials
): Promise<string> {
  const { url, filters, yearId, timeout = 6e4 } = credentials;
  const { client, session, context } = await sessionValid.call(this);

  // Параметры запроса
  const query: Query = {
    _: session.ver,
    at: session.accessToken,
    transport: "webSockets",
    clientProtocol: 1.5,
    connectionData: '[{"name":"queuehub"}]',
  };
  const params = [
    { name: "DATEFORMAT", value: context.server.dateFormat },
    {
      name: "SCHOOLYEARID",
      value: (yearId ? yearId : context.year.id).toString(),
    },
    { name: "SERVERTIMEZONE", value: 3 },
    { name: "FULLSCHOOLNAME", value: context.school.fullName },
  ];

  // Получаем токен подключения
  const { ConnectionId, ConnectionToken } = (await client
    .get("signalr/negotiate", { params: query })
    .then((res) => res.json())) as NegotiateObject;
  query.tid = ConnectionId[0];
  query.connectionToken = ConnectionToken;

  // Создаем WebSocket и ждем ответа
  const ws = client.ws("signalr/connect", { params: query });
  return new Promise((resolve, reject) => {
    let fileCode: string | undefined;
    let timeoutId = 0 as unknown as NodeJS.Timeout;

    ws.once("open", async () => {
      await client
        .get("signalr/start", { params: query })
        .catch(() => ws.close(4001));
      await client
        .post(url, {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params, selectedData: filters }),
        })
        .then((res) => res.json())
        .then(({ taskId }) => {
          if (timeout > 0)
            timeoutId = setTimeout(() => ws.close(4010), timeout);

          const msg = [taskId];
          if (context.compareServerVersion("5.24.0.0") != -1)
            msg.push("report-v2");

          ws.send(
            JSON.stringify({
              I: 0,
              H: "queuehub",
              M: "StartTask",
              A: msg,
            })
          );
        })
        .catch(() => ws.close(4001));
    });

    ws.on("message", (msg: string) => {
      let data: any;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        return;
      }

      switch (data?.M?.[0]?.M) {
        case "complete":
          fileCode = data.M[0].A[0].Data;
          ws.close(4000);
          break;
        case "error":
          console.log("Ошибка: ", data.M[0].A[0]);
          console.error(data.M[0].A[0].Details);
          ws.close(4003, data.M[0].A[0].Details);
          break;
      }
    });

    ws.once("error", (err) => ws.close(4002, err.message));

    ws.once("close", async (code, message) => {
      clearTimeout(timeoutId);
      await client.post("signalr/abort", { params: query });

      switch (code) {
        case 1000:
        case 4000:
          if (!fileCode) return reject(new Error("Server didn't respond"));
          const res = await client.get("files/" + fileCode);
          resolve(await res.text());
          break;
        case 4001:
          reject(new Error("Error during initialization"));
          break;
        case 4002:
          reject(new Error("Error in socket.\nError: " + message));
          break;
        case 4003:
          reject(new Error("Error in task.\nError: " + message));
          break;
        case 4010:
          reject(new Error("Response time expired"));
          break;
        default:
          reject(new Error("Unknown error.\nError: " + message));
      }
    });
  });
}
