"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBirthday = exports.parseJournal = exports.parseSubject = exports.parseUserInfo = exports.parserAppContext = void 0;
var htmlParser = require("node-html-parser");
/**
 * Parsing html in AppContext.
 * @param html Any page of the SGO
 */
function parserAppContext(html) {
    var _a, _b;
    return new Function(((_b = (_a = html === null || html === void 0 ? void 0 : html.replace('pageVer', 'appContext.ver')) === null || _a === void 0 ? void 0 : _a.match(/\w+ appContext = {.+?};|appContext\.(?!ya)\w+ = (?!function).+?;/sg)) === null || _b === void 0 ? void 0 : _b.reduce(function (a, c) { return a += c; })) +
        'return appContext;')();
}
exports.parserAppContext = parserAppContext;
/**
 * Parsing html in UserInfo
 * @param html Settings page of the SGO
  */
function parseUserInfo(html) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var email = (_b = (_a = html.match(/E-Mail.+?value="(.*?)"/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
    var phone = +((_d = (_c = html.match(/Мобильный телефон.+?value="(.*?)"/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 0);
    var lastName = (_f = (_e = html.match(/Фамилия.+?value="(.*?)"/)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : '';
    var firstName = (_h = (_g = html.match(/Имя.+?value="(.*?)"/)) === null || _g === void 0 ? void 0 : _g[1]) !== null && _h !== void 0 ? _h : '';
    var patronymic = (_k = (_j = html.match(/Отчество.+?value="(.*?)"/)) === null || _j === void 0 ? void 0 : _j[1]) !== null && _k !== void 0 ? _k : '';
    var birthDateRaw = (_m = (_l = html.match(/Дата рождения.+?value="(.*?)"/)) === null || _l === void 0 ? void 0 : _l[1]) !== null && _m !== void 0 ? _m : '';
    var match = birthDateRaw.match(/(\d{2})\.(\d{2})\.*(\d{0,4})/);
    var birthDate = new Date(match[2] + " " + match[1] + " " + match[3]);
    return {
        email: email,
        phone: phone,
        lastName: lastName,
        firstName: firstName,
        birthDate: birthDate,
        patronymic: patronymic,
    };
}
exports.parseUserInfo = parseUserInfo;
/**
 * Parsing html in Subject
 * @param html Subject page of the SGO
  */
function parseSubject(html) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var assignments = [];
    var root = htmlParser.parse(html);
    var trs = (_a = root.querySelectorAll('table.table-print tr')) !== null && _a !== void 0 ? _a : [];
    for (var _i = 0, trs_1 = trs; _i < trs_1.length; _i++) {
        var tr = trs_1[_i];
        var tds = (_b = tr === null || tr === void 0 ? void 0 : tr.querySelectorAll('td')) !== null && _b !== void 0 ? _b : [];
        var type = (_c = tds[0]) === null || _c === void 0 ? void 0 : _c.structuredText;
        var name_1 = (_d = tds[1]) === null || _d === void 0 ? void 0 : _d.structuredText;
        var date = str2date((_e = tds[2]) === null || _e === void 0 ? void 0 : _e.structuredText);
        var issueDate = str2date((_f = tds[3]) === null || _f === void 0 ? void 0 : _f.structuredText);
        var mark = +((_g = tds[4]) === null || _g === void 0 ? void 0 : _g.structuredText);
        if (!type || !name_1 || !date || !issueDate || !mark)
            continue;
        assignments.push({
            type: type,
            name: name_1,
            mark: mark,
            date: date,
            issueDate: issueDate
        });
    }
    return {
        assignments: assignments,
        middleMark: (_s = +((_r = (_q = (_p = (_o = (_m = (_l = (_k = (_j = (_h = trs.pop()) === null || _h === void 0 ? void 0 : _h.removeWhitespace) === null || _j === void 0 ? void 0 : _j.call(_h)) === null || _k === void 0 ? void 0 : _k.childNodes) === null || _l === void 0 ? void 0 : _l[2]) === null || _m === void 0 ? void 0 : _m.text) === null || _o === void 0 ? void 0 : _o.replace) === null || _p === void 0 ? void 0 : _p.call(_o, ',', '.')) === null || _q === void 0 ? void 0 : _q.replace) === null || _r === void 0 ? void 0 : _r.call(_q, /^\D+(?=\d)/, ''))) !== null && _s !== void 0 ? _s : null,
    };
    /**
     * Перевод строки в время
     * @param {String} str Строка в формате dd.mm.yy
     * @return {Date} Время
     */
    function str2date(str) {
        var _a;
        if (str === void 0) { str = ''; }
        var _b = (_a = str
            .match(/(\d{1,2})\.(\d{1,2})\.(\d{1,2})/)) !== null && _a !== void 0 ? _a : [], _c = _b[1], date = _c === void 0 ? 8 : _c, _d = _b[2], month = _d === void 0 ? 6 : _d, _e = _b[3], year = _e === void 0 ? 2004 : _e;
        return new Date(month + "-" + date + "-" + year);
    }
}
exports.parseSubject = parseSubject;
/**
 * Parsing html in Journal
 * @param html Journal page of the SGO
  */
function parseJournal(html) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // Начало учебного года
    var studyYear = (_c = (_b = (_a = html.match(/Учебный год:<\/b>(.+?)</s)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim) === null || _c === void 0 ? void 0 : _c.call(_b);
    // Индекс месяца
    var monthIndex = {
        Сентябрь: 8,
        Октябрь: 9,
        Ноябрь: 10,
        Декабрь: 11,
        Январь: 12,
        Февраль: 13,
        Март: 14,
        Апрель: 15,
        Май: 16,
        Июнь: 17,
        Июль: 18,
        Август: 19,
    };
    // Получаем таблицу
    var table = htmlParser.parse("<body>" + html + "</body>")
        .querySelector('.table-print');
    if (!table)
        return [];
    // Получаем средний балл
    var middleMarks = table.querySelectorAll('td.cell-num');
    // Получаем предметы
    var subjects = table.querySelectorAll('td.cell-text');
    // Получаем месяца
    var months = table.querySelectorAll('tr')[0].querySelectorAll('th');
    // Получаем даты
    var dates = table.querySelectorAll('tr')[1].querySelectorAll('th');
    // Получаем период месяцев и удаляем строку с месяцами
    var journalMonths = [];
    for (var i in months) {
        if (!i)
            continue;
        var m = months[i];
        var to = +((_d = m === null || m === void 0 ? void 0 : m.getAttribute) === null || _d === void 0 ? void 0 : _d.call(m, 'colspan'));
        var from = (_f = (_e = journalMonths[journalMonths.length - 1]) === null || _e === void 0 ? void 0 : _e.to) !== null && _f !== void 0 ? _f : 0;
        if (!to)
            continue;
        journalMonths.push({
            id: m.innerText,
            from: from,
            to: from + to,
        });
    }
    table.querySelectorAll('tr')[0].remove();
    // Получаем даты в формате Date и удаляем строку c датами
    var journalDates = [];
    var _loop_1 = function (i) {
        if (!i)
            return "continue";
        var d = dates[i];
        var date = new Date(studyYear +
            '-01-' +
            (+d.innerText < 10 ? 0 : '') +
            d.innerText +
            'T00:00:00.000Z');
        var month = (_g = journalMonths.find(function (m) { return i >= m.from && i < m.to; })) === null || _g === void 0 ? void 0 : _g.id;
        if (!month)
            return "continue";
        date.setMonth(monthIndex[month]);
        journalDates.push(date);
    };
    for (var i in dates) {
        _loop_1(i);
    }
    table.querySelectorAll('tr')[0].remove();
    // Получаем название предметов и удаляем HTML элемент
    var journalSubjects = [];
    for (var i in subjects) {
        if (!i)
            continue;
        var s = subjects[i];
        var name_2 = s === null || s === void 0 ? void 0 : s.innerText;
        if (!name_2)
            continue;
        journalSubjects.push(name_2);
        s.remove();
    }
    // Получаем средний балл и удаляем HTML элемент
    var journalMiddleMarks = [];
    for (var i in middleMarks) {
        if (!i)
            continue;
        var m = middleMarks[i];
        var num = +((_j = (_h = m === null || m === void 0 ? void 0 : m.innerText) === null || _h === void 0 ? void 0 : _h.replace) === null || _j === void 0 ? void 0 : _j.call(_h, ',', '.'));
        if (!num)
            continue;
        journalMiddleMarks.push(num);
        m.remove();
    }
    // Получаем оценки и готовим результат
    var result = [];
    var assignmentsRow = table.querySelectorAll('tr');
    for (var i in assignmentsRow) {
        if (!i)
            continue;
        var row = assignmentsRow[i];
        if (!(row === null || row === void 0 ? void 0 : row.innerHTML))
            continue;
        result.push({
            name: journalSubjects[i],
            middleMark: journalMiddleMarks[i],
            assignments: [],
        });
        var assignments = row.querySelectorAll('td');
        for (var i1 in assignments) {
            if (!i)
                continue;
            var a = assignments[i1];
            if (!(a === null || a === void 0 ? void 0 : a.structuredText))
                continue;
            result[i].assignments.push({
                value: a.structuredText.replace(/&nbsp;/g, ' '),
                date: journalDates[i1],
            });
        }
    }
    return result;
}
exports.parseJournal = parseJournal;
/**
 * Parsing html in Birthday
 * @param html Birthday page of the SGO
  */
function parseBirthday(html) {
    var root = htmlParser.parse(html);
    var table = root.querySelector('.table.print-block');
    table.querySelector('tr').remove();
    var people = table.querySelectorAll('tr');
    var result = [];
    people.forEach(function (p) {
        var data = p.querySelectorAll('td');
        result.push({
            date: str2date(data[2].structuredText),
            name: data[3].structuredText,
            role: data[1].structuredText,
            class: data[0].structuredText,
        });
    });
    result.sort(function (a, b) { return +a.date - +b.date; });
    return result;
    /**
     * Функция для получения даты
     * @param {String} str строка с датой типа `8.06`
     * @return {Date}
     */
    function str2date(str) {
        var _a, _b;
        var match = str === null || str === void 0 ? void 0 : str.match(/(\d{1,2})\.(\d{2})/);
        var day = +((_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : 20);
        var month = +((_b = match === null || match === void 0 ? void 0 : match[2]) !== null && _b !== void 0 ? _b : 4);
        var date = new Date();
        date.setDate(day);
        date.setHours(0, 0, 0);
        date.setMonth(month - 1);
        return date;
    }
}
exports.parseBirthday = parseBirthday;
