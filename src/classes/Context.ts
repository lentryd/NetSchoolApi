interface User {
  id: number;
  name: string;
  classes: { id: number; name: string }[];
  students: { id: number; name: string }[];
}

interface Year {
  id: number;
  gId: number;
  name: string;
  start: Date;
  end: Date;
}

interface Server {
  id: string;
  timeFormat: string;
  dateFormat: string;
}

interface Subject {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
  fullName: string;
}

interface Credentials {
  user: User;
  year: Year;
  server: Server;
  school: School;
  subjects: Subject[];
  reportRange: { start: Date; end: Date };
}

export default class Context {
  readonly user: User;
  readonly year: Year;
  readonly server: Server;
  readonly school: School;
  readonly subjects: Subject[];
  readonly reportRange: Credentials["reportRange"];

  constructor(credentials: Credentials) {
    this.user = credentials.user;
    this.year = credentials.year;
    this.server = credentials.server;
    this.school = credentials.school;
    this.subjects = credentials.subjects;
    this.reportRange = credentials.reportRange;
  }

  /** Проверяет является ли число частью года */
  checkDate(date: Date) {
    const { start, end } = this.year;
    return +start <= +date && +date <= +end;
  }

  /** Существует ли класс */
  classExists(id: number) {
    return !!this.user.classes.find((c) => c.id == id);
  }

  /** ID первого класса */
  defaultClass() {
    return this.user.classes[0]?.id ?? -1;
  }

  /** Существует ли ученик */
  studentExists(id: number) {
    return !!this.user.students.find((s) => s.id == id);
  }

  /** ID первого ученика */
  defaultStudent() {
    return this.user.students[0]?.id ?? -1;
  }

  /** Существует ли предмет */
  subjectExists(id: number) {
    return !!this.subjects.find((s) => s.id == id);
  }
}
