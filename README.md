# NetSchoolApi

Это враппер для продукта "Сетевой город. Образование". С помощью которого вы можете получить информацию о пользователе (дневник, расписание и т.д.)

## Начало работы

Эти инструкции позволят вам запустить копию проекта на вашем локальном компьютере для целей разработки и тестирования.

### Предварительные условия

Чтобы установить библиотеку, вам необходимо:

- NodeJS ≥ v10.24.1 ([установить](https://nodejs.org/ru/download/))

### Установка

Для установки необходимо ввести команду

```bash
npm i netschoolapi
```

## Проверка установки

1. В корне проекта создайте файл `test.js`
2. В этот файл вставьте код ниже (введя выши данные)

```javascript
const NS = require("./dist").default;
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

3. Запустите этот код введя в консоли команду

```bash
node test.js
```

4. Если в консоли не выводится информация о пользователе, то проверьте версию NodeJS или создайте [issue](https://github.com/lentryd/NetSchoolApi/issues/new)

## Информация о библиотеке

- [Доступные методы](./docs/guide.md)
- [Доступные классы](./docs/reference.md)

## Сделано с помощью

- [ws](https://www.npmjs.com/package/ws) - Клиентская реализация WebSocket
- [node-fetch](https://www.npmjs.com/package/node-fetch) - Fetch API в Node.js
- [node-html-parser](https://www.npmjs.com/package/node-html-parser) - Генерация упрощенного DOM-дерева с поддержкой запросов к элементам.

## Управление версиями

Мы используем [SemVer](http://semver.org/) для управления версиями. Доступные версии см. в разделе [теги](https://github.com/lentryd/NetSchoolApi/tags).

## Авторы

- [lentryd](https://github.com/lentryd)

Смотрите также список [участников](https://github.com/lentryd/NetSchoolApi/contributors), которые участвовали в этом проекте.

## Лицензия

Этот проект лицензирован по лицензии MIT - см. [LICENSE](LICENSE) файл для получения подробной информации
