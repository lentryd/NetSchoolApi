import Day, { DayObject } from "./Day";
import Lesson from "./Lesson";

export interface DiaryObject {
  weekEnd: string;
  termName: string;
  weekDays?: DayObject[];
  weekStart: string;
  className: string;
}

export default class Diary {
  days: Day[];
  termName: string;
  className: string;

  private _endDate: string;
  private _startDate: string;

  constructor(diary: DiaryObject) {
    this.days = diary.weekDays?.map((d) => new Day(d)) ?? [];
    this.termName = diary.termName;
    this.className = diary.className;
    this._endDate = diary.weekEnd;
    this._startDate = diary.weekStart;
  }

  get startDate() {
    return new Date(this._startDate);
  }

  get endDate() {
    return new Date(this._endDate);
  }

  slice({ start, end }: { start: Date; end: Date }) {
    return this.days.filter(({ date }) => date >= start && date < end);
  }

  currentLesson(date: Date) {
    const lessons: Lesson[] = [];
    this.days.forEach((d) => lessons.push(...d.lessons));

    return (
      lessons.find(
        ({ startDate, endDate }) => date >= startDate && date < endDate
      ) ?? null
    );
  }

  toJSON() {
    return {
      days: this.days.map((d) => d.toJSON()),
      endDate: this._endDate,
      startDate: this._startDate,
    };
  }
}
