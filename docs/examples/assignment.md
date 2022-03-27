# Пример использования метода `.assignment()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#assignment)

## Зачем нужен?

Этот метод возвращает информацию об оценке. Именно благодаря этому методу можете узнать вес оценки и имя человека, который ее поставил.

## Как использовать?

Для использования этого метода нужно передать `id` оценки (получить его можно при помощи метода [.diary()](../guide.md#diary)). Если у вас есть доступ к нескольким ученикам, то также нужно передать `id` нужного ученика.

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
  // Получаем id оценки
  //....

  // Получаем информацию
  const result = await user.assignment({ id });
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

  // Получаем id оценки
  //....

  // Получаем информацию
  const result = await user.assignment({ id });
  console.log(result);

  // Закрываем сессию
  await user.logOut();
})();
```
