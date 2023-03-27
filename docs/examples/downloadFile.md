# Пример использования метода `.downloadFile()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#downloadfile)

## Зачем нужен?

Этот метод позволяет получить файл из дневника

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
  // Получаем файл
  const buffer = await user.downloadFile({ id: 5863936, assignId: 354142125 });

  // Сохраняем файл
  fs.writeFileSync("./тест.docx", buffer);
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

  // Получаем файл
  const buffer = await user.downloadFile({ id: 5863936, assignId: 354142125 });

  // Сохраняем файл
  fs.writeFileSync("./тест.docx", buffer);

  // Закрываем сессию
  await user.logOut();
})();
```
