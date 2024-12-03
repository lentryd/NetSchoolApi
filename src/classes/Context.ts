import { compareVersions } from "compare-versions";

export interface Term {
  // ID четверти
  id: number;
  // Название четверти
  name: string;
  // Значение фильтра
  value: string;
  // Является ли эта четверть текущей
  isCurrent: boolean;

  // Дата начала четверти
  start: Date;
  // Дата окончания четверти
  end: Date;
}

export interface Class {
  // ID класса
  id: number;
  // Название класса
  name: string;
  // Значение фильтра
  value: string;
}

export interface Student {
  // ID ученика
  id: number;
  // Имя ученика
  name: string;
  // Значение фильтра
  value: string;
}

export interface User {
  id: number;
  name: string;
  terms: Term[];
  classes: Class[];
  students: Student[];
}

export interface Year {
  id: number;
  gId: number;
  name: string;
  start: Date;
  end: Date;
}

export interface Server {
  id: string;
  version: string;
  timeFormat: string;
  dateFormat: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface School {
  id: number;
  name: string;
  fullName: string;
}

export interface Credentials {
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
  defaultTerm(): Term | undefined {
    return this.user.terms.find((t) => t.isCurrent);
  }

  /** Получить четверть по ID */
  getTermById(id: number) {
    return this.user.terms.find((t) => t.id == id);
  }

  /** Существует ли класс */
  classExists(id: number) {
    return !!this.getClassById(id);
  }

  /** ID первого класса */
  defaultClass(): Class | undefined {
    return this.user.classes[0];
  }

  /** Получить класс по ID */
  getClassById(id: number) {
    return this.user.classes.find((c) => c.id == id);
  }

  /** Существует ли ученик */
  studentExists(id: number) {
    return !!this.getStudentById(id);
  }

  /** ID первого ученика */
  defaultStudent(): Student | undefined {
    return this.user.students[0];
  }

  /** Получить ученика по ID */
  getStudentById(id: number) {
    return this.user.students.find((s) => s.id == id);
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
