import NetSchoolApi from "../NetSchoolApi-safe";
import AssignmentTypes from "../classes/AssignmentTypes";

export default function (this: NetSchoolApi) {
  return this.Client.get("grade/assignment/types?all=false")
    .then((res) => res.json())
    .then((data) => new AssignmentTypes(data));
}
