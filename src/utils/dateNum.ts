/**
 * Переводит число `1` в строку "01"
 */
export function num2str(num: string | number) {
  if (typeof num == "string") num = parseInt(num);
  if (num < 10) return "0" + num;
  else return num.toString();
}

/**
 * Переводит объект `Date` в строку формата "dd.mm.yy"
 */
export function date2str(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 100;

  return day + "." + month + "." + year;
}

/**
 * Переводит строку формата "dd.mm.yy" в объект `Date`
 */
export function str2date(str: string) {
  if (!/(\d{1,2}\.){2}\d{2}/.test(str))
    throw new Error("Invalid date string: " + str);

  const [day, month, year] = (str.match(/\d+/g) as string[]).map((s) =>
    parseInt(s)
  );

  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(day);
  date.setMonth(month - 1);
  date.setFullYear(~~(date.getFullYear() / 100) * 100 + year);

  return date;
}

/**
 * Переводит строку формата "dd.mm.yy" в строку формата "yyyy-mm-ddT00:00"
 */
export function date2JSON(str: string): string;
/**
 * Переводит объект `Date` в строку формата "yyyy-mm-ddT00:00"
 */
export function date2JSON(date: Date): string;
export function date2JSON(arg: string | Date): string {
  const date = typeof arg === "string" ? str2date(arg) : arg;

  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${num2str(month)}-${num2str(day)}T00:00`;
}
