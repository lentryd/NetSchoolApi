/**
 * Этот файл содержит функции, необходимые для проверки данных.
 * Они часто очень просты, но они слишком распространены в методах.
 */

import NS from "@NS";

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
