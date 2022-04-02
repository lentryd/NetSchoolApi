# Пример использования метода `.grades()`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#grades)

## Зачем нужен?

Этот метод возвращает отчет об успеваемости по выбранному предмету.

## Как использовать?

Для использования этот метода необходимо передать id предмета (вся информация о доступных предметах есть в классе [Context](../reference.md#context))

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
  const result = await user.grades({ subjectId: 7960494 });
  console.log(result.assignments);
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
  const result = await user.grades({ subjectId: 7960494 });
  console.log(result.assignments);

  // Закрываем сессию
  await user.logOut();
})();
```
