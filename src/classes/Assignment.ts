interface Mark {
  assignmentId: number;
  studentId: number;
  mark: number;
  dutyMark: boolean;
}

export interface AssignmentObject {
  id: number;
  typeId: number;
  dueDate: string;
  mark?: Mark;
  assignmentName: string;
  classMeetingId: number;
}

export default class Assignment {
  id: number;
  dot: boolean;
  text: string;
  mark: number | null;
  typeId: number;
  lessonId: number;

  private _date: string;

  constructor(assignment: AssignmentObject) {
    this.id = assignment.id;
    this.dot = assignment.mark?.dutyMark ?? false;
    this.text = assignment.assignmentName;
    this.mark = assignment.mark?.mark ?? null;
    this.typeId = assignment.typeId;
    this._date = assignment.dueDate;
    this.lessonId = assignment.classMeetingId;
  }

  get date() {
    return new Date(this._date);
  }

  toJSON() {
    return {
      id: this.id,
      dot: this.dot,
      text: this.text,
      mark: this.mark,
      typeId: this.typeId,
      lessonId: this.lessonId,
    };
  }
}
