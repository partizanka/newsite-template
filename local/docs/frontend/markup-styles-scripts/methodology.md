
# Методология

Разметка и стилизация верстки осуществляется по методологии **БЭМ**. Файловая структура проекта этой методологии не следует по причине особенностей CMS 1С-Битрикс и практики применения верстки.

Наименования классов соответствуют [getbem.com/naming/](http://getbem.com/naming/):

* Слова в названиях *блоков*, *элементов* и *модификаторов* разделяются одним дефисом: `.block-name`.
* Названия *элементов* отделяются двумя видимыми пробелами: `.block-name__element-name`.
* Названия *модификаторов* отделяются двумя дефисами: `.block-name--modifier-name`, `.block-name__element-name--modifier-name`. Значения модификаторов не используются (являются продолжением названия модификатора).