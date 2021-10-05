Это враппер для "Сетевой город. Образование". С помощью которого вы можете получить информацию о пользователе (дневник, расписание и т.д.)

> Эта библиотека никоим образом не связана с компанией "ИРТех"

## Установка

```bash
npm i netschoolapi
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

## Стоит прочитать

- [Доступные методы](docs/guide.md)
- [Доступные классы](docs/reference.md)
