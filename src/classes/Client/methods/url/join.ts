import { posix } from "path";

/**
 *
 * @param origin Ссылка на сайт, например http://example.com
 * @param paths Путь до требуемого ресурса
 */
export default function (origin: string, ...paths: string[]) {
  return new URL(posix.join(...paths), origin).href;
}
