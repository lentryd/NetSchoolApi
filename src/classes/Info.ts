export interface InfoObject {
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  mobilePhone: string;
  email: string;
  existsPhoto: boolean;
}

export default class Info {
  email: string;
  phone: string;
  lastName: string;
  firstName: string;
  middleName: string;
  existsPhoto: boolean;

  private _birthDate: string;

  constructor(info: InfoObject) {
    this.email = info.email;
    this.phone = info.mobilePhone;
    this.lastName = info.lastName;
    this.firstName = info.firstName;
    this.middleName = info.middleName;
    this.existsPhoto = info.existsPhoto;
    this._birthDate = info.birthDate;
  }

  get birthDate() {
    return new Date(this._birthDate);
  }

  toJSON() {
    return {
      email: this.email,
      phone: this.phone,
      lastName: this.lastName,
      firstName: this.firstName,
      birthDate: this._birthDate,
      middleName: this.middleName,
      existsPhoto: this.existsPhoto,
    };
  }
}
