import * as WebSocket from 'ws';
import * as crypto from 'crypto';
import { Response } from 'node-fetch';
import { default as Parser } from './parser';

export type AuthForm = {
  id: string;
  name: string;
  value: number;
  options: {
    id: number;
    name: string;
  }[];
}[];
export type AuthFormItems = {
  id: number;
  name: string;
}[];
export type Studentgrades = {
  report: {
    id: string;
    name: string;
    group: string;
    level: string;
    order: number;
    filterPanel: {
      filters: {
        id: string;
        title: string;
        order: number;
        filterType: string;
        optionalFlag: boolean;
        hideSingleOption: boolean;
        hasSureCheckedFlag: boolean;
        hideTitleFlag: boolean;
        existStateProvider: boolean;
        dependencies?: {
          relatedObject: {
            type: string;
            ref: string;
          },
          relatedValue: any;
          condition: string;
        }[]
      }[]
    };
    presentTypes: any[]
  },
  filterSources: {
    items?: {
      title: string;
      value: string;
    }[],
    range?: {
      start: string;
      end: string;
    },
    defaultRange? : {
      start: string;
      end: string;
    },
    defaultValue: string;
    filterId: string;
    nullText: null | string;
    minValue: null | string;
    maxValue: null | string;
  }[];
};
export type DiaryWeek = {
  className: string;
  laAssigns: [] | null;
  termName: string;
  weekDays: {
    date: string;
    lessons: {
      day: string;
      room: string;
      relay: number;
      number: number;
      endTime: string;
      startTime: string;
      subjectName: string;
      assignments: {
        id: number;
        mark: string | null;
        weight: number; /** В моем дневнике это 0, всегда */
        typeId: number;
        dueDate: string;
        classMeetingId: number;
        assignmentName: string;
      }[],
      classmeetingId: number;
    }[]
  }[];
  weekStart: string;
  weekEnd: string;
};
export type Assignment = {
  id: number;
  date: string;
  weight: number;
  teacher: {
    id: number;
    name: number;
  };
  productId: null | string;
  isDeleted: boolean;
  attachments: [];
  description: string;
  problemName: null | string;
  activityName: null | string;
  subjectGroup: {
    id: number;
    name: string;
  };
  assignmentName: string;
  contentElements: null | string;
  codeContentElements: null | string;
};
export type Announcement = {
  author: {id: number, fio: string, nickName: string};
  deleteDate: null | string;
  description: string;
  em: null | string;
  id: number;
  name: string;
  postDate: string;
  recipientInfo: null | string;
  attachments: [];
};
export type AssignmentTypes = {
  abbr: string;
  order: number;
  id: number;
  name: string;
};


/**
 * MD5 hash
 * @param str original string
 */
export function md5(str: string):string {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * MD5 hash of length 8
 * @param str original string
 * @param obj original string
 */
export function hash(str: string, obj?: object):string {
  return md5(str + data2str(obj)).substring(0, 8);
}

/**
 * Translating data to a string
 * @param data Any data
 */
export function data2str(data: object):string {
  let str = '';
  for (const name in data) {
    let value = data[name];
    if (value.toString() == '[object Object]') value = data2str(value); 
    if (str) str += ', ';   
    str += name + ': ' + value.toString();
  }
  return '{' + str + '}';
}

/**
 * Loading the report
 * @param link The link to the resource
 * @param data Of the selected data
 */
export function reportFile(this: Parser, link: string, data: object):Promise<string> {
  return this.fetch(
    `/WebApi/signalr/negotiate` +
      `?_=${this._ver}` +
      `&at=${this._at}` +
      `&clientProtocol=1.5` +
      `&transport=webSockets` +
      `&connectionData=%5B%7B%22name%22%3A%22queuehub%22%7D%5D`
  )
    .then(res => res.json())
    .then(({ConnectionToken}) => makeWSRequest.call(this, ConnectionToken, link, data))
    .then(id => this.fetch(
      `/webapi/files/${id}`,
      { headers: { at: this._at } }
    ))
    .then(res => res.text());
}
/** The receipt of the report */
function makeWSRequest(this: Parser, token: string, link: string, data: object):Promise<string> {
  token = encodeURIComponent(token);
  const query = (
    `?at=${this._at}` +
    `&_=${this._ver}` +
    `&clientProtocol=1.5` +
    `&transport=webSockets` +
    `&connectionData=%5B%7B%22name%22%3A%22queuehub%22%7D%5D` +
    `&connectionToken=${token}`
  );
  const ws = new WebSocket(
    `${this.host.replace('http', 'ws')}/WebApi/signalr/connect` + query,
    { headers: this.headers }
  );

  return new Promise((res, rej) => {
    let timeout = null;

    ws.on('open', () => {
      this.fetch(`/WebApi/signalr/start` + query)
        .then(() => this.fetch(
          link,
          {
            method: 'post',
            headers: { 
              'at': this._at,
              'content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
              selectedData: data,
              params: [
                { name: 'SCHOOLYEARID', value: this._yearId },
                { name: 'SERVERTIMEZONE', value: this._serverTimeZone },
                { name: 'DATEFORMAT', value: this._dateFormat },
                { name: 'FULLSCHOOLNAME', value: this._skoolName }
              ]
            })
          }
        ))
        .then(res => res.json())
        .then(({taskId}) => {
          timeout = setTimeout(() => ws.close(4010, 'The waiting time has been exceeded'), 6e4);
          ws.send(
              JSON.stringify({
                I: 0,
                H: 'queuehub',
                M: 'StartTask',
                A: [taskId],
              })
          );
        })
        .catch(() => ws.close(4001, 'Не удалось открыть соединение'));
    });

    ws.on('message', (msg: string) => {
      let data: any;
      try {
        data = JSON.parse(msg);
      } catch (e) {
        return;
      }

      switch (data?.M?.[0]?.M) {
        case 'complete':
          res(data.M[0].A[0].Data);
          ws.close(4000);
          break;
        case 'error':
          close.call(this, 4003, data.M[0].A[0].Details, true);
          break;
      }
    });

    ws.on('error', err => close.call(this, 4002, err.message, true));

    ws.on('close', close.bind(this));


    function close(code: number, msg: string, close = false) {
      clearTimeout(timeout);
      if (close) ws.close(4009);
      switch (code) {
        case 4000: break;
        case 4001:
          rej(new WorkError('Error during initialization.', 12));
          break;
        case 4002:
          rej(new WorkError('Error in socket.\nError: ' + msg, 13));
          break;
        case 4003:
          rej(new WorkError('Error in task.\nError: ' + msg, 14));
          break;
        case 4009:
          return;
        case 4010:
          rej(new WorkError('Error in task.\nError: ' + msg, -11));
          break;
        default:
          rej(new WorkError('Unknown error.\nError: ' + msg, -10));
      }

      this.fetch(`/WebApi/signalr/abort` + query);
    }
  });
}


/** Parsing errors */
export class WorkError {
  public code: number;
  public message: string;

  /**
   * Error initialization
   * @param msg Error message
   * @param code Error number
   */
  constructor(msg: string, code: number) {
    this.code = code;
    this.message = msg;
  }

  /** Error to string */
  toString():string {
    return `Code: ${this.code}\nMessage: ${this.message}`;
  }
}

/** Fetch errors */
export class FetchError {
  private status: number;
  private statusText: string;

  /**
   * Error initialization
   * @param res Server response
   */
  constructor(res: Response) {
    this.status = res.status;
    this.statusText = res.statusText;
  }

  /** Error message */
  get message(): string {
    return `Code: ${this.status}\nText: ${this.statusText}`;
  }

  /** Error on the server */
  get isServerError(): boolean {
    return this.status >= 500;
  }

  /** Error on the client */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}