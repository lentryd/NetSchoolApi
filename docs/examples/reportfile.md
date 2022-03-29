# Пример использования метода `.reportFile()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#reportfile)

## Зачем нужен?

Этот метод возвращает отчеты

## Как использовать?

Вообще этот метод создан для более удобной работа с другими методами, которые возвращают отчеты. Однако если вы можете сделать это напрямую.

### Автоматическая авторизация

```typescript
import NS from "netschoolapi";

const user = new NS({
  origin: "https://example.com",
  login: "Иванов",
  password: "123456",
  school: "МБОУ ...", // Название школы (полностью) или её id
});

(async function () {
  // Получаем "Отчет об успеваемости и посещаемости ученика"
  const result = await user.reportFile({
    url: "reports/studenttotal/queue",
    filters: [
      {
        filterId: "SID",
        filterValue: "323259", // ID ученика
      },
      {
        filterId: "PCLID",
        filterValue: "3041290", // ID класса
      },
      {
        filterId: "period",
        filterValue: "2022-01-10T00:00:00 - 2022-05-24T00:00:00",
      },
    ],
  });
  console.log(result);
})();
```

### Ручная авторизация

> Не рекомендуется

```typescript
import { Safe as NS } from "netschoolapi";

const user = new NS({
  origin: "https://example.com",
  login: "Иванов",
  password: "123456",
  school: "МБОУ ...", // Название школы (полностью) или её id
});

(async function () {
  // Открываем сессию
  await user.logIn();

  // Получаем "Отчет об успеваемости и посещаемости ученика"
  const result = await user.reportFile({
    url: "reports/studenttotal/queue",
    filters: [
      {
        filterId: "SID",
        filterValue: "323259", // ID ученика
      },
      {
        filterId: "PCLID",
        filterValue: "3041290", // ID класса
      },
      {
        filterId: "period",
        filterValue: "2022-01-10T00:00:00 - 2022-05-24T00:00:00",
      },
    ],
  });
  console.log(result);

  // Закрываем сессию
  await user.logOut();
})();
```
