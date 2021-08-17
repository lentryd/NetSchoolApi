import Assignment, { AssignmentObject } from "./Assignment";

export interface LessonObject {
  day: string;
  room: string;
  number: number;
  endTime: string;
  startTime: string;
  subjectName: string;
  assignments: AssignmentObject[];
  classmeetingId: number;
}

export default class Lesson {
  id: number;
  subject: string;
  assignments: Assignment[];

  private _endDate: string;
  private _startDate: string;

  constructor(lesson: LessonObject) {
    this.id = lesson.classmeetingId;
    this.subject = lesson.subjectName;
    this._endDate = lesson.day.replace("00:00", lesson.endTime);
    this._startDate = lesson.day.replace("00:00", lesson.startTime);
    this.assignments = lesson.assignments.map((a) => new Assignment(a));
  }

  get end() {
    return new Date(this._endDate);
  }

  get start() {
    return new Date(this._startDate);
  }

  toJSON() {
    return {
      id: this.id,
      subject: this.subject,
      endDate: this._endDate,
      startDate: this._startDate,
      assignments: this.assignments.map((a) => a.toJSON()),
    };
  }
}
