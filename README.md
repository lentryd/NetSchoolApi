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
  school: "МБОУ ...", // Название школы (полностью) или её id
});

user.diary().then(console.log);
```

## Стоит прочитать

- [Методы](docs/guide.md)
- [Классы](docs/reference.md)
