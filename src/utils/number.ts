/**
 * Превращает число `1` в строку "01"
 */
export function num2str(num: string | number) {
  if (typeof num == "string") num = parseInt(num);
  if (num < 10) return "0" + num;
  else return num.toString();
}
