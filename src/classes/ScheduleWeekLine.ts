interface Credentials {
  date: string;
  lessons: {
    names: string[];
    number: number;
    classesName?: string[];
  }[];
}

export default class ScheduleWeekLine {
  lessons: Credentials["lessons"];

  private _date: string;

  constructor(credentials: Credentials) {
    this._date = credentials.date;
    this.lessons = credentials.lessons;
  }

  get date() {
    return new Date(this._date);
  }

  toJSON() {
    return {
      date: this._date,
      lessons: this.lessons,
    };
  }
}
