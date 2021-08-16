import Lesson, { LessonObject } from "./Lesson";

export interface DayObject {
  date: string;
  lessons: LessonObject[];
}

export default class Day {
  lessons: Lesson[];

  private _date: string;

  constructor(day: DayObject) {
    this._date = day.date;
    this.lessons = day.lessons.map((l) => new Lesson(l));
  }

  get date() {
    return new Date(this._date);
  }

  toJSON() {
    return {
      date: this._date,
      lessons: this.lessons.map((l) => l.toJSON()),
    };
  }
}
