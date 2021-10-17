interface Credentials {
  ver: string;
  expiryDate: number;
  accessToken: string;
}

export default class Session {
  ver: string;
  expiryDate: number;
  accessToken: string;

  constructor(credentials: Credentials) {
    this.ver = credentials.ver;
    this.expiryDate = credentials.expiryDate;
    this.accessToken = credentials.accessToken;
  }

  isValid() {
    return this.expiryDate - Date.now() > 0;
  }

  isExpired() {
    return !this.isValid();
  }
}
