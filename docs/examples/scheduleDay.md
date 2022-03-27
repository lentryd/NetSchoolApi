# Пример использования метода `.scheduleDay()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#scheduleday)

## Зачем нужен?

Этот метод возвращает расписание на день

## Как использовать?

Для использования этого метода нужно передать дату дня. Если у вас есть доступ к нескольким ученикам, то также нужно передать `id` нужного ученика.

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
  // Получаем расписание
  const schedule = await user.scheduleDay({ date: new Date() });
  console.log(schedule);
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

  // Получаем расписание
  const schedule = await user.scheduleDay({ date: new Date() });
  console.log(schedule);

  // Закрываем сессию
  await user.logOut();
})();
```
