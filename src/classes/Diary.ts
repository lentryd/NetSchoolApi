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

  private _end: string;
  private _start: string;

  constructor(diary: DiaryObject) {
    this.days = diary.weekDays?.map((d) => new Day(d)) ?? [];
    this.termName = diary.termName;
    this.className = diary.className;
    this._end = diary.weekEnd;
    this._start = diary.weekStart;
  }

  get start() {
    return new Date(this._start);
  }

  get end() {
    return new Date(this._end);
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
      endDate: this._end,
      startDate: this._start,
    };
  }
}
