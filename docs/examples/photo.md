# Пример использования метода `.photo()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#photo)

## Зачем нужен?

Этот метод позволяет получить фото пользователя

## Как использовать?

### Автоматическая авторизация

```typescript
import fs from "fs";
import NS from "netschoolapi";

const user = new NS({
  origin: "https://example.com",
  login: "Иванов",
  password: "123456",
  school: "МБОУ ...", // Название школы (полностью) или её id
});

(async function () {
  // Получаем фото
  const buffer = await user.photo();

  // Сохраняем фото
  fs.writeFileSync("./img.png", buffer);
})();
```

### Ручная авторизация

> Не рекомендуется

```typescript
import fs from "fs";
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

  // Получаем фото
  const buffer = await user.photo();

  // Сохраняем фото
  fs.writeFileSync("./img.png", buffer);

  // Закрываем сессию
  await user.logOut();
})();
```
