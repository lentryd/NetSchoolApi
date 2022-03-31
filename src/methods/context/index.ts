import NS from "@NS";
import Context from "@classes/Context";

import sysInfo from "./methods/sysInfo";
import context from "./methods/context";
import schoolInfo from "./methods/schoolInfo";
import studentGrades from "./methods/studentGrades";

export default async function (this: NS) {
  const { client } = this;

  const [
    { server },
    { year, user, server: server1, schoolId },
    { user: user1, subjects, range },
  ] = await Promise.all([
    sysInfo(client),
    context(client),
    studentGrades(client),
  ]);

  return new Context({
    year,
    user: { ...user, ...user1 },
    server: { ...server, ...server1 },
    school: { ...(await schoolInfo(client, schoolId)), id: schoolId },
    subjects,
    reportRange: {
      start: range?.start ? new Date(range.start) : year.start,
      end: range?.end ? new Date(range.end) : year.end,
    },
  });
}
