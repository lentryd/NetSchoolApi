# Пример использования значения `.contextAsync`

- [Зачем нужен?](#зачем-нужен)
- [Как использовать?](#как-использовать)
- [Назад к методам](../guide.md#contextasync)

## Зачем нужен?

Это значение позволяет получить доступ к [контексту](../reference.md#context) без предварительной авторизации.

## Как использовать?

> Не работает при импорте класса `Safe`

Представим, что мы хотим получить оценки первого предмета из доступных и чтобы не вызывать авторизацию, мы можем воспользоваться этим значением.

```typescript
import NS from "netschoolapi";

const user = new NS({
  origin: "https://example.com",
  login: "Иванов",
  password: "123456",
  school: "МБОУ ...", // Название школы (полностью) или её id
});

(async function () {
  // Получаем массив предметов
  const { subjects } = await user.contextAsync;

  // Получаем отчет "Отчет об успеваемости ученика"
  const report = await user.grades({ subjectId: subjects[0].id });
  console.log(report);
})();
```

Без этого значения код выглядел бы следующим образом:

```typescript
import NS from "netschoolapi";

const user = new NS({
  origin: "https://example.com",
  login: "Иванов",
  password: "123456",
  school: "МБОУ ...", // Название школы (полностью) или её id
});

(async function () {
  // Авторизуемся
  await user.logIn();

  // Получаем массив предметов
  const { subjects } = await user.context;

  // Получаем отчет "Отчет об успеваемости ученика"
  const report = await user.grades({ subjectId: subjects[0].id });
  console.log(report);
})();
```
