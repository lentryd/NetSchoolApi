import NS from "@NS";
import WS from "ws";
import Client from "@classes/Client";
import { sessionValid } from "@utils/checks";

type Filter = {
  filterId: string;
  filterValue: string | number;
};

type Query = {
  _: string;
  at: string;
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
  timeout?: number;
}

export default async function reportFile(
  this: NS,
  credentials: Credentials
): Promise<string> {
  const { url, filters, timeout = 6e4 } = credentials;
  const { client, session, context } = await sessionValid.call(this);
  const query: Query = {
    _: session.ver,
    at: session.accessToken,
    transport: "webSockets",
    clientProtocol: 1.5,
    connectionData: '[{"name":"queuehub"}]',
  };
  const params = [
    { name: "DATEFORMAT", value: context.server.dateFormat },
    { name: "SCHOOLYEARID", value: context.year.id },
    { name: "SERVERTIMEZONE", value: 3 },
    { name: "FULLSCHOOLNAME", value: context.school.fullName },
  ];

  const { ConnectionToken } = (await client
    .get("signalr/negotiate", { params: query })
    .then((res) => res.json())) as NegotiateObject;
  query.connectionToken = ConnectionToken;

  const ws = client.ws("signalr/connect", { params: query });

  return new Promise((resolve, reject) => {
    let timeoutId = 0 as unknown as NodeJS.Timeout;

    ws.once("open", () => {
      client.get("signalr/start", { params: query });
      client
        .post(url, {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ params, selectedData: filters }),
        })
        .then((res) => res.json())
        .then(({ taskId }) => {
          if (timeout > 0)
            timeoutId = setTimeout(() => ws.close(4010), timeout);
          ws.send(
            JSON.stringify({
              I: 0,
              H: "queuehub",
              M: "StartTask",
              A: [taskId],
            })
          );
        })
        .catch(() => ws.close(4001));
    });

    ws.on("message", async (msg: string) => {
      let data: any;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        return;
      }

      switch (data?.M?.[0]?.M) {
        case "complete":
          ws.close(4000);
          const res = await client.get("files/" + data.M[0].A[0].Data);
          resolve(await res.text());
          break;
        case "error":
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
