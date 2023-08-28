/**
 * Преобразование строки в объект
 * @/param cookie Значение заголовка `set-cookie`
 */
export default function (cookie?: string[]) {
  return cookie
    ?.map((cookie) => cookie.substring(0, cookie.indexOf(";")))
    .map((cookie) => {
      const i = cookie.indexOf("=");
      const key = cookie.substring(0, i);
      const val = cookie.substring(i + 1);

      return { key, val };
    });
}
