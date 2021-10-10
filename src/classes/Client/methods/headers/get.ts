import { ExtraHeaders, ExtraHeadersRaw } from "../../";

export default function (headers: ExtraHeaders) {
  let data: ExtraHeadersRaw = {};

  for (let { key, value } of headers) {
    const result = typeof value === "function" ? value() : value;

    if (!result) continue;
    else data[key] = result;
  }

  return data;
}
