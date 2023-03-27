export type AttachmentObject = {
  id: number;
  name?: string;
  description?: string;
  originalFileName: string;
};

export type AnswerFilesObject = {
  studentId: number;
  attachment: {
    id: number;
    aFile: any;
    saved: number;
    userId: any;
    fileName: string;
    description?: string;
  };
  attachmentDate: string;
};

export type AttachmentRaw = AttachmentObject | AnswerFilesObject;

export default class Attachment {
  id: number;
  name: string;
  description?: string;

  private _date?: string;

  constructor(raw: AttachmentRaw) {
    this.id = "attachment" in raw ? raw.attachment.id : raw.id;
    this.name =
      "attachment" in raw ? raw.attachment.fileName : raw.originalFileName;
    this._date = "attachment" in raw ? raw.attachmentDate : undefined;
    this.description =
      "attachment" in raw ? raw.attachment.description : raw.description;
  }

  get date() {
    if (!this._date) return undefined;
    return new Date(this._date);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      date: this._date,
      description: this.description,
    };
  }
}
