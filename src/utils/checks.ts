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
  // Получаем четверть по id
  const term = this.context?.user.terms.find((t) => t.id == termId);
  if (!term) throw new Error("Четверть не существует");

  // Проверяем даты
  const { start, end } = term;
  if (!startDate) startDate = start;
  if (!endDate) endDate = end;
  for (let date of [startDate, endDate])
    if (+date < +start && +end < +date)
      throw new Error(`Дата выходит за рамки четверти ${termId}`);

  // Возвращаем даты
  return { start: startDate, end: endDate };
}

/**
 * Проверяет id пользователя или возвращает дефолтное
 */
export function studentIdValid(this: NS, id?: number) {
  const context = this.context as NonNullable<NS["context"]>;

  if (!id) id = context.defaultStudent()?.id;
  const data = id && context.getStudentById(id);

  if (data) return data;
  else throw new Error(`Нет пользователя c id: ${id}`);
}

/**
 * Проверяет id класса или возвращает дефолтное
 */
export function classIdValid(this: NS, id?: number) {
  const context = this.context as NonNullable<NS["context"]>;

  if (!id) id = context.defaultClass()?.id;
  const data = id && context.getClassById(id);

  if (data) return data;
  else throw new Error(`Нет класса c id: ${id}`);
}

/**
 * Проверяет id четверти или возвращает дефолтное
 */
export function termIdValid(this: NS, id?: number) {
  const context = this.context as NonNullable<NS["context"]>;

  if (!id) id = context.defaultTerm()?.id;
  const data = id && context.getTermById(id);

  if (data) return data;
  else throw new Error(`Нет четверти c id: ${id}`);
}
