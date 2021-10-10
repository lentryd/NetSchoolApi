import { ExtraHeaders } from "../../";

export default function (headers: ExtraHeaders, key: string) {
  const index = headers.findIndex((h) => h.key === key);

  if (index !== -1) headers.splice(index, 1);
  return headers;
}
