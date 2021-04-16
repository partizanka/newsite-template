const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const rollup = require('@rollup/stream');
const rollupResolve = require('@rollup/plugin-node-resolve').nodeResolve;
const rollupReplace = require('@rollup/plugin-replace');
const rollupAlias = require('@rollup/plugin-alias');
const rollupVue = require('rollup-plugin-vue');
const rollupBabel = require('@rollup/plugin-babel').babel;
const rollupTerser = require('rollup-plugin-terser').terser;
const rollupGlobImport = require('rollup-plugin-glob-import');
const rollupPaths = require('rollup-plugin-includepaths');
const rollupCommonjs = require('@rollup/plugin-commonjs');
const postCSS = require('gulp-postcss');
const postCSSautoprefixer = require('autoprefixer');
const stylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const changed = require('gulp-changed');
const rename = require('gulp-rename');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const filter = require('gulp-filter');
const minimist = require('minimist');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const svgSymbols = require('gulp-svg-symbols');
const svgMin = require('gulp-svgmin');

const sassGlob = require('gulp-sass-glob');
const sass = require('gulp-sass');
sass.compiler = require('sass');
const backstop = require('backstopjs');

let OPTIONS = minimist(process.argv.slice(2), {
	boolean: true,
	default: {
		// dev options
		serve: false,
		minify: false,
		watch: false,
		lint: true,

		// backstop options
		init: false,
		reference: false,
		test: false,
		approve: false
	}
});

const PATHS = {
	styles: {
		src: 'local/assets/source/styles/main.scss',
		watch: 'local/assets/source/styles/**/*.scss',
		lint: 'local/assets/source/styles/**/*.scss',
		dest: 'local/assets/dist/styles/'
	},
	scripts: {
		src: 'local/assets/source/scripts/index.js',
		watch: [
			'local/assets/source/scripts/**/*.js',
			'local/assets/source/components/**/*.vue'
		],
		lint: [
			'local/assets/source/scripts/index.js',
			'local/assets/source/scripts/**/*.js',
			'local/assets/source/components/**/*.vue'
		],
		dest: 'local/assets/dist/scripts/'
	},
	icons: {
		src: 'local/assets/source/icons/',
		watch: 'local/assets/source/icons/**/*.svg',
		dest: 'local/assets/dist/icons/'
	},
	pages: {
		src: 'local/assets/source/markup/*.pug',
		watch: 'local/assets/source/markup/**/*.pug',
		dest: 'local/assets/dist/markup/'
	},
	fixtures: {
		src: 'local/assets/source/fixtures/*.json',
		watch: 'local/assets/source/fixtures/*.json',
		dest: 'local/assets/dist/fixtures/'
	}
};

const BACKSTOP_CONFIG = {
	'id': 'backstop_default',
	'viewports': [
		{
			'label': 'tablet',
			'width': 1024,
			'height': 768
		},
		{
			'label': 'phone',
			'width': 320,
			'height': 480
		}
	],
	'paths': {
		'bitmaps_reference': 'backstop_data/bitmaps_reference',
		'bitmaps_test': 'backstop_data/bitmaps_test',
		'engine_scripts': 'backstop_data/engine_scripts',
		'html_report': 'backstop_data/html_report',
		'ci_report': 'backstop_data/ci_report'
	},
	'report': ['browser'],
	'engine': 'puppeteer',
	'engineOptions': {
		'args': ['--no-sandbox']
	},
	'asyncCaptureLimit': 5,
	'asyncCompareLimit': 50,
	'debug': false,
	'debugWindow': false,
	'scenarios': []
};

const TEMPLATE_SCENARIOS = {
	'label': '',
	'cookiePath': 'backstop_data/engine_scripts/cookies.json',
	'url': '',
	'referenceUrl': '',
	'readyEvent': '',
	'readySelector': '',
	'delay': 0,
	'hideSelectors': [],
	'removeSelectors': [],
	'hoverSelector': '',
	'clickSelector': '',
	'postInteractionWait': 0,
	'selectors': [],
	'selectorExpansion': true,
	'expect': 0,
	'misMatchThreshold' : 0.1,
	'requireSameDimensions': true
};

gulp.task('lintStyles', () => {
	return gulp.src(PATHS.styles.lint)
		.pipe(plumber())
		.pipe(stylelint({
			reporters: [
				{
					formatter: 'string',
					console: true
				}
			]
		}));
});

gulp.task('lintScripts', () => {
	return gulp.src(PATHS.scripts.lint)
		.pipe(plumber())
		.pipe(eslint())
		.pipe(plumber())
		.pipe(eslint.format());
});

gulp.task('compileStyles', () => {
	return gulp.src(PATHS.styles.src)
		.pipe(plumber())
		.pipe(sassGlob())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(postCSS([
			postCSSautoprefixer
		]))
		.pipe(rename('styles.build.css'))
		//.pipe(gulp.dest(PATHS.styles.dest))
		.pipe(gulpIf(OPTIONS.minify, cleanCSS()))
		.pipe(gulp.dest(PATHS.styles.dest))
		.pipe(browserSync.stream());
});

gulp.task('compileScripts', () => {
	return rollup({
		input: PATHS.scripts.src,
		plugins: [
			rollupPaths({
				paths: ['local/assets/source/'],
				extensions: ['.js', '.json', '.vue']
			}),
			rollupAlias({
				entries: {
					'vue': require.resolve('vue/dist/vue.esm-bundler')
				}
			}),
			rollupResolve({
				browser: true
			}),
			rollupReplace({
				'process.env.NODE_ENV': JSON.stringify(OPTIONS.minify ? 'production' : 'development'),
				__VUE_OPTIONS_API__: JSON.stringify(true),
				__VUE_PROD_DEVTOOLS__: JSON.stringify(false)
			}),
			rollupGlobImport(),
			rollupCommonjs(),
			rollupVue(),
			...OPTIONS.minify ? [
				rollupBabel({
					babelHelpers: 'bundled',
					presets: [
						[
							'@babel/preset-env',
							{
								useBuiltIns: 'entry',
								corejs: {version: 3}
							}
						]
					]
				}),
				rollupTerser()
			] : []
		],
		output: {
			format: 'iife'
		}
	})
	.pipe(source('scripts.build.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(PATHS.scripts.dest))
	.pipe(browserSync.stream({once: true}));
});

gulp.task('buildStyles',
	gulp.series(
		...OPTIONS.lint ? ['lintStyles'] : [],
		'compileStyles'
	)
);

gulp.task('buildScripts',
	gulp.series(
		...OPTIONS.lint ? ['lintScripts'] : [],
		'compileScripts'
	)
);

gulp.task('buildImages', (cb) => {
	// get icons subdir list
	const dirs = fs.readdirSync(PATHS.icons.src).filter((file) => fs.statSync(path.join(PATHS.icons.src, file)).isDirectory());

	// make svg sprite for each directory (<dirname>.svg)
	// reduce is used to make single pipe chain
	return dirs.reduce((gulp, dir) => {
		// filter is used to prevent customized svg files from being optimized with svgmin
		let iconsFilter = filter(['**/*.svg', '!**/*.custom.svg'], {restore: true});
		return gulp.src(PATHS.icons.src + dir + '**/*.svg')
			.pipe(plumber())
			.pipe(iconsFilter)
			.pipe(svgMin({
				plugins: [
					{
						inlineStyles: {}
					},
					{
						convertColors: {
							currentColor: true,
							names2hex: true,
							rgb2hex: true,
							shorthex: true,
							shortname: true
						}
					},
					{
						convertStyleToAttrs: {}
					},
					{
						removeDimensions: {}
					}
				]
			}))
			.pipe(iconsFilter.restore)
			.pipe(svgSymbols({
				svgAttrs: {
					class: 'svg-sprite'
				},
				templates: ['default-svg'],
				transformData(svg, defaultData, options) {
					return {
						id: 'svg-icon-'+defaultData.id.replace('-custom', ''),
						class: null
					};
				}
			}))
			.pipe(rename(dir + '.svg'))
			.pipe(gulp.dest(PATHS.icons.dest));
	}, gulp);
});

gulp.task('buildPages', function() {
	return gulp.src(PATHS.pages.src)
		.pipe(plumber())
		.pipe(changed(PATHS.pages.dest))
		.pipe(pug({
			pretty: '\t',
			basedir: 'local/assets/source/markup/'
		}))
		.pipe(gulp.dest(PATHS.pages.dest))
		.pipe(browserSync.stream({once: true}));
});

gulp.task('buildFixtures', function() {
	return gulp.src(PATHS.fixtures.src)
		.pipe(plumber())
		.pipe(changed(PATHS.fixtures.dest))
		.pipe(gulp.dest(PATHS.fixtures.dest));
});

gulp.task('browserSyncReload', () => {
	browserSync.reload();
});

gulp.task('clean', () => {
	return del([
		'local/assets/dist/*'
	]);
});

gulp.task('backstop:init', (done) => {
	function clone(obj) {
		if (null == obj || 'object' != typeof obj) {
			return obj;
		}
		let copy = obj.constructor();
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = obj[attr];
			}
		}
		return copy;
	}

	let config = clone(BACKSTOP_CONFIG);
	let scenarios = [];
	const files = fs.readdirSync(PATHS.pages.dest);
	for (let i = 0; i < files.length ; i++) {
		let scenario = clone(TEMPLATE_SCENARIOS);
		scenario.label = files[i];
		scenario.url = 'http://localhost:3000/' + PATHS.pages.dest + files[i];
		scenarios[i] = scenario;
	}
	config.scenarios = scenarios;
	fs.writeFileSync('backstop.json', JSON.stringify(config));
	done();
});

gulp.task('backstop:reference', () => {
	return backstop('reference', {
		config: 'backstop.json'
	});
});

gulp.task('backstop:test', () => {
	return backstop('test', {
		config: 'backstop.json'
	});
});

gulp.task('backstop:approve', () => {
	return backstop('approve', {
		config: 'backstop.json'
	});
});

gulp.task('backstop', (done) => {
	if(OPTIONS.init) {
		return gulp.series('backstop:init')(done);
	} else if(OPTIONS.reference) {
		return gulp.series('backstop:reference')(done);
	} else if(OPTIONS.test) {
		return gulp.series('backstop:test')(done);
	} else if(OPTIONS.approve) {
		return gulp.series('backstop:approve')(done);
	} else {
		console.warn('Warning: backstop requires more arguments');
		done();
	}
});

gulp.task('build',
	gulp.series(
		'clean',
		'buildImages',
		'buildStyles',
		'buildScripts',
		'buildPages',
		'buildFixtures'
	)
);

gulp.task('watch', () => {
	gulp.watch(PATHS.styles.watch, gulp.series(['buildStyles']));
	gulp.watch(PATHS.scripts.watch, gulp.series(['buildScripts']));
	gulp.watch(PATHS.icons.watch, gulp.series(['buildImages', 'buildPages']));
	gulp.watch(PATHS.pages.watch, gulp.series(['buildPages']));
	gulp.watch(PATHS.fixtures.watch, gulp.series(['buildFixtures']));
	gulp.watch([PATHS.pages.dest, PATHS.scripts.dest]).on('change', browserSync.reload);
});

gulp.task('serve', () => {
	browserSync.init({
		server: {
			baseDir: './',
			middleware: (req, res, next) => {
				if (/\.json|\.txt|\.html/.test(req.url) && req.method.toUpperCase() == 'POST') {
					req.method = 'GET';
				}
				next();
			}
		},
		open: false,
		watchOptions: {
			awaitWriteFinish : true
		}
	});
});

gulp.task('dev', (done) => {
	if (OPTIONS.serve && OPTIONS.watch) {
		return gulp.series('build', gulp.parallel('serve', 'watch'))(done);
	} else if (OPTIONS.serve || OPTIONS.watch) {
		return gulp.series('build', OPTIONS.serve ? 'serve' : 'watch')(done);
	} else {
		return gulp.series('build')(done);
	}
});

gulp.task('prod', (done) => {
	OPTIONS = {
		minify: true,
		serve: false,
		watch: false,
		lint: false
	};

	return gulp.series('build')(done);
});