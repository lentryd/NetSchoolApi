import Context from "@/classes/Context";
import { str2date, date2JSON } from "@/utils/dateNum";
import { query, queryAll, table } from "@/utils/parseHtml";

//? Константы

// Селекторы промежутков
const RANGE_SELECTOR = "table td:nth-child(2) > span:nth-child(5)";
const RANGE_SELECTOR_V2 = "table td:nth-child(2) > span:nth-child(7)";

// Селектор дней
const DAYS_SELECTOR = "table.table-print tr:nth-child(2) > th";

// Селектор месяцев
const MONTHS_SELECTOR = "table.table-print tr:nth-child(1) > th[colspan]";

// Расшифровка названия месяцев в числа (разные года)
const MONTH_NUMBERS = {
  Сентябрь: 8,
  Октябрь: 9,
  Ноябрь: 10,
  Декабрь: 11,
  Январь: 12,
  Февраль: 13,
  Март: 14,
  Апрель: 15,
  Май: 16,
  Июнь: 17,
  Июль: 18,
  Август: 19,
};
// Расшифровка названия месяцев в числа (одинаковые года года)
const MONTH_NUMBERS_SY = {
  Сентябрь: 8,
  Октябрь: 9,
  Ноябрь: 10,
  Декабрь: 11,
  Январь: 0,
  Февраль: 1,
  Март: 2,
  Апрель: 3,
  Май: 4,
  Июнь: 5,
  Июль: 6,
  Август: 7,
};

//? Типы данных
/** Параметры для инициализации */
interface Credentials {
  htmlText: string;
  terms: Context["user"]["terms"];
  subjects: Context["subjects"];
}

/** Тип данных распарсенных предметов */
export interface Subject {
  /** ID предмета */
  id: number;
  /** Название предмета */
  name: string;

  /** Массив оценок */
  marks: { mark: number; date: Date; termId: number }[];
  /** Массив точек (долгов) */
  dotList: { date: Date; termId: number }[];
  /** Массив пропусков */
  missedList: { type: string; date: Date; termId: number }[];

  /** Итоговые оценки */
  totalMarks: { mark: number; termId: number }[];
  /** Средние оценки */
  middleMarks: { mark: number; termId: number }[];
  /** Средняя оценка за выбранный период */
  periodMiddleMark: number;

  /** Средняя оценка
   *
   * _В следующих версиях будет удален, используйте .periodMiddleMark_
   * @deprecated */
  middleMark: number;
}

/** Тип данных распарсенных предметов (JSON) */
export interface SubjectData {
  /** ID предмета */
  id: number;
  /** Название предмета */
  name: string;

  /** Массив оценок */
  marks: { mark: number; date: string; termId: number }[];
  /** Массив точек (долгов) */
  dotList: { date: string; termId: number }[];
  /** Массив пропусков */
  missedList: { type: string; date: string; termId: number }[];

  /** Итоговые оценки */
  totalMarks: { mark: number; termId: number }[];
  /** Средние оценки */
  middleMarks: { mark: number; termId: number }[];
  /** Средняя оценка за выбранный период */
  periodMiddleMark: number;

  /** Средняя оценка
   *
   * _В следующих версиях будет удален, используйте .periodMiddleMark_
   * @deprecated */
  middleMark: number;
}

/** Данные журнала в формате JSON */
export interface JournalData {
  raw: string;
  range: { start: string; end: string };
  subjects: SubjectData[];
}

//? Функции помощники

/**
 * Возвращает id четверти по дате
 * @param terms массив четвертей
 * @param date дата
 * @returns id четверти
 */
function termByDate(terms: Credentials["terms"], date: Date): number {
  return (
    terms.find(
      (term) => term.id != -1 && +term.start <= +date && +date <= +term.end
    )?.id ?? -1
  );
}

/**
 * Сопоставляем оценки с четвертями
 * @param terms массив четвертей
 * @param termTds массив с названиями четвертей
 * @param marksTds массив с оценками четвертей
 */
function totalMarksFormat(
  terms: Credentials["terms"],
  termTds: string[],
  marksTds: number[]
): {
  totalMarks: Subject["totalMarks"];
  middleMarks: Subject["middleMarks"];
  periodMiddleMark: Subject["periodMiddleMark"];
  // TODO: удалить в следующих версиях
  middleMark: Subject["middleMark"];
} {
  // Сопоставляем оценки с четвертями
  const totalMarks: Subject["totalMarks"] = [];
  const middleMarks: Subject["middleMarks"] = [];
  marksTds.forEach((mark, index) => {
    // Получаем id четверти
    const tdName = termTds[index];
    const termId = terms.find((t) => tdName.includes(t.name))?.id ?? -1;

    // Если это итоговая оценка за выбранный период
    if (tdName.includes("Итог") && mark) totalMarks.push({ mark, termId });

    // Если это средняя оценка за выбранный период
    if (tdName.includes("Средн") && mark) middleMarks.push({ mark, termId });
  });

  // Получаем среднюю оценку за выбранный период
  const periodMiddleMark = middleMarks[middleMarks.length - 1]?.mark ?? 0;

  return {
    totalMarks,
    middleMarks,
    periodMiddleMark,

    // TODO: удалить в следующих версиях
    middleMark: periodMiddleMark,
  };
}

/**
 * Парсим данные из файла отчета
 * @param html отчет в формате HTML
 * @param start дата начала отчета
 * @param end дата окончания отчета
 * @returns массив дат
 */
function parseDates(html: string, start: Date, end: Date) {
  const isSameYear = start.getFullYear() === end.getFullYear();

  // Получаем дни
  const days = Array.from(
    queryAll(html, DAYS_SELECTOR),
    (th) => +th.structuredText
  );
  // Получаем месяца и его длину
  const months = Array.from(queryAll(html, MONTHS_SELECTOR), (th) => ({
    length: +(th.getAttribute("colspan") ?? ""),
    number: !isSameYear
      ? MONTH_NUMBERS[th.structuredText as keyof typeof MONTH_NUMBERS]
      : MONTH_NUMBERS_SY[th.structuredText as keyof typeof MONTH_NUMBERS_SY],
  }));

  // Форматируем даты
  const result: Date[] = [];
  months.forEach(({ number, length }) => {
    const resultLength = result.length;

    for (let i = resultLength; i < resultLength + length; i++) {
      const date = new Date(start);
      date.setDate(days[i]);
      date.setMonth(number);
      result.push(date);
    }
  });

  return result;
}

export default class Journal {
  /** HTML код отчета */
  raw: string;
  /** Промежуток отчета */
  range: {
    /** Начало отчета */
    start: Date;
    /** Конец отчета */
    end: Date;
  };

  private _terms: Credentials["terms"];
  private _subjects: Credentials["subjects"];

  constructor(credentials: Credentials) {
    this.raw = credentials.htmlText;
    this._terms = credentials.terms;
    this._subjects = credentials.subjects;

    const [start = "", end = ""] =
      query(
        this.raw,
        !this._hasTerms ? RANGE_SELECTOR : RANGE_SELECTOR_V2
      )?.structuredText.match(/((\d{1,2}\.){2}\d{2})/g) ?? [];
    this.range = { start: str2date(start), end: str2date(end) };
  }

  /** Проверяет наличия деления на четверти */
  private get _hasTerms(): boolean {
    return this._terms.length > 0;
  }

  /** Получаем распарсенные оценки по предметам */
  get subjects(): Subject[] {
    // Парсим даты
    const dates = parseDates(this.raw, this.range.start, this.range.end);

    // Получаем доступ к таблице
    const trs = table({
      html: this.raw,
      query: ".table-print",
      removeHeaders: false,
    });
    // Получаем название четвертей
    const termTds = Array.from(trs[0].querySelectorAll("th[rowspan]"), (th) =>
      th.text.trim()
    );
    // Удаляем лишнее
    trs.splice(0, 2);
    termTds.shift();

    return trs.map((tr) => {
      // Получаем название предмета
      const nameTd = tr.querySelector("td:nth-child(1)");
      const name = nameTd?.text.trim() ?? "";

      // Получаем средние оценки и итоговые
      const marksTds = Array.from(
        tr.querySelectorAll("td.cell-num-2"),
        (td) => +td.text.trim().replace(",", ".")
      );
      // Получаем данные ячеек за период
      const periodTds = Array.from(tr.querySelectorAll(":not([class])"), (td) =>
        td.text.trim()
      );

      // Парсим данные ячеек за период
      const marks: Subject["marks"] = [];
      const dotList: Subject["dotList"] = [];
      const missedList: Subject["missedList"] = [];
      periodTds.forEach((content, i) => {
        const date = dates[i];
        if (!content) return;

        content.match(/\d/g)?.forEach((str) =>
          marks.push({
            mark: +str,
            date,
            termId: termByDate(this._terms, date),
          })
        );

        content.match(/\./g)?.forEach(() =>
          dotList.push({
            date,
            termId: termByDate(this._terms, date),
          })
        );

        content.match(/[А-Яа-я]+/g)?.forEach((type) =>
          missedList.push({
            type,
            date,
            termId: termByDate(this._terms, date),
          })
        );
      });

      // Возвращаем данные предмета
      return {
        id: this._subjects.find((s) => s.name === name)?.id ?? -1,
        name,
        marks,
        dotList,
        missedList,
        ...totalMarksFormat(this._terms, termTds, marksTds),
      };
    });
  }

  toJSON(): JournalData {
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
        dotList: s.dotList.map((d) => ({
          ...d,
          date: date2JSON(d.date),
        })),
        missedList: s.missedList.map((m) => ({
          ...m,
          date: date2JSON(m.date),
        })),
      })),
    };
  }
}
