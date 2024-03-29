import { parse as p, Options } from "node-html-parser";

function parse(data: string, options?: Partial<Options>) {
  return p(data.replace(/&nbsp;/g, " "), options);
}

export function outerHTML(args: { html: string; query: string }) {
  const { html, query } = args;

  return parse(html).querySelector(query)?.outerHTML ?? html;
}

export function query(html: string, query: string) {
  return parse(html).querySelector(query);
}

export function queryAll(html: string, query: string) {
  return parse(html).querySelectorAll(query);
}

export function table(args: {
  html: string;
  query?: string;
  removeHeaders?: boolean;
}) {
  const { html, query = ".table", removeHeaders = true } = args;

  const trs = parse(html).querySelector(query)?.querySelectorAll?.("tr") ?? [];

  if (removeHeaders) trs.shift();
  return trs;
}
