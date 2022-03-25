# Классы | NetSchoolApi

- [Session](#session)
- [Info](#info)
- [Diary](#diary)
- [Day](#day)
- [Lesson](#lesson)
- [Assignment](#assignment)
- [AssignmentInfo](#assignmentinfo)
- [AssignmentType](#assignmenttype)
- [AssignmentTypes](#assignmenttypes)
- [ScheduleDay](#scheduleday)
- [ScheduleDayLine](#scheduledayline)

## Session

Класс необходим для удобного хранения данных сеанса/пользователя.

### Объект класса содержит:

- `.userId: number` - ID пользователя (не путать с id учащегося)
- `.yearId: number` - ID учебного года
- `.schoolId: number` - ID школы
- `.studentsId: number[]` - массив с id учащихся, к которым у пользователя есть доступ (для учащихся они совпадают с`userId`)
- `.expiryDate: number` - время окончания сессии (указано в [Unix Time](https://ru.wikipedia.org/wiki/Unix-%D0%B2%D1%80%D0%B5%D0%BC%D1%8F))
- `.accessToken: string` - токен доступа, отправляется в заголовках, как at
- `.globalYearId: number` - ID года (чаще всего это последние 2 цифры года)
- `.isValid(): boolean` - возвращает `true`, если сессия все еще активна
- `.isExpired(): boolean` - возвращает "true", если сессия больше не активна

## Info

Класс необходим для удобной работы с данными пользователя.

### Объект класса содержит:

- `.email: string` - почта пользователя
- `.phone: string` - телефон пользователя
- `.lastName: string` - фамилия пользователя
- `.firstName: string` - имя пользователя
- `.middleName: string` - отчество пользователя
- `.birthDate: Date` - день рождения пользователя
- `.existsPhoto: boolean` - возвращает `true` если фото установлено
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## Diary

Класс необходим для удобной работы с дневником.

### Объект класса содержит:

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

## Day

Класс необходим для удобной работы с днями в дневнике.

### Объект класса содержит:

- `.date: Date` - дата этого дня
- `.lessons: Lesson[]` - массив объектов [Lesson](#lesson)
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## Lesson

Класс необходим для удобной работы с уроками в дневнике.

### Объект класса содержит:

- `.id: number` - ID занятия
- `.start: Date` - дата начала урока
- `.end: Date` - дата окончания урока
- `.subject: string` - название предмета
- `.assignments: Assignment[]` - массив объектов [Assignment](#assignment)
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## Assignment

Класс необходим для удобной работы с заданиями для уроков в дневнике.

### Объект класса содержит:

- `.id: number` - ID задания
- `.dot: boolean` - возвращает `true`, если урок просрочен (точка в дневнике)
- `.date: Date` - дата сдачи задания
- `.text: string` - текст задания
- `.mark: number | null` - оценка за задание, если таковая имеется
- `.typeId: number` - ID типа задания
- `.comment: string | null` - комментарий учителя, если таковой имеется
- `.lessonId: number` - ID занятия
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## AssignmentInfo

Класс необходим для удобной работы с доп. информацией о задании.

### Объект класса содержит:

- `.id: number` - ID задания
- `.date: Date` - дата сдачи задания
- `.text: string` - текст задания
- `.weight: number` - вес оценки
- `.subject: string` - название предмета
- `.teacher: string` - имя учителя
- `.isDeleted: boolean` - хз, за что это отвечает (у меня всегда `true`)
- `.description: string` - описание задания
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## AssignmentType

Класс необходим для удобного хранения типов заданий.

### Объект класса содержит:

- `.id: number` - ID типа задания
- `.name: string` - название типа задания
- `.abbr: string` - короткое название типа задания
- `.order: number` - какая-то странная вещь (если вы знаете, что это такое, то пишите)
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## AssignmentTypes

Класс необходим для удобной работы с типами задания ([AssignmentType](#assignmenttype)).

### Объект класса содержит:

- `.types: AssignmentType[]` - массив объектов [AssignmentType](#assignmenttype)
- `.findById(): AssignmentType` - возвращает объект класса [AssignmentType](#assignmenttype). **Принимает id типа задания в качестве аргумента**
- `.findByAbbr(): AssignmentType` - возвращает объект класса [AssignmentType](#assignmenttype). **Принимает abbr типа задания в качестве аргумента**
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## ScheduleDay

Класс необходим для удобной работы с расписанием на день.

### Объект класса содержит:

- `.date: Date` - дата возвращаемого дня
- `.lines: ScheduleDayLine[]` - массив объектов [ScheduleDayLine](#scheduledayline).
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)

## ScheduleDayLine

Класс необходим для удобной работы с "линиями" расписания.

### Объект класса содержит:

- `.name: string` - название предмета/мероприятия
- `.className?: string` - название кабинета
- `.start: Date` - время начала предмета/мероприятия.
- `.end: Date` - время окончания предмета/мероприятия.
- `.toJSON(): object` - возвращает объект класса (нужно для нормальной работы `JSON.stringify()`)
