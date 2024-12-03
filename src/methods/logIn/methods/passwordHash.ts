import { createHash } from "crypto";
import { PasswordType } from "@NS";

function md5(str: string): string {
  return createHash("md5").update(str, "utf8").digest("hex");
}

export default function (salt: string, password: PasswordType) {
  const hash = typeof password === "string" ? md5(password) : password.hash;
  const pw2 = md5(salt + hash);
  const pw = pw2.substring(0, password.length);

  return { pw, pw2 };
}
