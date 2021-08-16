import NetSchoolApi from "../NetSchoolApi-safe";

export default function (this: NetSchoolApi, id: number): boolean {
  if (!this.session || this.session.isExpired())
    throw new Error("Session is expired");

  return !!this.session.studentsId.find((sid) => id === sid);
}
