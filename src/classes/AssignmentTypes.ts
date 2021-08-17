import AssignmentType, { TypesObject } from "./AssignmentType";

export default class AssignmentTypes {
  types: AssignmentType[];

  constructor(types: TypesObject[]) {
    this.types = types.map((t) => new AssignmentType(t));
  }

  findById(id: number) {
    return this.types.find((t) => t.id === id) ?? null;
  }

  findByAbbr(abbr: string) {
    return this.types.find((t) => t.abbr === abbr) ?? null;
  }

  toJSON() {
    return this.types.map((t) => t.toJSON());
  }
}
