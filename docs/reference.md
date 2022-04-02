# Классы | NetSchoolApi

- [Дополнительные данные](#дополнительные-данные)
  - [InitRequest](#initrequest)
  - [Context](#context)
  - [Session](#session)
  - [Info](#info)
- [Дневник](#дневник)
  - [Diary](#diary)
  - [Day](#day)
  - [Lesson](#lesson)
  - [Assignment](#assignment)
- [Задания](#задания)
  - [AssignmentInfo](#assignmentinfo)
  - [AssignmentType](#assignmenttype)
  - [AssignmentTypes](#assignmenttypes)
- [Расписание](#задания)
  - [ScheduleDay](#scheduleday)
  - [ScheduleDayLine](#scheduledayline)
  - [ScheduleWeek](#scheduleweek)
  - [ScheduleWeekLine](#scheduleweekline)
- [Отчеты](#отчеты)
  - [Grades](#grades)

## Дополнительные данные

---

### InitRequest

Интерфейс опциональных значений запроса

#### Объект класса содержит:

- `.params: object` - объект параметров запроса (?a=12&b=24)
- Другие значения [см. тут](https://www.npmjs.com/package/node-fetch#options)

---

### Context

Данные, которые могут быть полезны при работе с "Сетевым Городом"

#### Объект класса содержит:

- `.user: object` - данные пользователя
  - `.id: number` - id пользователя
  - `.name: string` - имя пользователя в системе
  - `.classes: array` - массив доступных классов
    - `.id: number` - id класса
    - `.name: string` - название класса
  - `.students: array` - массив доступных учащихся
    - `.id: number` - id учащегося
    - `.name: string` - имя учащегося в системе
- `.year: object` - данные выбранного года
  - `.id: number` - id года
  - `.gId: number` - последнии две цифры года
  - `.name: string` - название года ('2021/2022')
  - `.start: Date` - дата начала года
  - `.end: Date` - дата окончания года
- `.server: object` - данные сервера
  - `.id: string` - id сервера
  - `.timeFormat: string` - формат времени
  - `.dateFormat: string` - формат даты
- `.school: object` - данные школы
  - `.id: number` - id школы
  - `.name: string` - название школы
  - `.fullName: string` - полное название школы
- `.subjects: array` - массив доступных предметов
  - `.id: number` - id предмета
  - `.name: string` - название предмета
- `.checkDate(date: Date): boolean` - является ли дата частью года
- `.classExists(id: number): boolean` - существует ли id класса
- `.defaultClass(): number` - id первого класса
- `.studentExists(id: number): boolean` - существует ли id учащегося
- `.defaultStudent(): number` - id первого учащегося
- `.subjectExists(id: number): boolean` - существует ли id предмета

---

### Session

Класс необходим для удобного хранения данных сеанса/пользователя.

#### Объект класса содержит:

- `.userId: number` - ID пользователя (не путать с id учащегося)
- `.yearId: number` - ID учебного года
- `.schoolId: number` - ID школы
- `.studentsId: number[]` - массив с id учащихся, к которым у пользователя есть доступ (для учащихся они совпадают с`userId`)
- `.expiryDate: number` - время окончания сессии (указано в [Unix Time](https://ru.wikipedia.org/wiki/Unix-%D0%B2%D1%80%D0%B5%D0%BC%D1%8F))
- `.accessToken: string` - токен доступа, отправляется в заголовках, как at
- `.globalYearId: number` - ID года (чаще всего это последние 2 цифры года)
- `.isValid(): boolean` - возвращает `true`, если сессия все еще активна
- `.isExpired(): boolean` - возвращает "true", если сессия больше не активна

---

### Info

Класс необходим для удобной работы с данными пользователя.

#### Объект класса содержит:

- `.email: string` - почта пользователя
- `.phone: string` - телефон пользователя
- `.lastName: string` - фамилия пользователя
- `.firstName: string` - имя пользователя
- `.middleName: string` - отчество пользователя
- `.birthDate: Date` - день рождения пользователя
- `.existsPhoto: boolean` - возвращает `true` если фото установлено
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## Дневник

---

### Diary

Класс необходим для удобной работы с дневником.

#### Объект класса содержит:

- `.days: Day[]` - массив объектов [Day](#day)
- `.termName: string` - название учебного периода (например: _2 полугодие_)
- `.className: string` - название класса (например: _10б_)
- `.start: Date` - дата, с которой начинается дневник
- `.end: Date` - дата последнего дня в дневнике
- `.slice(): Day[]` - возвращает массив объектов [Day](#day). **Принимает объект данных:**
  - `start: Date` - дата, с которой дневник должен быть обрезан
  - `end: Date` - дата, до которой дневник должен быть обрезан
- `.currentLesson(): Lesson` - возвращает объект [Lesson](#lesson). **Принимает дату с учетом времени**
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### Day

Класс необходим для удобной работы с днями в дневнике.

#### Объект класса содержит:

- `.date: Date` - дата этого дня
- `.lessons: Lesson[]` - массив объектов [Lesson](#lesson)
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### Lesson

Класс необходим для удобной работы с уроками в дневнике.

#### Объект класса содержит:

- `.id: number` - ID занятия
- `.start: Date` - дата начала урока
- `.end: Date` - дата окончания урока
- `.subject: string` - название предмета
- `.assignments: Assignment[]` - массив объектов [Assignment](#assignment)
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### Assignment

Класс необходим для удобной работы с заданиями для уроков в дневнике.

#### Объект класса содержит:

- `.id: number` - ID задания
- `.dot: boolean` - возвращает `true`, если урок просрочен (точка в дневнике)
- `.date: Date` - дата сдачи задания
- `.text: string` - текст задания
- `.mark: number | null` - оценка за задание, если таковая имеется
- `.typeId: number` - ID типа задания
- `.comment: string | null` - комментарий учителя, если таковой имеется
- `.lessonId: number` - ID занятия
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## Задания

---

### AssignmentInfo

Класс необходим для удобной работы с доп. информацией о задании.

#### Объект класса содержит:

- `.id: number` - ID задания
- `.date: Date` - дата сдачи задания
- `.text: string` - текст задания
- `.weight: number` - вес оценки
- `.subject: string` - название предмета
- `.teacher: string` - имя учителя
- `.isDeleted: boolean` - хз, за что это отвечает (у меня всегда `true`)
- `.description: string` - описание задания
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### AssignmentType

Класс необходим для удобного хранения типов заданий.

#### Объект класса содержит:

- `.id: number` - ID типа задания
- `.name: string` - название типа задания
- `.abbr: string` - короткое название типа задания
- `.order: number` - какая-то странная вещь (если вы знаете, что это такое, то пишите)
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### AssignmentTypes

Класс необходим для удобной работы с типами задания ([AssignmentType](#assignmenttype)).

#### Объект класса содержит:

- `.types: AssignmentType[]` - массив объектов [AssignmentType](#assignmenttype)
- `.findById(): AssignmentType` - возвращает объект класса [AssignmentType](#assignmenttype). **Принимает id типа задания в качестве аргумента**
- `.findByName(): AssignmentType` - возвращает объект класса [AssignmentType](#assignmenttype). **Принимает название типа задания в качестве аргумента**
- `.findByAbbr(): AssignmentType` - возвращает объект класса [AssignmentType](#assignmenttype). **Принимает аббревиатуру типа задания в качестве аргумента**
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## Расписание

---

### ScheduleDay

Класс необходим для удобной работы с расписанием на день.

#### Объект класса содержит:

- `.raw: string` - HTML код таблицы с расписанием
- `.date: Date` - дата возвращаемого дня
- `.lines: ScheduleDayLine[]` - массив объектов [ScheduleDayLine](#scheduledayline).
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### ScheduleDayLine

Класс необходим для удобной работы с "линиями" расписания.

#### Объект класса содержит:

- `.name: string` - название предмета/мероприятия
- `.className?: string` - название кабинета
- `.start: Date` - время начала предмета/мероприятия.
- `.end: Date` - время окончания предмета/мероприятия.
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### ScheduleWeek

Класс необходим для удобной работы с расписанием на неделю.

#### Объект класса содержит:

- `.raw: string` - HTML код таблицы с расписанием
- `.date: Date` - дата требуемого дня
- `.parsed: ScheduleWeekLine[]` - массив объектов [ScheduleWeekLine](#scheduleweekline).
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

---

### ScheduleWeekLine

Класс необходим для удобной работы с "линиями" расписания.

#### Объект класса содержит:

- `.date: Date` - дата дня.
- `.lessons: object[]` - массив предметов
- `.lessons.names: string[]` - названия предметов
- `.lessons.number: number` - порядковый номер предмета
- `.lessons.classesName: string[]` - названия кабинетов
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## Отчеты

---

### Grades

Класс необходим для удобной работы с отчетом успеваемости (по предмету)

#### Объект класса содержит:

- `.raw: string` - HTML код отчета
- `.range: object` - период отчета
  - `.start: Date` - начало отчета
  - `.end: Date` - окончание отчета
- ​`.teacher​: ​string​` - имя учителя, ведущего урок
- `.averageMark​: ​number​` - средняя оценка
- `.assignments: array` - массив оценок
  - `.type: AssignmentType` - объект класса [AssignmentType](#assignmenttype)
  - `.theme: string` - тема урока (например: 'Чтение произведений 20-го века')
  - `.date: Date` - дата урока
  - `.issueDate: Date` - дата выставления оценки
  - `.mark: number` - полученная оценка
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)
