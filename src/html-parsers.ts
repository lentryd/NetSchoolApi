import * as htmlParser from "node-html-parser";

export type AppContext = {
  at: string;
  ver: string;
  now: string;
  isTkr: boolean;
  roles: Array<number>;
  rights: Array<number>;
  userId: number;
  yearId: string;
  version: string;
  schoolId: string;
  currYear: string;
  serverId: string;
  funcType: number;
  language: string;
  readOnly: boolean;
  dateFormat: string;
  timeFormat: string;
  environment: string;
  productName: string;
  globalYearId: number;
  tokenTimeOut: number;
  isEmForSchool: boolean;
  fullSchoolName: string;
  serverTimeZone: number;
};
/**
 * Parsing html in AppContext.
 * @param html Any page of the SGO
 */
export function parserAppContext(html: string): AppContext {
  return new Function(
    html
      ?.replace("pageVer", "appContext.ver")
      ?.match(
        /\w+ appContext = {.+?};|appContext\.(?!ya)\w+ = (?!function).+?;/gs
      )
      ?.reduce((a, c) => (a += c)) + "return appContext;"
  )();
}

export type UserInfo = {
  email: string;
  phone: number;
  lastName: string;
  firstName: string;
  birthDate: Date;
  patronymic: string;
};
/**
 * Parsing html in UserInfo
 * @param html Settings page of the SGO
 */
export function parseUserInfo(html: string): UserInfo {
  const email = html.match(/E-Mail.+?value="(.*?)"/)?.[1] ?? "";
  const phone = +(html.match(/Мобильный телефон.+?value="(.*?)"/)?.[1] ?? 0);
  const lastName = html.match(/Фамилия.+?value="(.*?)"/)?.[1] ?? "";
  const firstName = html.match(/Имя.+?value="(.*?)"/)?.[1] ?? "";
  const patronymic = html.match(/Отчество.+?value="(.*?)"/)?.[1] ?? "";
  const birthDateRaw = html.match(/Дата рождения.+?value="(.*?)"/)?.[1] ?? "";
  const match = birthDateRaw.match(/(\d{2})\.(\d{2})\.*(\d{0,4})/);
  const birthDate = new Date(`${match[2]} ${match[1]} ${match[3]}`);

  return {
    email,
    phone,
    lastName,
    firstName,
    birthDate,
    patronymic,
  };
}

export type Subject = {
  middleMark: number | null;
  assignments: {
    type: string;
    mark: number;
    name: string;
    date: Date;
    issueDate: Date;
  }[];
};
/**
 * Parsing html in Subject
 * @param html Subject page of the SGO
 */
export function parseSubject(html: string): Subject {
  const assignments = [];
  const root = htmlParser.parse(html);
  const trs = root.querySelectorAll("table.table-print tr") ?? [];

  for (let tr of trs) {
    const tds = tr?.querySelectorAll("td") ?? [];
    const type = tds[0]?.structuredText;
    const name = tds[1]?.structuredText;
    const date = str2date(tds[2]?.structuredText);
    const issueDate = str2date(tds[3]?.structuredText);
    const mark = +tds[4]?.structuredText;

    if (!type || !name || !date || !issueDate || !mark) continue;
    assignments.push({
      type,
      name,
      mark,
      date,
      issueDate,
    });
  }

  return {
    assignments,
    middleMark:
      +trs
        .pop()
        ?.removeWhitespace?.()
        ?.childNodes?.[2]?.text?.replace?.(",", ".")
        ?.replace?.(/^\D+(?=\d)/, "") ?? null,
  };

  /**
   * Перевод строки в время
   * @param {String} str Строка в формате dd.mm.yy
   * @return {Date} Время
   */
  function str2date(str = "") {
    const [, date = 8, month = 6, year = 2004] =
      str.match(/(\d{1,2})\.(\d{1,2})\.(\d{1,2})/) ?? [];
    return new Date(`${month}-${date}-${year}`);
  }
}

export type Journal = {
  name: string;
  middleMark: number;
  assignments: {
    value: string;
    date: Date;
  }[];
}[];
/**
 * Parsing html in Journal
 * @param html Journal page of the SGO
 */
export function parseJournal(html: string): Journal {
  // Начало учебного года
  const studyYear = html.match(/Учебный год:<\/b>(.+?)</s)?.[1]?.trim?.();
  // Индекс месяца
  const monthIndex = {
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
  // Получаем таблицу
  const table = htmlParser
    .parse(`<body>${html}</body>`)
    .querySelector(".table-print");
  if (!table) return [];
  // Получаем средний балл
  const middleMarks = table.querySelectorAll("td.cell-num");
  // Получаем предметы
  const subjects = table.querySelectorAll("td.cell-text");
  // Получаем месяца
  const months = table.querySelectorAll("tr")[0].querySelectorAll("th");
  // Получаем даты
  const dates = table.querySelectorAll("tr")[1].querySelectorAll("th");

  // Получаем период месяцев и удаляем строку с месяцами
  const journalMonths = [];
  for (const i in months) {
    if (!i) continue;
    const m = months[i];
    const to = +m?.getAttribute?.("colspan");
    const from = journalMonths[journalMonths.length - 1]?.to ?? 0;
    if (!to) continue;

    journalMonths.push({
      id: m.innerText,
      from,
      to: from + to,
    });
  }
  table.querySelectorAll("tr")[0].remove();

  // Получаем даты в формате Date и удаляем строку c датами
  const journalDates = [];
  for (const i in dates) {
    if (!i) continue;
    const d = dates[i];
    const date = new Date(
      studyYear +
        "-01-" +
        (+d.innerText < 10 ? 0 : "") +
        d.innerText +
        "T00:00:00.000Z"
    );
    const month = journalMonths.find((m) => i >= m.from && i < m.to)?.id;
    if (!month) continue;

    date.setMonth(monthIndex[month]);
    journalDates.push(date);
  }
  table.querySelectorAll("tr")[0].remove();

  // Получаем название предметов и удаляем HTML элемент
  const journalSubjects = [];
  for (const i in subjects) {
    if (!i) continue;
    const s = subjects[i];
    const name = s?.innerText;
    if (!name) continue;

    journalSubjects.push(name);
    s.remove();
  }

  // Получаем средний балл и удаляем HTML элемент
  const journalMiddleMarks = [];
  for (const i in middleMarks) {
    if (!i) continue;
    const m = middleMarks[i];
    const num = +m?.innerText?.replace?.(",", ".");
    if (!num) continue;

    journalMiddleMarks.push(num);
    m.remove();
  }

  // Получаем оценки и готовим результат
  const result = [];
  const assignmentsRow = table.querySelectorAll("tr");
  for (const i in assignmentsRow) {
    if (!i) continue;
    const row = assignmentsRow[i];
    if (!row?.innerHTML) continue;
    result.push({
      name: journalSubjects[i],
      middleMark: journalMiddleMarks[i],
      assignments: [],
    });

    const assignments = row.querySelectorAll("td");
    for (const i1 in assignments) {
      if (!i) continue;
      const a = assignments[i1];
      if (!a?.structuredText) continue;
      result[i].assignments.push({
        value: a.structuredText.replace(/&nbsp;/g, " "),
        date: journalDates[i1],
      });
    }
  }

  return result;
}

export type Birthday = {
  date: Date;
  name: string;
  role: string;
  class: string;
}[];
/**
 * Parsing html in Birthday
 * @param html Birthday page of the SGO
 */
export function parseBirthday(html: string): Birthday {
  const root = htmlParser.parse(html);
  const table = root.querySelector(".table.print-block");
  table.querySelector("tr").remove();
  const people = table.querySelectorAll("tr");
  const result = [];
  people.forEach((p) => {
    const data = p.querySelectorAll("td");
    result.push({
      date: str2date(data[2].structuredText),
      name: data[3].structuredText,
      role: data[1].structuredText,
      class: data[0].structuredText,
    });
  });
  result.sort((a, b) => +a.date - +b.date);
  return result;

  /**
   * Функция для получения даты
   * @param {String} str строка с датой типа `8.06`
   * @return {Date}
   */
  function str2date(str) {
    const match = str?.match(/(\d{1,2})\.(\d{2})/);
    const day = +(match?.[1] ?? 20);
    const month = +(match?.[2] ?? 4);
    const date = new Date();

    date.setDate(day);
    date.setHours(0, 0, 0);
    date.setMonth(month - 1);

    return date;
  }
}

export type ScheduleDay = {
  time: string;
  name: string;
}[];
/**
 * Parsing html in ScheduleDay
 * @param html ScheduleDay page of the SGO
 */
export function parseScheduleDay(html: string): ScheduleDay {
  html = html.replace(/&nbsp;/g, " ");

  const result = [];
  const root = htmlParser.parse(html);
  const table = root.querySelector(".table.print-block");
  const trs = table?.querySelectorAll?.("tr") ?? [];

  trs.shift();
  for (const tr of trs) {
    const tds = tr?.querySelectorAll?.("td");
    const time = tds?.[0]?.structuredText;
    const name = tds?.[1]?.structuredText;
    if (!time || !name) continue;

    result.push({ time, name });
  }

  return result;
}

export type ScheduleWeek = {
  day: string;
  lessons: {
    number: number;
    name: string;
  }[];
}[];
/**
 * Parsing html in ScheduleWeek
 * @param html ScheduleWeek page of the SGO
 */
export function parseScheduleWeek(html: string): ScheduleWeek {
  html = html.replace(/&nbsp;/g, " ");

  const result = [];
  const root = htmlParser.parse(html);
  const table = root.querySelector(".table.print-block");
  const trs = table?.querySelectorAll?.("tr") ?? [];

  trs.shift();
  for (const tr of trs) {
    const tds = tr?.querySelectorAll?.("td");
    const day = {
      day: tr?.querySelector?.("th")?.text,
      lessons: [],
    };
    const lessonsName = tds?.[1]?.childNodes?.filter((n) => n.nodeType == 3);
    const lessonsNumber = tds?.[0]?.childNodes?.filter((n) => n.nodeType == 3);

    for (let i = 0; i < lessonsNumber.length; i++) {
      day.lessons.push({
        number: lessonsNumber?.[i]?.text,
        name: lessonsName?.[i]?.text,
      });
    }

    result.push(day);
  }

  return result;
}
