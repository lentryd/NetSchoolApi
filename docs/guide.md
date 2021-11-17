# Методы

- [Управление сессией](#управление-сессией)
  - [.logIn()](#login)
  - [.logOut()](#logout)
  - [.sessionValid()](#sessionvalid)
- [Дневник](#дневник)
  - [.diary()](#diary)
  - [.assignment()](#assignment)
  - [.assignmentTypes()](#assignmenttypes)
- [Расписание](#расписание)
  - [.scheduleDay()](#scheduleday)

## Управление сессией

> По умолчанию эти методы применяются автоматически.
> Они доступны при импорте класса `Safe`.

### .logIn()

---

#### Не принимает аргументы

#### Возвращает объект класса [Session](reference.md#session)

#### [Пример использования](examples/controlSession.md)

### .logOut()

---

#### Не принимает аргументы

#### Возвращает `void` при успешном выходе или ошибку

#### [Пример использования](examples/controlSession.md)

### .sessionValid()

---

#### Не принимает аргументы

#### Возвращает `true` если сессия активна

#### [Пример использования](examples/sessionValid.md)

## Дневник

### .diary()

---

> Период дневника может составлять более 7 дней, главное, чтобы он не выходил за рамки учебного года.

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указывать.
- `start: Date` - Дата, с которой начинается дневник
- `end: Date` - Последний день в дневнике

#### Возвращает объект класса [Diary](reference.md#diary)

#### [Пример использования](examples/diary.md)

### .assignment()

---

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указывать.
- `id: number` - ID задания

#### Возвращает объект класса [AssignmentInfo](reference.md#assignmentinfo)

#### [Пример использования](examples/assignment.md)

### .assignmentTypes()

---

#### Не принимает аргументы

#### Возвращает объект класса [AssignmentTypes](reference.md#assignmenttypes)

#### [Пример использования](examples/assignmentTypes.md)
