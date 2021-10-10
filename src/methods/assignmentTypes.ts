import NS from "@NS";
import Session from "@classes/Session";
import AssignmentTypes from "@classes/AssignmentTypes";

export default async function (this: NS) {
  if ((await this.sessionValid()) == false)
    throw new Error("Сначала надо открыть сессию. (.logIn)");

  const { client, session } = this;
  const { accessToken: at } = session as Session;

  return client
    .get("grade/assignment/types", {
      params: { all: false },
      headers: { at },
    })
    .then((res) => res.json())
    .then((data) => new AssignmentTypes(data));
}
