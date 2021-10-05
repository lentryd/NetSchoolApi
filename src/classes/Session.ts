interface Credentials {
  ver: string;
  userId: number;
  yearId: number;
  schoolId: number;
  studentsId: number[];
  expiryDate: number;
  accessToken: string;
  globalYearId: number;
}

export default class Session {
  ver: string;
  userId: number;
  yearId: number;
  schoolId: number;
  studentsId: number[];
  expiryDate: number;
  accessToken: string;
  globalYearId: number;

  constructor(credentials: Credentials) {
    this.ver = credentials.ver;
    this.userId = credentials.userId;
    this.yearId = credentials.yearId;
    this.schoolId = credentials.schoolId;
    this.studentsId = credentials.studentsId;
    this.expiryDate = credentials.expiryDate;
    this.accessToken = credentials.accessToken;
    this.globalYearId = credentials.globalYearId;
  }

  isValid() {
    return this.expiryDate - Date.now() > 0;
  }

  isExpired() {
    return !this.isValid();
  }
}
