export interface TypesObject {
  id: number;
  name: string;
  abbr: string;
  order: number;
}

export default class AssignmentType {
  id: number;
  name: string;
  abbr: string;
  order: number;

  constructor(type: TypesObject) {
    this.id = type.id;
    this.name = type.name;
    this.abbr = type.abbr;
    this.order = type.order;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      abbr: this.abbr,
      order: this.order,
    };
  }
}
