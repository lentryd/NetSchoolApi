# Доступные методы | NetSchoolApi

- [Управление сессией](#управление-сессией)
  - [.logIn()](#login)
  - [.logOut()](#logout)
- [Дневник](#дневник)
  - [.diary()](#diary)
  - [.assignment()](#assignment)

## Управление сессией

> По умолчанию эти методы применяются автоматически.
> Они доступны при импорте класса `Safe`

### `.logIn()`

#### Не принимает аргументы

#### Возвращает объект класс [Session](https://github.com/lentryd/netschoolapi/blob/main/docs/reference.md#session)

### `.logOut()`

#### Не принимает аргументы

#### Возвращает `true` при успешном выходе или ошибку

## Дневник

### `.diary()`

> Период дневника может составлять более 7 дней, главное, чтобы он не выходил за рамки учебного года.

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указать.(Добавлено для родителей, имеющих доступ к нескольким учащимся)
- `start: Date` - Дата, с которой начинается дневник
- `end: Date` - Последний день в дневнике

#### Возвращает объект класс [Diary](https://github.com/lentryd/netschoolapi/blob/main/docs/reference.md#diary)

### `.assignment()`

#### Принимает объект данных:

- `studentId?: number` - ID учащегося, можно не указать.(Добавлено для родителей, имеющих доступ к нескольким учащимся)
- `id: number` - ID задания

#### Возвращает объект класс [AssignmentInfo](https://github.com/lentryd/netschoolapi/blob/main/docs/reference.md#AssignmentInfo)
