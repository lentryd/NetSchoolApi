import { parse } from "node-html-parser";
import ScheduleDayLine from "./ScheduleDayLine";

interface Credentials {
  date: string;
  htmlText: string;
}

function num2str(num: number | string) {
  if (typeof num == "string") num = parseInt(num);
  if (num < 10) return "0" + num;
  else return num.toString();
}

function timeFormat(date: string, strDate: string) {
  if (strDate.includes(" ")) {
    const [date1, time] = strDate.split(" ");
    const [day, month] = date1.split(".");

    return date
      .replace(/-\d{2}-/, "-" + num2str(month) + "-")
      .replace(/-\d{2}T/, "-" + num2str(day) + "T")
      .replace(/T.+/, "T" + time);
  } else {
    return date.replace(/T.+/, "T" + strDate);
  }
}

function parseHtml(html: string, date: string) {
  html = html.replace(/&nbsp;/g, " ");

  const result: ScheduleDayLine[] = [];
  const root = parse(html);
  const table = root.querySelector(".schedule-table");
  const trs = table?.querySelectorAll?.("tr") ?? [];

  trs.shift();
  trs.forEach((tr) => {
    const tds = tr?.querySelectorAll?.("td");
    let [start, end] = tds?.[0]?.structuredText.split(" - ");
    let name = tds?.[1]?.structuredText;
    const className = name.match(/\[(.+)\]/)?.[1];
    if (!start || !end || !name) return;
    if (className) name = name.replace(/ \[(.+)\]/, "");

    result.push(
      new ScheduleDayLine({
        name,
        className,
        startDate: timeFormat(date, start),
        endDate: timeFormat(date, end),
      })
    );
  });

  return result;
}

export default class ScheduleDay {
  lines: ScheduleDayLine[];

  private _date: string;

  constructor(credentials: Credentials) {
    this._date = credentials.date;
    this.lines = parseHtml(credentials.htmlText, credentials.date);
  }

  get date() {
    return new Date(this._date);
  }

  toJSON() {
    return {
      date: this._date,
      lines: this.lines.map((line) => line.toJSON()),
    };
  }
}
