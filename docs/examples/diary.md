# Пример использования метода `.diary()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#diary)

## Зачем нужен?

Этот метод возвращает дневник (предметы, оценки, дз и т.д.)

## Как использовать?

Для использования этого метода нужно передать промежуток (начало и конец недели). Если у вас есть доступ к нескольким ученикам, то также нужно передать `id` нужного ученика.

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
  // Получаем дневник
  const diary = await user.diary();
  console.log(diary.days[0].lessons[2]);
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

  // Получаем дневник
  const diary = await user.diary();
  console.log(diary.days[0].lessons[2]);

  // Закрываем сессию
  await user.logOut();
})();
```
