# NetSchoolApi - Враппер для продукта "Сетевой город. Образование"

NetSchoolApi - это враппер для продукта "Сетевой город. Образование", предоставляющий доступ к информации о пользователе, такой как дневник, расписание и другие данные.

## Начало работы

Следующие инструкции помогут вам запустить проект на вашем локальном компьютере для разработки и тестирования.

### Предварительные условия

Перед установкой и использованием этой библиотеки убедитесь, что у вас установлены следующие компоненты:

- [Node.js](https://nodejs.org/) версии 10.24.1 или выше

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

4. Если в консоли не выводится информация о пользователе, убедитесь, что у вас установлена подходящая версия NodeJS, либо создайте [issue](https://github.com/lentryd/NetSchoolApi/issues/new?assignees=lentryd&labels=bug&projects=&template=%D0%BE%D1%82%D1%87%D0%B5%D1%82-%D0%BE%D0%B1-%D0%BE%D1%88%D0%B8%D0%B1%D0%BA%D0%B5--bug-report-.md) на GitHub.

## Дополнительная информация о библиотеке

- [Доступные методы](./docs/guide.md)
- [Доступные классы](./docs/reference.md)

## Зависимости

Для работы этой библиотеки используются следующие зависимости:

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

## Помощь/Общение

Для получения помощи и общения присоединяйтесь к [Telegram-чату](https://t.me/netschoolapi)
