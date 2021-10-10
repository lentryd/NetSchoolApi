import { ExtraHeaders } from "../../";

export default function (
  headers: ExtraHeaders,
  key: string,
  value: string | Function
) {
  const index = headers.findIndex((h) => h.key === key);

  if (index !== -1) headers[index] = { key, value };
  else headers.push({ key, value });

  return headers;
}
