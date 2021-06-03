# Vi Sgo API v1.0.0

Содержимое документа

- [Форма авторизации](#форма-авторизации)
  - [checkHost(host)](#checkhosthost)
  - [authForm(host)](#authformhost)
  - [uploadAuthForm(host, allSelected)](#uploadauthformhost-allselected)
- [Авторизация](#авторизация)
  - [needAuth](#needauth)
  - [logIn()](#login)
  - [logOut()](#logout)
- [Данные пользователя](#данные-пользователя)
  - [userInfo()](#userinfo)
  - [userPhoto()](#userphoto)
- [Дневник](#дневник)
  - [diary(start, end)](#diarystart-end)
  - [assignment(id)](#assignmentid)
  - [assignmentTypes()](#assignmentTypes)
- [Расписание](#расписание)
  - [birthdays(date[, withoutParens])](#birthdaysdate-withoutParens)
  - [scheduleDay(date)](#scheduledaydate)
  - [scheduleWeek(date)](#scheduleweekdate)
- [Отчеты](#отчеты)
  - [subject(id, start, end)](#subjectid-start-end)
  - [journal(start, end)](#journalstart-end)

### Форма авторизации

#### checkHost(host)

- host: <[String]> Ссылка на сервер
- returns: <[Promise]> Promise, который в случае успеха вернет `true`

#### authForm(host)

- host: <[String]> Ссылка на сервер
- returns: <[Promise]> Promise, который в случае успеха вернет скелет формы авторизации

#### uploadAuthForm(host, allSelected)

- host: <[String]> Ссылка на сервер
- allSelected: <[String]> Уже выбранные значения в формате `<key>=<value>&...<key>=<value>`
- returns: <[Promise]> Promise, который в случае успеха вернет опции для следующего селектора

### Авторизация

> Для определения надобности авторизации используйте `needAuth`.
> Если `needAuth` равен `true`, то при повторной авторизации советую выйти из системы.

#### needAuth

- returns: <[Boolean]> `true` если авторизация была произведена и время действия сессии не истекло

#### logIn()

- returns: <[Promise]> Promise, который разрешается при успешном входе в систему

#### logOut()

- returns: <[Promise]> Promise, который разрешается при успешном выходе из системы

### Данные пользователя

> Все последующие данные доступны только после авторизации, проверить ее статус можно с помощью `needAuth`

#### userInfo()

- returns: <[Promise]> Promise вернет объект, который будет состоять из `email`, `phone`, `lastName`, `firstName`, `birthDate` и `patronymic`

#### userPhoto()

- returns: <[Promise]> Promise вернет фотографию пользователя в виде буфера

### Дневник

> API дневника в сравнении с отчетами очень стабильное и имеет среднее время ответа `350ms`
> Скоро будет сделано несколько методов, которые заменяют функционал отчетов, но основываются на API дневника

#### diary(start, end)

- start: <[Date]> Начало периода
- end: <[Date]> Конец периода
- returns: <[Promise]> Данные дней выбранного периода
  > Период должен быть больше 1 дня

#### assignment(id)

- id: <[Number]> ID задания
- returns: <[Promise]> Информация об оценке
  > В случае отсутствия задания сервер ответит ошибкой 409

#### assignmentTypes()

- returns: <[Promise]> Все возможные типы заданий

### Расписание

#### birthdays(date[, withoutParents])

- date: <[Date]> День месяца, для которого нужен список именинников
- withoutParents: <[Boolean]> Нужно ли отображать родителей
- returns: <[Promise]> Список именинников в формате JSON

#### scheduleDay(date)

- date: <[Date]> День, для которого нужно расписание уроков
- returns: <[Promise]> Расписание в формате JSON

#### scheduleWeek(date)

- date: <[Date]> День недели, для которой вам нужно расписание занятий
- returns: <[Promise]> Расписание на неделю в формате JSON

### Отчеты

> Это самый нестабильный раздел сетевого. При большой нагрузке на сервер ждать отчета нет смысла, так как сетевой отправит его на почту игнорируя запрос. Поэтому для всех этим методов установлен тайм-аут в 1 минуту.

#### subject(id, start, end)

- id: <[String] | [Number]> ID предмета, все доступные предметы можно посмотреть в `subjects`
- start: <[Date]> Начало периода
- end: <[Date]> Конец периода
- returns: <[Promise]> Отчет об успеваемости в формате JSON

#### journal(start, end)

- start: <[Date]> Начало периода
- end: <[Date]> Конец периода
- returns: <[Promise]> Отчет об успеваемости и посещаемости в формате JSON

[boolean]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[date]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date
[string]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String
[number]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Number
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
