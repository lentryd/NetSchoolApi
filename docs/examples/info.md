# Пример использования метода `.info()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#info)

## Зачем нужен?

Этот метод позволяет получить системную информацию о пользователе (например email, телефон и т.д.)

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
  // Получаем информацию
  const result = await user.info();
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

  // Получаем информацию
  const result = await user.info();
  console.log(result);

  // Закрываем сессию
  await user.logOut();
})();
```
