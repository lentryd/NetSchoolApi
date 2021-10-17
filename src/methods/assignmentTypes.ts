import NS from "@NS";
import AssignmentTypes from "@classes/AssignmentTypes";

export default async function (this: NS) {
  if (!(await this.sessionValid()))
    throw new Error("Сначала надо открыть сессию. (.logIn)");

  return this.client
    .get("grade/assignment/types", { params: { all: false } })
    .then((res) => res.json())
    .then((data) => new AssignmentTypes(data));
}
