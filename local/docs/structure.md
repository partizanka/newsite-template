# Структура проекта

Корневая директория репозитория совпадает с корневой директорией сервера.

## Файлы и папки

```
local
|---assets
	|---dist
	|	|---fixtures
	|	|	|---<fixture-name>.json
	|	|---icons
	|	|	|---<sprite-name>.svg
	|	|---markup
	|	|	|---<page-name>.html
	|	|---styles
	|	|	|---styles.build.css
	|	|---scripts
	|		|---scripts.build.js
	|---favicons
	|---fonts
	|	|---<font-name>
	|		|---*.woff
	|		|---*.woff2
	|---images
	|	|---<images-group>
	|---source
		|---components
		|	|---helpers
		|	|	|---<component-name>.vue
		|	|---mixins
		|	|	|---<mixin-name>.vue
		|	|---<component-name>.vue
		|---fixtures
		|	|---<fixture-name>.json
		|---icons
		|	|---<sprite-name>
		|		|---*.svg
		|		|---*.custom.svg
		|---markup
		|	|---include
		|	|	|---*.pug
		|	|---mixins
		|	|	|---*.pug
		|	|---templates
		|	|	|---*.pug
		|	|---<page-name>.pug
		|---styles
		|	|---blocks
		|	|	|---<block-name>.scss
		|	|---common
		|	|	|---*.scss
		|	|---main.scss
		|---scripts
			|---controller
			|	|---modules
			|	|---controller.js
			|---model
			|	|---modules
			|	|---model.js
			|---view
			|	|---modules
			|	|---view.js
			|---breakpoints.js
			|---comopnents.js
			|---index.js
```

Front-end проекта находится в папке `/local/assets/`.

* `dist/` -- скомпилированная сборка проекта, должна быть включена в `.gitignore`.
	* `fixtures/`
		* `*.json` -- файлы с данными для работы Vue-компонентов на верстке
	* `icons/`
		* `*.svg` -- собранные SVG-спрайты.
	* `markup/`
		* `index.html` содержит список ссылок на страницы.
		* `*.html` -- собранные HTML-страницы верстки.
	* `styles/`
		* `styles.build.css` -- собранные стили.
	* `scripts/`
		* `scripts.build.js` -- собранные скрипты.
* `favicons/`
	* `*.*` -- файлы favicon во всех современных форматах.
* `fonts/`
	* `<font-name>/` -- папка для каждого семейства шрифтов (файлы с различным весом и начертанием -- в одной папке)
		* `*.*` -- файлы шрифтов
* `images/` -- файлы изображений, используемые при верстке.
	* `<images-group>/` -- группа изображений по назначению (products, banners, articles и т.д.)
* `source/` -- исходный код проекта.
 	* `components/`
	 	* `helpers/`
	 		* `<component-name>.vue` -- файлы вспомогательных Vue-компонентов.
	 	* `mixins/`
	 		* `<mixin-name>.vue` -- файлы миксинов.
	 	* `<component-name>.vue` -- файлы Vue-компонентов.
	* `fixtures/`
		* `*.json` -- файлы с данными для работы Vue-компонентов на верстке
	* `icons/`
		* `<sprite-name>/` -- SVG-иконки для сборки в спрайты. На каждую папку создается одноименный спрайт
			* `*.svg` -- SVG-иконки для сборки в спрайты
			* `*.custom.svg` -- SVG-иконки для сборки в спрайты, которые не должны предварительно обрабатываться
	* `markup/`
		* `include/` -- повторяющиеся включаемые части страниц.
		* `mixins/` -- миксины.
		* `templates/` -- шаблоны страниц.
		* `index.pug` -- список ссылок на страницы.
		* `<page-name>.pug` -- файлы верстки страниц.
	* `styles/`
		* `blocks/` -- файлы стилей для каждого БЭМ-блока. Название файла должно совпадать с названием блока.
		* `common/` -- файлы стилей базовых элементов, переменных, миксинов и т. д.
		* `main.scss` -- главный файл стилей, являющийся точкой входа для сборки. Содержит импорты всех остальных файлов стилей.
	* `scripts/`
		* `controller/`
			* `controller.js` -- Vue instance, содержащий методы для управления открытием/закрытием/вызовом разных состояний представления (открыть/закрыть модальное окно, меню) а также проверку на мобильное устройство.
		* `model/`
			* `modules/` -- модули для хранилища (Vuex)
			* `model.js` -- глобальное хранилище состояния приложения (Vuex)
		* `view/`
			* `modules/` -- файлы с инициализацией функциональности, которые представляют собой простой JavaScript
			* `view.js` -- импорт функциональности
		* `breakpoints.js` -- файл, содержащий массив разрешений экрана - breakpoint'ов, совпадающих с breakpoint'ами CSS.
		* `components.js` -- файл, содержащий импорты всех Vue-компонентов и их глобальное объявление.
		* `index.js` -- главный файл скриптов, являющийся точкой входа для сборки. Содержит импорты всех остальных файлов скриптов.