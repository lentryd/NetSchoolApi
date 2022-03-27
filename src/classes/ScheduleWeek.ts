import { date2JSON } from "@/utils/dateNum";
import { outerHTML, table } from "@/utils/parseHtml";
import ScheduleWeekLine from "./ScheduleWeekLine";

const DATE_REGEX = /Расписание.+?с (\d{1,2}\.\d{1,2}\.\d{1,2})/;

interface Credentials {
  htmlText: string;
}

export default class ScheduleWeek {
  raw: string;

  private _date: string;

  constructor(credentials: Credentials) {
    let date = credentials.htmlText.match(DATE_REGEX)?.[1] ?? "08.04.04";

    this.raw = outerHTML({ html: credentials.htmlText, query: ".table" });
    this._date = date2JSON(date);
  }

  get date() {
    return new Date(this._date);
  }

  get parsed(): ScheduleWeekLine[] {
    return table({ html: this.raw }).map((tr, i) => {
      const [numberTd, nameTd] = tr?.querySelectorAll?.("td") ?? [];

      const date = this.date;
      date.setDate(date.getDate() + i);
      const numbers = numberTd?.childNodes
        ?.filter((n) => n.nodeType == 3)
        ?.map((n) => parseInt(n.text));
      const names = nameTd?.childNodes
        ?.filter((n) => n.nodeType == 3)
        ?.map((n) => n.text);
      const lessons: ScheduleWeekLine["lessons"] = [];

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name == "-") continue;

        lessons.push({
          names: name.replace(/ \[.+?\]/g, "").split(", "),
          number: numbers[i],
          classesName: name
            .match(/\[(\d+?)\]/g)
            ?.map((n) => n.replace(/\[|\]/g, "")),
        });
      }

      return new ScheduleWeekLine({
        date: date2JSON(date),
        lessons,
      });
    });
  }

  toJSON() {
    return {
      raw: this.raw,
      date: this._date,
      parsed: this.parsed.map((i) => i.toJSON()),
    };
  }
}
