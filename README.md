# NetSchoolApi

Это враппер для продукта "Сетевой город. Образование", который позволяет получать информацию о пользователе, такую как дневник, расписание и многое другое.

## Начало работы

Следующие инструкции помогут вам запустить проект на вашем локальном компьютере для разработки и тестирования.

### Предварительные условия

Для установки и использования этой библиотеки вам понадобятся:

- NodeJS ≥ v10.24.1 ([установить](https://nodejs.org/ru/download/))

### Установка

Вы можете установить библиотеку с помощью следующей команды:

```bash
npm i netschoolapi
```

## Проверка установки

1. Создайте файл `test.js` в корне проекта.
2. Вставьте следующий код в файл `test.js`, заменив данные на ваши:

```javascript
const NS = require("netschoolapi").default;
const user = new NS({
  origin: "https://example.com/", // Origin вашего сайта
  login: "Иванов", // Ваш логин
  password: "******", // Ваш пароль
  school: "МБОУ ....", // Название вашей школы (как на сайте)
});

(async function () {
  const info = await user.info();
  console.log(info);
})();
```

3. Запустите этот код в консоли с помощью следующей команды:

```bash
node test.js
```

4. Если в консоли не выводится информация о пользователе, убедитесь, что у вас установлена подходящая версия NodeJS, либо создайте [issue](https://github.com/lentryd/NetSchoolApi/issues/new) на GitHub.

## Дополнительная информация о библиотеке

- [Доступные методы](./docs/guide.md)
- [Доступные классы](./docs/reference.md)

## Зависимости

- [ws](https://www.npmjs.com/package/ws) - Клиентская реализация WebSocket
- [node-fetch](https://www.npmjs.com/package/node-fetch) - Fetch API в Node.js
- [node-html-parser](https://www.npmjs.com/package/node-html-parser) - Генерация упрощенного DOM-дерева с поддержкой запросов к элементам.

## Управление версиями

Версии этой библиотеки управляются согласно [SemVer](http://semver.org/). Список доступных версий можно найти в разделе [теги](https://github.com/lentryd/NetSchoolApi/tags).

## Авторы

- [lentryd](https://github.com/lentryd)

Также посмотрите список [участников](https://github.com/lentryd/NetSchoolApi/contributors), которые внесли свой вклад в проект.

## Лицензия

Этот проект распространяется под лицензией MIT. Подробную информацию смотрите в файле [LICENSE](LICENSE).
