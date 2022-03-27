import NS from "@NS";
import Client from "@classes/Client";
import ScheduleDay from "@classes/ScheduleDay";
import { date2str } from "@utils/dateNum";
import { sessionValid, dateValid, classIdValid } from "@utils/checks";

export interface Credentials {
  date?: Date;
  classId?: number;
}

export default async function (this: NS, credentials: Credentials = {}) {
  const { client, session } = await sessionValid.call(this);
  const { accessToken: at, ver } = session;

  let { date, classId } = credentials;
  if (!date) date = new Date();
  else dateValid.call(this, date);

  const htmlText = await client
    .post(
      "../asp/Calendar/DayViewS.asp",
      Client.formData({
        at,
        ver,
        date: date2str(date),
        PCLID_IUP: classIdValid.call(this, classId) + "_0",
        LoginType: 0,
      })
    )
    .then((res) => res.text());

  return new ScheduleDay({
    date: date.toJSON().replace(/T.+/, "T00:00"),
    htmlText,
  });
}
