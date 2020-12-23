import Parser from './parser';
import { hash } from './helpers';

const proxyFunctions = [
  'logIn',
  'logOut',
  'appContext',
  'userInfo',
  'userPhoto',
  'diary',
  'subject',
  'journal',
  'birthdays',
  'assignment',
  'announcements',
  'assignmentTypes',
  'unreadedMessages'
];
const runningProcesses = {};

for (const prop of Object.getOwnPropertyNames(Parser.prototype)) {
  if (!proxyFunctions.includes(prop)) continue;

  Parser.prototype[prop] = new Proxy(Parser.prototype[prop], {
    apply(fun, ctx, args) {
      const processName = hash(prop, { ...args });
      if (processName in runningProcesses) return runningProcesses[processName];
      else {
        runningProcesses[processName] = fun
            .call(ctx, ...args)
            .then(data => (
              delete runningProcesses[processName],
              data
            ));
        return runningProcesses[processName];
      }
    }
  });
}

export default Parser;
