/**
 * Этот файл содержит функции, необходимые для проверки данных.
 * Они часто очень просты, но они слишком распространены в методах.
 */

import NS from "@NS";
import { FilterSource } from "@/methods/context/methods/studentGrades";

/**
 * Проверяет валидность сессии.
 */
export async function sessionValid(this: NS) {
  if (!(await this.sessionValid()) || !this.session || !this.context)
    throw new Error("Сначала надо открыть сессию.");

  return { ...this } as NS & {
    session: NonNullable<NS["session"]>;
    context: NonNullable<NS["context"]>;
  };
}

/**
 * Проверяет валидность дат
 */
export function dateValid(this: NS, ...dates: Date[]) {
  for (let date of dates)
    if (!this.context?.checkDate(date))
      throw new Error("Дата выходит за рамки учебного года");

  return dates;
}

/**
 * Проверяет валидность дат четверти или возвращает дефолтное значение.
 * @param this Класс библиотеки.
 * @param termId ID четверти.
 */
export async function termDateValid(
  this: NS,
  termId: number,
  startDate?: Date,
  endDate?: Date
) {
  if (!this.context?.termExists(termId))
    throw new Error("Четверть не существует");

  // Получаем даты четверти
  const filters = await this.client
    .post("v2/reports/studentgrades/initfilters", {
      body: JSON.stringify({
        params: null,
        selectedData: [{ filterId: "TERMID", filterValue: termId }],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json() as Promise<FilterSource[]>);
  const termDates = filters.find((f) => f.filterId == "period")?.range;
  if (!termDates) throw new Error("Не удалось получить даты четверти");

  // Форматируем даты четверти
  termDates.start = new Date(termDates.start);
  termDates.end = new Date(termDates.end);

  // Проверяем валидность дат
  if (!startDate) startDate = termDates.start;
  if (!endDate) endDate = termDates.end;
  for (let date of [startDate, endDate])
    if (+date < +termDates.start && +termDates.end < +date)
      throw new Error(`Дата выходит за рамки четверти ${termId}`);

  // Возвращаем даты
  return { start: startDate, end: endDate };
}

/**
 * Проверяет id пользователя или возвращает дефолтное
 */
export function studentIdValid(this: NS, id?: number) {
  const context = this.context as NonNullable<NS["context"]>;
  if (!id) id = context.defaultStudent();

  if (context.studentExists(id)) return id;
  else throw new Error(`Нет пользователя c id: ${id}`);
}

/**
 * Проверяет id класса или возвращает дефолтное
 */
export function classIdValid(this: NS, id?: number) {
  const context = this.context as NonNullable<NS["context"]>;
  if (!id) id = context.defaultClass();

  if (context.classExists(id)) return id;
  else throw new Error(`Нет класса c id: ${id}`);
}

/**
 * Проверяет id четверти или возвращает дефолтное
 */
export function termIdValid(this: NS, id?: number) {
  const context = this.context as NonNullable<NS["context"]>;
  if (!id) id = context.defaultTerm();

  if (context.termExists(id)) return id;
  else throw new Error(`Нет четверти c id: ${id}`);
}
