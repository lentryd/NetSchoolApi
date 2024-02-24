# Методы

- [Управление сессией](#управление-сессией)
  - [.logIn()](#login)
  - [.logOut()](#logout)
  - [.sessionValid()](#sessionvalid)
- [Пользователь](#пользователь)
  - [.info()](#info)
  - [.photo()](#photo)
- [Дневник](#дневник)
  - [.diary()](#diary)
  - [.assignment()](#assignment)
  - [.downloadFile()](#downloadfile)
  - [.assignmentTypes()](#assignmenttypes)
- [Расписание](#расписание)
  - [.scheduleDay()](#scheduleday)
  - [.scheduleWeek()](#scheduleweek)
- [Отчеты](#отчеты)
  - [.reportFile()](#reportfile)
  - [.grades()](#grades)
  - [.journal()](#journal)
- [Дополнительно](#дополнительно)
  - [.fetch()](#fetch)
  - [.contextAsync](#contextasync)

## Управление сессией

> По умолчанию эти методы применяются автоматически.
> Они доступны при импорте класса `Safe`.

---

### .logIn()

#### Не принимает аргументы

#### Возвращает объект класса [Session](reference.md#session)

#### [Пример использования](examples/controlSession.md)

---

### .logOut()

#### Не принимает аргументы

#### Возвращает `void` при успешном выходе или ошибку

#### [Пример использования](examples/controlSession.md)

---

### .sessionValid()

#### Не принимает аргументы

#### Возвращает `true` если сессия активна

#### [Пример использования](examples/sessionValid.md)

## Пользователь

---

### .info()

#### Не принимает аргументы

#### Возвращает объект класса [Info](reference.md#info)

#### [Пример использования](examples/info.md)

---

### .photo()

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указывать.

#### Возвращает `Buffer`

#### [Пример использования](examples/photo.md)

## Дневник

---

### .diary()

> Период дневника может составлять более 7 дней, главное, чтобы он не выходил за рамки учебного года.

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указывать.
- `start: Date` - Дата, с которой начинается дневник
- `end: Date` - Последний день в дневнике

#### Возвращает объект класса [Diary](reference.md#diary)

#### [Пример использования](examples/diary.md)

---

### .assignment()

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указывать.
- `id: number` - ID задания

#### Возвращает объект класса [AssignmentInfo](reference.md#assignmentinfo)

#### [Пример использования](examples/assignment.md)

---

### .downloadFile()

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указывать.
- `assignId: number` - ID задания, с которым связан файл
- `id: number` - ID файла

#### Возвращает файл в виде [Buffer](https://nodejs.org/api/buffer.html)

#### [Пример использования](examples/downloadFile.md)

---

### .assignmentTypes()

#### Не принимает аргументы

#### Возвращает объект класса [AssignmentTypes](reference.md#assignmenttypes)

#### [Пример использования](examples/assignmentTypes.md)

## Расписание

---

### .scheduleDay()

#### Принимает объект данных:

- `classId?: number` - ID класса, можно не указывать
- `date?: Date` - Дата дня, на который нужно получить расписание.

#### Возвращает объект класса [ScheduleDay](reference.md#scheduleday)

#### [Пример использования](examples/scheduleday.md)

---

### .scheduleWeek()

#### Принимает объект данных:

- `classId?: number` - ID класса, можно не указывать
- `date?: Date` - Дата дня, на который нужно получить расписание.

#### Возвращает объект класса [ScheduleWeek](reference.md#scheduleweek)

#### [Пример использования](examples/scheduleweek.md)

## Отчеты

---

### .reportFile()

#### Принимает объект данных:

- `url: string` - Ссылка на таскер (например для "Отчет об успеваемости и посещаемости ученика" это `reports/studenttotal/queue `)
- `filters: { filterId: string, filterValue: string }[]` - Массив с фильтрами (форма, которая находится на странице запроса)
- `yearId?: number` - ID года, за который требуется отчет
- `timeout?: number` - Время в миллисекундах, через которое запрос будет закрыт (по умолчания `60000`, при значении `-1` запрос не будет закрываться)

#### Возвращает html с результатом запроса

#### [Пример использования](examples/reportfile.md)

---

### .grades()

#### Принимает объект данных:

- `​subjectId​: ​number​` - ID предмета
- `start​?: ​Date​` - начало периода
- `end​?: ​Date​` - окончание периода
- `termId​?: ​number​` - ID четверти
- `​classId​?: ​number​` - ID класса
- `studentId​?: ​number​` - ID учащегося

#### Возвращает объект класса [Grades](reference.md#grades)

#### [Пример использования](examples/grades.md)

---

### .journal()

#### Принимает объект данных:

- `start​?: ​Date​` - начало периода
- `end​?: ​Date​` - окончание периода
- `termId​?: ​number​` - ID четверти
- `​classId​?: ​number​` - ID класса
- `studentId​?: ​number​` - ID учащегося

#### Возвращает объект класса [Journal](reference.md#journal)

#### [Пример использования](examples/journal.md)

## Дополнительно

---

### .fetch()

#### Принимает данные:

- `url: string` - Ссылка на ресурс
- `init?: InitRequest` - Объект [InitRequest](reference.md#initrequest)

#### Возвращает объект класса [Response](https://www.npmjs.com/package/node-fetch#class-response)

#### [Пример использования](examples/fetch.md)

---

### .contextAsync

> Это значение, а не метод, и оно не доступно в классе `Safe`.

#### Возвращает объект класса [Context](reference.md#context), представляющий асинхронный контекст

#### [Пример использования](examples/contextAsync.md)
