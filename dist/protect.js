"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./parser");
var helpers_1 = require("./helpers");
var proxyFunctions = [
    "logIn",
    "logOut",
    "appContext",
    "userInfo",
    "userPhoto",
    "diary",
    "subject",
    "journal",
    "birthdays",
    "assignment",
    "announcements",
    "assignmentTypes",
    "unreadedMessages",
];
var runningProcesses = {};
var _loop_1 = function (prop) {
    if (!proxyFunctions.includes(prop))
        return "continue";
    parser_1.default.prototype[prop] = new Proxy(parser_1.default.prototype[prop], {
        apply: function (fun, ctx, args) {
            var processName = helpers_1.hash(prop, __assign({}, args));
            if (processName in runningProcesses)
                return runningProcesses[processName];
            else {
                runningProcesses[processName] = fun
                    .call.apply(fun, __spreadArray([ctx], args)).then(function (data) { return (delete runningProcesses[processName], data); });
                return runningProcesses[processName];
            }
        },
    });
};
for (var _i = 0, _a = Object.getOwnPropertyNames(parser_1.default.prototype); _i < _a.length; _i++) {
    var prop = _a[_i];
    _loop_1(prop);
}
exports.default = parser_1.default;
