'use strict';

var gulp = require('gulp'),
	less = require('gulp-less'),
	jade = require('gulp-jade'),
	plumber = require('gulp-plumber'),
	del = require('del'),
	run = require('run-sequence'),
	path = require('path'),
	_ = require('lodash'),
	glob = require('glob'),
	es = require('event-stream'),
	filter = require('gulp-filter'),
	html2js = require('gulp-ng-html2js'),
	concat = require('gulp-concat'),
	annotate = require('gulp-ng-annotate');

var files = require('./build-files.js');

var config = {
	sources: {
		index: './src/index.jade',
		jade: './src/app/**/*.jade',
		assets: './src/assets/**/*',
		styles: './src/**/*.less',
		scripts: './src/app/**/*.js'
	},
	paths: {
		src: 'src',
		build: 'build'
	}
};

function src(conf){
	var _files = conf.files.map(function(f){
		return path.join(config.paths.src, f);
	});

	return gulp.src(_files, { base: config.paths.src }).pipe(plumber());
}

function dest(conf, stream) {
	var destPath = path.join(config.paths.build, conf.out || '');
	return stream.pipe(gulp.dest(destPath));
}

function getModuleName(file) {
	var pathParts, index, moduleName;
	pathParts = file.path.split('/');
	index = _.findLastIndex(pathParts, function (item) { return item === 'app';	});
	moduleName = _.join(_.slice(pathParts, index, pathParts.length - 1), '.');

	return moduleName.replace(/_[a-z]/g, function (match) {
		return match.replace('_', '');
	});
}

gulp.task('clean', function () {
	return del(config.paths.build);
});

gulp.task('scripts', function() {
	return es.merge(files.scripts.map(function (conf) {
		return dest(conf, src(conf));
	}));
});

gulp.task('styles', function () {
	return es.merge(files.styles.map(function (conf) {
		var stream = src(conf);

		if (conf.less) {
			stream = stream.pipe(less());
		}

		return dest(conf, stream);
	}));
});

gulp.task('views', function() {
	return gulp.src(config.sources.jade, { base: config.paths.src })
		.pipe(jade())
		.pipe(html2js({
			moduleName: getModuleName
		}))
		.pipe(gulp.dest(config.paths.build))
});

gulp.task('assets', function() {
	return gulp.src(config.sources.assets, { base: config.paths.src })
		.pipe(gulp.dest(config.paths.build))
});

gulp.task('index', function () {
	function extFilter(ext) {
		return function (name) {
			return ext === path.extname(name);
		};
	}

	function listFiles(source) {
		var res = source.map(function (conf) {
			return conf.files.map(function (pattern) {
				pattern = pattern.replace(/\.(less)$/, '.css');

				return glob.sync(pattern, { cwd: config.paths.build });
			});
		});

		return _.uniq(_.flattenDeep(res, true));
	}

	var _scripts = listFiles(files.scripts)
		.filter(extFilter('.js'));

	var _styles = listFiles(files.styles)
		.filter(extFilter('.css'));

	return gulp.src(config.sources.index)
		.pipe(jade({
			pretty: true,
			locals: {
				production: false,
				scripts: _scripts,
				styles: _styles
			}
		}))
		.pipe(gulp.dest(config.paths.build));
});

gulp.task('watch', function () {
	gulp.watch(config.sources.index, ['index']);
	gulp.watch(config.sources.jade, ['views']);
	gulp.watch(config.sources.styles, ['styles']);
	gulp.watch(config.sources.scripts, ['scripts']);
});

gulp.task('build', function(next) {
	return run('clean', ['styles', 'scripts', 'views', 'assets'], 'index', next);
});

gulp.task('live', function(next){
	return run('build', 'watch', next);
});

gulp.task('production-scripts', function() {
	return es.merge(files.scripts.map(function (conf) {
		var stream = src(conf)
			.pipe(concat(conf.concat));
		return dest(conf, stream);
	}));
});

gulp.task('production-styles', function () {
	return es.merge(files.styles.map(function (conf) {
		var stream = src(conf);

		if (conf.less) {
			stream = stream.pipe(less());
		}

		return dest(conf, stream);
	}));
});

gulp.task('production-views', function() {
	return gulp.src(config.sources.jade, { base: config.paths.src })
		.pipe(jade())
		.pipe(html2js({
			moduleName: getModuleName
		}))
		.pipe(gulp.dest(config.paths.build))
});

gulp.task('production-index', function () {
	function extFilter(ext) {
		return function (name) {
			return ext === path.extname(name);
		};
	}

	function listFiles(source) {
		var res = source.map(function (conf) {
			return conf.files.map(function (pattern) {
				pattern = pattern.replace(/\.(less)$/, '.css');

				return glob.sync(pattern, { cwd: config.paths.build });
			});
		});

		return _.uniq(_.flattenDeep(res, true));
	}

	var _scripts = listFiles(files.scripts)
		.filter(extFilter('.js'));

	var _styles = listFiles(files.styles)
		.filter(extFilter('.css'));

	return gulp.src(config.sources.index)
		.pipe(jade({
			pretty: true,
			locals: {
				production: false,
				scripts: _scripts,
				styles: _styles
			}
		}))
		.pipe(gulp.dest(config.paths.build));
});

gulp.task('build-production', function(next) {
	return run('clean', ['production-styles', 'production-scripts', 'production-views', 'assets'], 'index', next);
});
