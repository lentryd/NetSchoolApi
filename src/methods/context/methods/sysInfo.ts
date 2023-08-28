import Client from "@/classes/Client";

export default async function (client: Client) {
  const text = await client.get("sysInfo").then((res) => res.text());
  const id = text.match(/Id: (.+)/)?.[1] ?? "";
  const version = text.match(/Версия системы: (.+)/)?.[1] ?? "";

  return { server: { id, version } };
}
