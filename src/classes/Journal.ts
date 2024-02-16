import { str2date, date2JSON } from "@/utils/dateNum";
import { query, table } from "@/utils/parseHtml";
import { HTMLElement } from "node-html-parser";
import Context from "@/classes/Context";

interface Credentials {
  htmlText: string;
  subjects: Context["subjects"];
  hasTerms: boolean;
}

const MONTHS = {
  Сентябрь: "08",
  Октябрь: "09",
  Ноябрь: "10",
  Декабрь: "11",
  Январь: "12",
  Февраль: "13",
  Март: "14",
  Апрель: "15",
  Май: "16",
  Июнь: "17",
  Июль: "18",
  Август: "19",
};

const MONTH_NEW = {
  Сентябрь: "08",
  Октябрь: "09",
  Ноябрь: "10",
  Декабрь: "11",
  Январь: "00",
  Февраль: "01",
  Март: "02",
  Апрель: "03",
  Май: "04",
  Июнь: "05",
  Июль: "06",
  Август: "07",
};

function parseDates(
  startDate: Date,
  endDate: Date,
  monthsTr: HTMLElement,
  daysTr: HTMLElement
) {
  const isSameYear = startDate.getFullYear() === endDate.getFullYear();

  const days = daysTr.querySelectorAll("th").map((th) => +th.structuredText);
  const months = monthsTr.querySelectorAll("[colspan]").map((th) => ({
    length: +(th.getAttribute("colspan") ?? ""),
    number: !isSameYear
      ? +MONTHS[th.structuredText as keyof typeof MONTHS]
      : +MONTH_NEW[th.structuredText as keyof typeof MONTH_NEW],
  }));

  const result: Date[] = [];
  months.forEach(({ number, length }) => {
    const resultLength = result.length;

    for (let i = resultLength; i < resultLength + length; i++) {
      const date = new Date(startDate);
      date.setDate(days[i]);
      date.setMonth(number);

      result.push(date);
    }
  });

  return result;
}

export default class Journal {
  raw: string;
  range: { start: Date; end: Date };

  private hasTerms: boolean;
  private _subjects: Credentials["subjects"];

  constructor(credentials: Credentials) {
    this.raw = credentials.htmlText;
    this.hasTerms = credentials.hasTerms;
    this._subjects = credentials.subjects;

    const [start = "", end = ""] =
      query(
        this.raw,
        `table td:nth-child(2) > span:nth-child(${this.hasTerms ? 7 : 5})`
      )?.structuredText.match(/((\d{1,2}\.){2}\d{2})/g) ?? [];
    this.range = { start: str2date(start), end: str2date(end) };
  }

  get subjects() {
    const trs = table({
      html: this.raw,
      query: ".table-print",
      removeHeaders: false,
    });
    const dates = parseDates(this.range.start, this.range.end, trs[0], trs[1]);
    trs.splice(0, 2);

    return trs.map((tr) => {
      const [nameTd, markTd] = tr.querySelectorAll("[class]");
      const name = nameTd.rawText.trim();
      const middleMark = +markTd.rawText.replace(",", ".");

      const marks: { mark: number; date: Date }[] = [];
      const missedList: { type: string; date: Date }[] = [];
      tr.querySelectorAll(":not([class])").forEach((td, i) => {
        const date = dates[i];
        const content = td.rawText.trim();
        if (!content) return;

        content
          .match(/\d/g)
          ?.forEach((str) => marks.push({ mark: +str, date }));

        content
          .match(/[А-Яа-я]+/g)
          ?.forEach((type) => missedList.push({ type, date }));
      });

      return {
        id: this._subjects.find(({ name: n }) => n == name)?.id || NaN,
        name,
        marks,
        missedList,
        middleMark,
      };
    });
  }

  toJSON() {
    return {
      raw: this.raw,
      range: {
        start: date2JSON(this.range.start),
        end: date2JSON(this.range.end),
      },
      subjects: this.subjects.map((s) => ({
        ...s,
        marks: s.marks.map((m) => ({
          ...m,
          date: date2JSON(m.date),
        })),
        missedList: s.missedList.map((m) => ({
          ...m,
          date: date2JSON(m.date),
        })),
      })),
    };
  }
}
