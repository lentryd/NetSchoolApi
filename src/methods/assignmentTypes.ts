import NS from "@NS";
import { sessionValid } from "@/utils/checks";
import AssignmentTypes from "@/classes/AssignmentTypes";

export default async function (this: NS) {
  await sessionValid.call(this);

  return this.client
    .get("grade/assignment/types", { params: { all: false } })
    .then((res) => res.json() as any)
    .then((data) => new AssignmentTypes(data));
}
