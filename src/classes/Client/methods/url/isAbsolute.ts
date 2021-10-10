const absoluteRegex = new RegExp("^(?:[a-z]+:)?//", "i");

/**
 * Является ли ссылка абсолютной
 * @param path Путь к ресурсу
 */
export default function (path: string) {
  return absoluteRegex.test(path);
}
