import NS from "@NS";

export default function (this: NS, id: number) {
  return !!this.session?.studentsId.find((s) => s == id);
}
