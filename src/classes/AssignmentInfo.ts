interface Teacher {
  id: number;
  name: string;
}

interface SubjectGroup {
  id: number;
  name: string;
}

export interface AssignmentInfoObject {
  id: number;
  date: string;
  weight: number;
  teacher: Teacher;
  teachers?: Teacher[];
  isDeleted: boolean;
  description: string;
  subjectGroup: SubjectGroup;
  assignmentName: string;
}

export default class {
  id: number;
  text: string;
  weight: number;
  subject: string;
  teacher: string;
  isDeleted: boolean;
  description: string;

  private _date: string;

  constructor(assignment: AssignmentInfoObject) {
    this.id = assignment.id;
    this.text = assignment.assignmentName;
    this.weight = assignment.weight;
    this.subject = assignment.subjectGroup.name;
    this.teacher = assignment.teachers
      ? assignment.teachers[0].name
      : assignment.teacher.name;
    this.isDeleted = assignment.isDeleted;
    this.description = assignment.description;
    this._date = assignment.date;
  }

  get date() {
    return new Date(this._date);
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      date: this._date,
      weight: this.weight,
      subject: this.subject,
      teacher: this.teacher,
      isDeleted: this.isDeleted,
      description: this.description,
    };
  }
}
