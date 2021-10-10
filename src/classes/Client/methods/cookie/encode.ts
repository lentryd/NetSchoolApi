/**
 * Преобразование объекта в строку
 * @param cookie Объект с куки файлами
 */
export default function (cookie: { [key: string]: string }) {
  const cookies = [];
  for (let name in cookie) cookies.push(name + "=" + cookie[name]);

  return cookies.join("; ");
}
