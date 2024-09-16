import NS from "@NS";
import Client from "@/classes/Client";
import Session from "@/classes/Session";

export default function (this: NS, session: Session) {
  const { accessToken: at, ver } = session;
  const url =
    this.context?.compareServerVersion("5.29.0.0") !== -1
      ? "auth/logout"
      : "../asp/logout.asp";

  return this.client.post(url, Client.formData({ at, ver }));
}
