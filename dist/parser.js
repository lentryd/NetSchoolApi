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
Object.defineProperty(exports, "__esModule", { value: true });
var node_html_parser_1 = require("node-html-parser");
var node_fetch_1 = require("node-fetch");
var html_parsers_1 = require("./html-parsers");
var helpers_1 = require("./helpers");
/** Parser for SGO */
var Parser = /** @class */ (function () {
    /**
     * Initializing the parser.
     * @param host Domain of SGO
     * @param login Login for authorization
     * @param password Password for authorization
     * @param ttslogin Ttslogin for authorization
     */
    function Parser(host, login, password, ttslogin) {
        this._host = host;
        this._login = login;
        this._password = password;
        this._ttslogin = ttslogin;
        this._at = null;
        this._ver = null;
        this._cookie = {};
        this._secure = true;
        this._sessionTime = null;
        this._userId = null;
        this._yearId = null;
        this._classId = null;
        this._skoolId = null;
        this._currYear = null;
        this._serverId = null;
        this._skoolName = null;
        this._timeFormat = null;
        this._dateFormat = null;
        this._serverTimeZone = null;
        this.subjects = [];
        this.studyYear = { start: null, end: null };
    }
    /** Checks whether this site can be used */
    Parser.checkHost = function (host) {
        return node_fetch_1.default("http://" + host + "/webapi/prepareloginform")
            .then(function (res) {
            if (res.ok)
                return true;
            else if (res.status === 404)
                return false;
            else
                throw new helpers_1.FetchError(res);
        });
    };
    /** Creating an authorization form */
    Parser.authForm = function (host) {
        var selectors = [];
        return this.checkHost(host)
            .then(function (fit) {
            if (!fit)
                throw new Error("This server(" + host + ") is not suitable for the parser.");
            else
                return node_fetch_1.default("http://" + host + "/webapi/logindata");
        })
            .then(function (res) {
            if (!res.ok ||
                !res.headers.get('content-type').startsWith('application/json'))
                throw new helpers_1.FetchError(res);
            return res.json();
        })
            .then(function (_a) {
            var version = _a.version;
            return node_fetch_1.default("http://" + host + "/vendor/pages/about/templates/loginform.html?ver=" + version);
        })
            .then(function (res) {
            if (!res.ok ||
                !res.headers.get('content-type').startsWith('text/html'))
                throw new helpers_1.FetchError(res);
            return res.text();
        })
            .then(node_html_parser_1.parse)
            .then(function (html) {
            for (var _i = 0, _a = html.querySelectorAll('#message select'); _i < _a.length; _i++) {
                var s = _a[_i];
                selectors.push({
                    id: s.id,
                    name: s.getAttribute('name'),
                    value: null,
                    options: [],
                });
            }
            return node_fetch_1.default("http://" + host + "/webapi/prepareloginform");
        })
            .then(function (res) {
            if (!res.ok ||
                !res.headers.get('content-type').startsWith('application/json'))
                throw new helpers_1.FetchError(res);
            return res.json();
        })
            .then(function (data) {
            var _loop_1 = function (name_1) {
                if (!name_1)
                    return "continue";
                var value = data[name_1];
                var index = selectors.findIndex(function (s) {
                    return s.id.toLowerCase() == name_1.toLowerCase() ||
                        s.name.toLowerCase() == name_1.toLowerCase();
                });
                if (index < 0)
                    return "continue";
                selectors[index][typeof value == 'number' ?
                    'value' :
                    'options'] = value;
            };
            for (var name_1 in data) {
                _loop_1(name_1);
            }
            return selectors;
        });
    };
    /** Loading value for the current selection */
    Parser.uploadAuthForm = function (host, allSelected) {
        return this.checkHost(host)
            .then(function (fit) {
            if (!fit)
                throw new Error("This server(" + host + ") is not suitable for the parser.");
            else
                return node_fetch_1.default("http://" + host + "/webapi/loginform?" + allSelected + "&LASTNAME=" + allSelected.match(/(\w+?)=-*\d+?$/)[1]);
        })
            .then(function (res) {
            if (!res.ok ||
                !res.headers.get('content-type').startsWith('application/json'))
                throw new helpers_1.FetchError(res);
            return res.json();
        })
            .then(function (_a) {
            var items = _a.items;
            return items;
        });
    };
    Object.defineProperty(Parser.prototype, "host", {
        /** Host for this parser */
        get: function () {
            return "http" + (this._secure ? 's' : '') + "://" + this._host;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Parser.prototype, "cookie", {
        /** Cookie for this parser */
        get: function () {
            var str = '';
            for (var key in this._cookie) {
                if (!this._cookie[key])
                    continue;
                if (str != '')
                    str += '; ';
                str += key + '=' + this._cookie[key];
            }
            return str;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Parser.prototype, "headers", {
        /** Headers for this parser */
        get: function () {
            return {
                'host': this._host,
                'cookie': this.cookie,
                'referer': this.host,
                'content-type': 'application/x-www-form-urlencoded',
                'x-requested-with': 'xmlhttprequest',
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Parser.prototype, "needAuth", {
        /** Whether authorization is required for this parser */
        get: function () {
            return !this._at || !this._ver || this._sessionTime - Date.now() < 1000;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Request to the server for this parser
     * @param url Relative pathname
     * @param params Request params
     */
    Parser.prototype.fetch = function (url, params) {
        var _this = this;
        return node_fetch_1.default(this.host + url, __assign(__assign({}, params), { headers: __assign(__assign({}, this.headers), params === null || params === void 0 ? void 0 : params.headers) }))
            .then(function (res) {
            if (!res.ok)
                throw new helpers_1.FetchError(res);
            else
                return _this.saveCookie(res);
        });
    };
    /**
     * Saving of cookie for this parser
     * @param res Server response
     */
    Parser.prototype.saveCookie = function (res) {
        var _a, _b, _c, _d;
        var cookies = (_d = (_c = (_b = (_a = res.headers.get('set-cookie')) === null || _a === void 0 ? void 0 : _a.replace) === null || _b === void 0 ? void 0 : _b.call(_a, /expires=.+?;/g, '')) === null || _c === void 0 ? void 0 : _c.split) === null || _d === void 0 ? void 0 : _d.call(_c, ', ');
        for (var _i = 0, _e = cookies !== null && cookies !== void 0 ? cookies : []; _i < _e.length; _i++) {
            var c = _e[_i];
            var _f = c.match(/^(.+?)=(.+?)(?=;|$)/) || [], name_2 = _f[1], value = _f[2];
            if (!name_2 || !value)
                continue;
            this._cookie[name_2] = value;
        }
        return res;
    };
    /** Сheck the dates */
    Parser.prototype.checkDates = function () {
        var dates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dates[_i] = arguments[_i];
        }
        for (var _a = 0, dates_1 = dates; _a < dates_1.length; _a++) {
            var date = dates_1[_a];
            if (date < this.studyYear.start ||
                date > this.studyYear.end ||
                date.toJSON() == null) {
                return false;
            }
        }
        return true;
    };
    /** Log in SGO */
    Parser.prototype.logIn = function () {
        var _this = this;
        return this.fetch('')
            .then(function (res) { return _this._secure = res.url.startsWith('https'); })
            .then(function () { return _this.fetch('/webapi/auth/getdata', { method: 'post' }); })
            .then(function (res) { return res.json(); })
            .then(function (_a) {
            var lt = _a.lt, ver = _a.ver, salt = _a.salt;
            _this._ver = ver;
            var password = helpers_1.md5(salt + helpers_1.md5(_this._password));
            var body = ("lt=" + lt + "&" +
                ("ver=" + ver + "&") +
                ("pw2=" + password + "&") +
                ("UN=" + encodeURI(_this._login) + "&") +
                ("PW=" + password.substring(0, _this._password.length) + "&") +
                "LoginType=1&" +
                _this._ttslogin);
            return _this.fetch('/webapi/login', { method: 'post', body: body });
        })
            .then(function (res) { return res.json(); })
            .then(function (_a) {
            var at = _a.at, timeOut = _a.timeOut;
            _this._at = at;
            _this._sessionTime = Date.now() + timeOut;
            if (!_this._userId)
                return _this.appContext();
        })
            .then(function () { return void 0; });
    };
    /** Log out SGO*/
    Parser.prototype.logOut = function () {
        var _this = this;
        return this.fetch('/asp/logout.asp', {
            method: 'post',
            body: ("at=" + this._at + "&" +
                ("ver=" + this._ver)),
        })
            .then(function () {
            _this._at = null;
            _this._ver = null;
            _this._sessionTime = null;
        });
    };
    /** Save application context */
    Parser.prototype.appContext = function () {
        var _this = this;
        return this.fetch("/asp/MySettings/MySettings.asp?at=" + this._at, {
            method: 'post',
            body: ("at=" + this._at + "&" +
                ("ver=" + this._ver + "&"))
        })
            .then(function (res) { return res.text(); })
            .then(html_parsers_1.parserAppContext)
            .then(function (ctx) {
            _this._at = ctx.at;
            _this._ver = ctx.ver;
            _this._yearId = ctx.yearId;
            _this._skoolId = ctx.schoolId;
            _this._currYear = ctx.currYear;
            _this._skoolName = ctx.fullSchoolName;
            _this._dateFormat = ctx.dateFormat;
            _this._timeFormat = ctx.timeFormat;
            _this._serverTimeZone = ctx.serverTimeZone;
            return _this.fetch('/webapi/reports/studentgrades', {
                headers: {
                    at: _this._at
                }
            });
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
            var filterSources = data.filterSources;
            var userId = filterSources.find(function (f) { return f.filterId == 'SID'; });
            var classId = filterSources.find(function (f) { return f.filterId == 'PCLID_IUP'; });
            var subjects = filterSources.find(function (f) { return f.filterId == 'SGID'; });
            var range = filterSources.find(function (f) { return f.filterId == 'period'; });
            _this._userId = parseInt(userId.defaultValue);
            _this._classId = parseInt(classId.defaultValue);
            _this.subjects = subjects.items.map(function (s) { return ({ id: s.value, name: s.title }); });
            _this.studyYear.start = new Date(range.defaultRange.start);
            _this.studyYear.end = new Date(range.defaultRange.end);
        });
    };
    /** Returns thr user's information */
    Parser.prototype.userInfo = function () {
        return this.fetch("/asp/MySettings/MySettings.asp?at=" + this._at, {
            method: 'post',
            body: ("at: " + this._at +
                ("ver: " + this._ver)),
        })
            .then(function (res) { return res.text(); })
            .then(html_parsers_1.parseUserInfo);
    };
    /** Returns the user's photo */
    Parser.prototype.userPhoto = function () {
        return this.fetch("/webapi/users/photo" +
            ("?AT=" + this._at) +
            ("&VER=" + this._ver) +
            ("&userId=" + this._userId))
            .then(function (res) { return res.buffer(); });
    };
    /** Returns diary */
    Parser.prototype.diary = function (start, end) {
        if (!this.checkDates(start, end)) {
            throw new Error("The start and end values is not valid.");
        }
        if (end.getTime() - start.getTime() < 8.64e7) {
            throw new Error("The interval should be more than a day.");
        }
        return this.fetch('/webapi/student/diary' +
            ("?vers=" + this._ver) +
            ("&yearId=" + this._yearId) +
            ("&weekEnd=" + end.toJSON()) +
            ("&studentId=" + this._userId) +
            ("&weekStart=" + start.toJSON()), {
            headers: { at: this._at }
        })
            .then(function (res) { return res.json(); });
    };
    /** Returns subject */
    Parser.prototype.subject = function (id, start, end) {
        if (!this.subjects.find(function (s) { return s.id == id; })) {
            throw new Error("The id value is not valid.");
        }
        if (!this.checkDates(start, end)) {
            throw new Error("The start and end values is not valid.");
        }
        return helpers_1.reportFile.call(this, '/webapi/reports/studentgrades/queue', [
            {
                filterId: 'SID',
                filterValue: this._userId,
            },
            {
                filterId: 'PCLID_IUP',
                filterValue: this._classId + '_0',
            },
            {
                filterId: 'SGID',
                filterValue: id,
            },
            {
                filterId: 'period',
                filterValue: start.toJSON() + ' - ' + end.toJSON(),
            },
        ])
            .then(html_parsers_1.parseSubject);
    };
    /** Returns journal */
    Parser.prototype.journal = function (start, end) {
        if (!this.checkDates(start, end)) {
            throw new Error("The start and end values is not valid.");
        }
        return helpers_1.reportFile.call(this, '/webapi/reports/studenttotal/queue', [
            {
                filterId: 'SID',
                filterValue: this._userId,
            },
            {
                filterId: 'PCLID',
                filterValue: this._classId,
            },
            {
                filterId: 'period',
                filterValue: start.toJSON() + ' - ' + end.toJSON(),
            },
        ])
            .then(html_parsers_1.parseJournal);
    };
    /** Returns birthday boys of the month */
    Parser.prototype.birthdays = function (date, withoutParens) {
        if (withoutParens === void 0) { withoutParens = true; }
        if (!this.checkDates(date)) {
            throw new Error("The date values is not valid.");
        }
        return this.fetch('/asp/Calendar/MonthBirth.asp', {
            method: 'post',
            body: ("AT=" + this._at + "&" +
                ("VER=" + this._ver + "&") +
                ("Year=" + date.getFullYear() + "&") +
                ("Month=" + (date.getMonth() + 1) + "&") +
                ("PCLID=" + this._classId + "&") +
                "ViewType=1&" +
                "LoginType=0&" +
                "BIRTH_STAFF=1&" +
                ("BIRTH_PARENT=" + (withoutParens ? 0 : 4) + "&") +
                "BIRTH_STUDENT=2&" +
                "From_MonthBirth=1&" +
                ("MonthYear=" + (date.getMonth() + 1 + ',' + date.getFullYear())))
        })
            .then(function (res) { return res.text(); })
            .then(html_parsers_1.parseBirthday);
    };
    /** Returns information about the assignment */
    Parser.prototype.assignment = function (id) {
        return this.fetch("/webapi/student/diary/assigns/" + id + "?studentId=" + this._userId, { headers: { at: this._at } })
            .then(function (res) { return res.json(); });
    };
    /** Returns announcements */
    Parser.prototype.announcements = function () {
        return this.fetch('/webapi/announcements?take=-1', {
            headers: { at: this._at }
        })
            .then(function (res) { return res.json(); });
    };
    /** Returns assignment types */
    Parser.prototype.assignmentTypes = function () {
        return this.fetch('/webapi/grade/assignment/types')
            .then(function (res) { return res.json(); });
    };
    /** Returns count of unread messages */
    Parser.prototype.unreadedMessages = function () {
        return this.fetch('/webapi/mail/messages/unreaded', {
            headers: { at: this._at }
        })
            .then(function (res) { return res.json(); });
    };
    return Parser;
}());
exports.default = Parser;
