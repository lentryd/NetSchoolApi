# Пример использования метода `.assignmentTypes()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#assignment)

## Зачем нужен?

Этот метод возвращает массив со всеми типами заданий, которые могут встретиться в сетевом.

## Как использовать?

Для использования этого метода не нужно передавать данные.

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
  const types = await user.assignmentTypes();
  console.log(types.findById(3));
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
  const types = await user.assignmentTypes();
  console.log(types.findById(3));

  // Закрываем сессию
  await user.logOut();
})();
```
