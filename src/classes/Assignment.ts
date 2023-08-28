import Attachment, {
  AttachmentObject,
  AnswerFilesObject,
} from "@/classes/Attachment";

type Mark = {
  assignmentId: number;
  studentId: number;
  mark: number;
  dutyMark: boolean;
};

type TextAnswer = {
  answer: string;
  answerDate: Date;
};

export interface AssignmentObject {
  id: number;
  typeId: number;
  dueDate: string;
  mark?: Mark;
  markComment?: {
    id: number;
    name: string;
    teacher: string;
    wasRead: boolean;
    editTime: string;
  };
  textAnswer?: TextAnswer;
  attachments: AttachmentObject[];
  answerFiles: AnswerFilesObject[];
  assignmentName: string;
  classMeetingId: number;
}

export default class Assignment {
  id: number;
  dot: boolean;
  text: string;
  mark?: number;
  typeId: number;
  comment?: string;
  lessonId: number;
  attachments: Attachment[];

  private _date: string;
  private _answer?: TextAnswer;
  private _answerAtt: Attachment[];

  constructor(assignment: AssignmentObject) {
    this.id = assignment.id;
    this.dot = assignment.mark?.dutyMark ?? false;
    this.text = assignment.assignmentName;
    this.mark = assignment.mark?.mark;
    this.typeId = assignment.typeId;
    this.comment = assignment.markComment?.name;
    this.lessonId = assignment.classMeetingId;
    this.attachments = assignment.attachments.map((a) => new Attachment(a));

    this._date = assignment.dueDate;
    this._answer = assignment.textAnswer;
    this._answerAtt = assignment.answerFiles.map((a) => new Attachment(a));
  }

  get date() {
    return new Date(this._date);
  }
  get answer() {
    if (!this._answer) return undefined;

    return {
      date: new Date(this._answer.answerDate),
      text: this._answer.answer,
      attachments: this._answerAtt,
    };
  }

  toJSON() {
    const answer = !this._answer
      ? undefined
      : {
          date: this._answer.answerDate,
          text: this._answer.answer,
          attachments: this._answerAtt.map((a) => a.toJSON()),
        };

    return {
      id: this.id,
      dot: this.dot,
      text: this.text,
      mark: this.mark,
      answer,
      typeId: this.typeId,
      lessonId: this.lessonId,
      attachments: this.attachments.map((a) => a.toJSON()),
    };
  }
}
