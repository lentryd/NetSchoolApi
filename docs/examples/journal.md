# Пример использования метода `.journal()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#journal)

## Зачем нужен?

Этот метод возвращает отчет об успеваемости и успеваемости учащегося.

## Как использовать?

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
  // Получаем отчет
  const result = await user.journal();
  console.log(result.subjects);
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

  // Получаем отчет
  const result = await user.journal();
  console.log(result.subjects);

  // Закрываем сессию
  await user.logOut();
})();
```
