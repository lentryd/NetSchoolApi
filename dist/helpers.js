"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchError = exports.WorkError = exports.reportFile = exports.data2str = exports.hash = exports.md5 = void 0;
var WebSocket = require("ws");
var crypto = require("crypto");
/**
 * MD5 hash
 * @param str original string
 */
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
exports.md5 = md5;
/**
 * MD5 hash of length 8
 * @param str original string
 * @param obj original string
 */
function hash(str, obj) {
    return md5(str + data2str(obj)).substring(0, 8);
}
exports.hash = hash;
/**
 * Translating data to a string
 * @param data Any data
 */
function data2str(data) {
    var str = '';
    for (var name_1 in data) {
        var value = data[name_1];
        if (value.toString() == '[object Object]')
            value = data2str(value);
        if (str)
            str += ', ';
        str += name_1 + ': ' + value.toString();
    }
    return '{' + str + '}';
}
exports.data2str = data2str;
/**
 * Loading the report
 * @param link The link to the resource
 * @param data Of the selected data
 */
function reportFile(link, data) {
    var _this = this;
    return this.fetch("/WebApi/signalr/negotiate" +
        ("?_=" + this._ver) +
        ("&at=" + this._at) +
        "&clientProtocol=1.5" +
        "&transport=webSockets" +
        "&connectionData=%5B%7B%22name%22%3A%22queuehub%22%7D%5D")
        .then(function (res) { return res.json(); })
        .then(function (_a) {
        var ConnectionToken = _a.ConnectionToken;
        return makeWSRequest.call(_this, ConnectionToken, link, data);
    })
        .then(function (id) { return _this.fetch("/webapi/files/" + id, { headers: { at: _this._at } }); })
        .then(function (res) { return res.text(); });
}
exports.reportFile = reportFile;
/** The receipt of the report */
function makeWSRequest(token, link, data) {
    var _this = this;
    token = encodeURIComponent(token);
    var query = ("?at=" + this._at +
        ("&_=" + this._ver) +
        "&clientProtocol=1.5" +
        "&transport=webSockets" +
        "&connectionData=%5B%7B%22name%22%3A%22queuehub%22%7D%5D" +
        ("&connectionToken=" + token));
    var ws = new WebSocket(this.host.replace('http', 'ws') + "/WebApi/signalr/connect" + query, { headers: this.headers });
    return new Promise(function (res, rej) {
        var timeout = null;
        ws.on('open', function () {
            _this.fetch("/WebApi/signalr/start" + query)
                .then(function () { return _this.fetch(link, {
                method: 'post',
                headers: {
                    'at': _this._at,
                    'content-type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    selectedData: data,
                    params: [
                        { name: 'SCHOOLYEARID', value: _this._yearId },
                        { name: 'SERVERTIMEZONE', value: _this._serverTimeZone },
                        { name: 'DATEFORMAT', value: _this._dateFormat },
                        { name: 'FULLSCHOOLNAME', value: _this._skoolName }
                    ]
                })
            }); })
                .then(function (res) { return res.json(); })
                .then(function (_a) {
                var taskId = _a.taskId;
                timeout = setTimeout(function () { return ws.close(4010, 'The waiting time has been exceeded'); }, 6e4);
                ws.send(JSON.stringify({
                    I: 0,
                    H: 'queuehub',
                    M: 'StartTask',
                    A: [taskId],
                }));
            })
                .catch(function () { return ws.close(4001, 'Не удалось открыть соединение'); });
        });
        ws.on('message', function (msg) {
            var _a, _b;
            var data;
            try {
                data = JSON.parse(msg);
            }
            catch (e) {
                return;
            }
            switch ((_b = (_a = data === null || data === void 0 ? void 0 : data.M) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.M) {
                case 'complete':
                    res(data.M[0].A[0].Data);
                    ws.close(4000);
                    break;
                case 'error':
                    close.call(_this, 4003, data.M[0].A[0].Details, true);
                    break;
            }
        });
        ws.on('error', function (err) { return close.call(_this, 4002, err.message, true); });
        ws.on('close', close.bind(_this));
        function close(code, msg, close) {
            if (close === void 0) { close = false; }
            clearTimeout(timeout);
            if (close)
                ws.close(4009);
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
            this.fetch("/WebApi/signalr/abort" + query);
        }
    });
}
/** Parsing errors */
var WorkError = /** @class */ (function () {
    /**
     * Error initialization
     * @param msg Error message
     * @param code Error number
     */
    function WorkError(msg, code) {
        this.code = code;
        this.message = msg;
    }
    /** Error to string */
    WorkError.prototype.toString = function () {
        return "Code: " + this.code + "\nMessage: " + this.message;
    };
    return WorkError;
}());
exports.WorkError = WorkError;
/** Fetch errors */
var FetchError = /** @class */ (function () {
    /**
     * Error initialization
     * @param res Server response
     */
    function FetchError(res) {
        this.status = res.status;
        this.statusText = res.statusText;
    }
    Object.defineProperty(FetchError.prototype, "message", {
        /** Error message */
        get: function () {
            return "Code: " + this.status + "\nText: " + this.statusText;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FetchError.prototype, "isServerError", {
        /** Error on the server */
        get: function () {
            return this.status >= 500;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FetchError.prototype, "isClientError", {
        /** Error on the client */
        get: function () {
            return this.status >= 400 && this.status < 500;
        },
        enumerable: false,
        configurable: true
    });
    return FetchError;
}());
exports.FetchError = FetchError;
