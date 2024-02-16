import { str2date, date2JSON } from "@/utils/dateNum";
import { query, table } from "@/utils/parseHtml";
import AssignmentTypes from "./AssignmentTypes";

interface Credentials {
  types: AssignmentTypes;
  htmlText: string;
  hasTerms: boolean;
}

export default class Grades {
  raw: string;
  range: { start: Date; end: Date };
  teacher: string;
  averageMark: number;

  private _types: AssignmentTypes;

  constructor(credentials: Credentials) {
    this.raw = credentials.htmlText;
    this._types = credentials.types;

    const [start = "", end = ""] =
      query(
        this.raw,
        `table td:nth-child(2) > span:nth-child(${
          credentials.hasTerms ? 5 : 3
        })`
      )?.structuredText.match(/((\d{1,2}\.){2}\d{2})/g) ?? [];
    this.range = { start: str2date(start), end: str2date(end) };

    this.teacher =
      query(
        this.raw,
        `table td:nth-child(2) > span:nth-child(${
          credentials.hasTerms ? 11 : 9
        })`
      )?.childNodes[1].text.trim() ?? "";

    this.averageMark = +(
      query(this.raw, ".table-print tr.totals td:nth-child(3)")
        ?.structuredText.replace(",", ".")
        .replace?.(/^\D+(?=\d)/, "") ?? ""
    );
  }

  get assignments() {
    const trs = table({ html: this.raw, query: ".table-print" });
    trs.pop();

    return trs.map((tr) => {
      const [typeTd, themeTd, dateTd, issueDateTd, markTd] =
        tr.querySelectorAll("td") ?? [];

      return {
        type: this._types.findByName(typeTd?.structuredText),
        theme: themeTd?.structuredText,
        date: str2date(dateTd?.structuredText),
        issueDate: str2date(issueDateTd?.structuredText),
        mark: +markTd?.structuredText,
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
      teacher: this.teacher,
      assignments: this.assignments.map((a) => ({
        ...a,
        date: date2JSON(a.date),
        issueDate: date2JSON(a.issueDate),
      })),
    };
  }
}
