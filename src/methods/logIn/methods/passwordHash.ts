import { encode } from "iconv-lite";
import { createHash } from "crypto";
import { PasswordType } from "@NS";

function md5(str: string): string {
  const buf = encode(str, "windows-1251");
  return createHash("md5").update(buf).digest("hex");
}

export default function (salt: string, password: PasswordType) {
  const hash = typeof password === "string" ? md5(password) : password.hash;
  const pw2 = md5(salt + hash);
  const pw = pw2.substring(0, password.length);

  return { pw, pw2 };
}
