interface Credentials {
  name: string;
  className?: string;
  startDate: string;
  endDate: string;
}

export default class ScheduleDayLine {
  name: string;
  className?: string;

  private _startDate: string;
  private _endDate: string;

  constructor(credentials: Credentials) {
    this.name = credentials.name;
    this.className = credentials.className;
    this._startDate = credentials.startDate;
    this._endDate = credentials.endDate;
  }

  get start() {
    return new Date(this._startDate);
  }

  get end() {
    return new Date(this._endDate);
  }

  toJSON() {
    return {
      name: this.name,
      className: this.className,
      startDate: this._startDate,
      endDate: this._endDate,
    };
  }
}
