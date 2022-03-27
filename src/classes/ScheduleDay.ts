import { outerHTML, table } from "@/utils/parseHtml";
import { num2str } from "@utils/number";
import ScheduleDayLine from "./ScheduleDayLine";

interface Credentials {
  date: string;
  htmlText: string;
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

export default class ScheduleDay {
  raw: string;

  private _date: string;

  constructor(credentials: Credentials) {
    this.raw = outerHTML({ html: credentials.htmlText, query: ".table" });
    this._date = credentials.date;
  }

  get date() {
    return new Date(this._date);
  }

  get lines(): ScheduleDayLine[] {
    return table({ html: this.raw }).map((tr) => {
      const [timeTd, nameTd] = tr?.querySelectorAll?.("td") ?? [];

      let [start, end] = timeTd?.structuredText.split(" - ");
      const startDate = timeFormat(this._date, start);
      const endDate = timeFormat(this._date, end);

      let name = nameTd?.structuredText;
      const className = name.match(/\[(.+)\]/)?.[1];
      if (className) name = name.replace(/ \[(.+)\]/, "");

      return new ScheduleDayLine({ name, endDate, startDate, className });
    });
  }

  toJSON() {
    return {
      raw: this.raw,
      date: this._date,
      lines: this.lines.map((line) => line.toJSON()),
    };
  }
}
