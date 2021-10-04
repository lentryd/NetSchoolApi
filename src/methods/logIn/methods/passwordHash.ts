import { createHash } from "crypto";

function md5(str: string): string {
  return createHash("md5").update(str).digest("hex");
}

export default function (salt: string, password: string) {
  const pw2 = md5(salt + md5(password));
  const pw = pw2.substring(0, password.length);

  return { pw, pw2 };
}
