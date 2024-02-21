import { compareVersions } from "compare-versions";

interface Term {
  // ID четверти
  id: number;
  // Название четверти
  name: string;
  // Является ли эта четверть текущей
  isCurrent: boolean;

  // Дата начала четверти
  start: Date;
  // Дата окончания четверти
  end: Date;
}

interface User {
  id: number;
  name: string;
  terms: Term[];
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
  version: string;
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
}

export default class Context {
  readonly user: User;
  readonly year: Year;
  readonly server: Server;
  readonly school: School;
  readonly subjects: Subject[];

  constructor(credentials: Credentials) {
    this.user = credentials.user;
    this.year = credentials.year;
    this.server = credentials.server;
    this.school = credentials.school;
    this.subjects = credentials.subjects;
  }

  /** Проверяет является ли число частью года */
  checkDate(date: Date) {
    const { start, end } = this.year;
    return +start <= +date && +date <= +end;
  }

  /** Существует ли четверть */
  termExists(id: number) {
    return !!this.user.terms.find((t) => t.id == id);
  }

  /** ID текущей четверти */
  defaultTerm() {
    return this.user.terms.find((t) => t.isCurrent)?.id ?? -1;
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

  /**
   * Сравнивает версию сервера с указанной
   * @param version Версия сервера с которой сравнивается
   * @returns 1 если указанная версия больше, -1 если меньше, 0 если равны
   */
  compareServerVersion(version: string) {
    return compareVersions(this.server.version, version);
  }
}
