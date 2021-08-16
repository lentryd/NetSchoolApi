# NetSchoolApi

![npm](https://img.shields.io/npm/v/netschoolapi)
![npm bundle size](https://img.shields.io/bundlephobia/min/netschoolapi)

![npm](https://img.shields.io/npm/dt/netschoolapi)

Это враппер для "Сетевой город. Образование". С помощью которого вы можете получить информацию о пользователе (дневник, расписание и т.д.)

> Эта библиотека никоим образом не связана с компанией "ИРТех"

## Установка

```bash
npm install netschoolapi
```

## Использование

```typescript
import NetSchoolApi from "netschoolapi";

const user = new NetSchoolApi({
  origin: "https://example.com",
  login: "Иванов",
  password: "123456",
  schoolName: "МБОУ ...", // Название школы полностью
});

user
  .diary({
    startDate: new Date("2021-05-12"),
    endDate: new Date("2021-05-19"),
  })
  .then(console.log);
```

> Метод `user.logIn()` и `user.logOut()` вызывать не требуется.

Если вы хотите самостоятельно управлять сеансом пользователя, вам следует импортировать класс `Safe`.

```typescript
import { Safe as NetSchoolApi } from "netschoolapi";

const user = new NetSchoolApi({
  origin: "https://example.com",
  login: "Иванов",
  password: "123456",
  schoolName: "МБОУ ...", // Название школы полностью
});

user
  .logIn()
  .then(() =>
    user.diary({
      startDate: new Date("2021-05-12"),
      endDate: new Date("2021-05-19"),
    })
  )
  .then(console.log)
  .finally(() => user.logOut());
```

## Стоит прочитать

- [Доступные методы](https://github.com/lentryd/netschoolapi/blob/main/docs/guide.md)
