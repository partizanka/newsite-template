# template

The most complete boilerplate for production-ready PWAs. With focus on performance, development speed, and best practices.

## Features
* [Gulp](https://gulpjs.com) as a build system
* [Rollup](https://rollupjs.org) JavaScript module bundler
* [Vue](https://vuejs.org) framework
* [Vuex](https://vuex.vuejs.org) state management pattern
* [Pug](https://pugjs.org) template engine
* SVG sprite generation optimized by [SVGO](https://github.com/svg/svgo)
* [SCSS](http://sass-lang.com) preprocessor for CSS
* Extended browser support with [Autoprefixer](https://github.com/postcss/autoprefixer) and [Babel](https://babeljs.io/) based on [browserlist](https://github.com/browserslist/browserslist) config in `package.json`
* CSS linting with [Stylelint](http://stylelint.io)
* JavaScript linting with [Eslint](https://eslint.org)
* [NPM](https://www.npmjs.com/) package manager

## Usage
* Clone or download this repo
* Run `npm install` to fetch all the dependencies
* Run `npm run dev` to make development build
    * Use `watch` flag to keep watching source changes
    * Use `serve` flag to start browsersync server (`localhost:3000`)
    * Use `minimize` flag to enable production level optimizations
* Run `npm run prod` to make production build. Mostly used on production server

To pass flags to npm run command list them after `--` like this:
```
npm run dev -- serve watch
```


## Browser support
Because of update to Vue 3 in version 2.0 we can't support Internet Explorer 11. Also Safari version 10+ is required.

## Read more
[Full documentation](local/docs/index.md)