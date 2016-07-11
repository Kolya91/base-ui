'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
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
	newer = require('gulp-newer');

var files = require('./build-files.js');

var paths = {
	src: 'src',
	build: 'build'
};

function toArray(a) {
	if(undefined === a) {
		return [];
	}

	return Array.isArray(a) ? a : [a];
}

function src(conf, production){
	var _ignore = filter(function(file){
		return '_' !== path.basename(file.path).charAt(0);
	});

	var _src = paths.src;
	var _files = toArray(conf.files).map(function (f) {
		if(Array.isArray(f)) {
			f = f[production ? 1 : 0];
		}
		return path.join(_src, f);
	});

	return gulp.src(_files, {
		base: path.join(_src, conf.base || '')
	}).pipe(_ignore);
}

function destPath(conf) {
	return path.join(paths.build, conf.out || '');
}

function dest(conf, stream) {
	return stream.pipe(gulp.dest(destPath(conf)));
}

gulp.task('clean', function () {
	return del(paths.build);
});

gulp.task('less', function () {
	return gulp.src('./src/app/app.less')
		.pipe(less())
		.pipe(gulp.dest('./build/app'));
});

gulp.task('styles', function () {
	return es.merge(files.styles.map(function (conf) {

		var stream = src(conf)
			.pipe(plumber());

		if(conf.less) {
			stream = stream.pipe(less());
		}

		return dest(conf, stream);
	}));
});

gulp.task('views', function() {
	return gulp.src('./src/app/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('./build/app'))
});

gulp.task('assets', function() {
	return gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('./build/assets'))
});

gulp.task('scripts', function() {
	return es.merge(files.scripts.map(function (conf) {
		var stream = src(conf)
			.pipe(plumber())
			.pipe(gulp.dest(paths.build));
		return dest(conf, stream);
	}));
});

gulp.task('index', function () {
	function extFilter(ext) {
		return function (name) {
			return ext === path.extname(name);
		};
	}

	function skipFilter(name){
		return '_' !== path.basename(name).charAt(0);
	}

	function listFiles(source) {
		var res = source.map(function (conf) {
			return toArray(conf.files).map(function (pattern) {
				if(Array.isArray(pattern)) {
					pattern = pattern[0];
				}
				return glob.sync(pattern, {cwd: paths.src});
			});
		});

		return _.uniq(_.flattenDeep(res, true));
	}


	var _scripts = listFiles(files.scripts)
		.filter(extFilter('.js'))
		.filter(skipFilter);

	var _styles = listFiles(files.styles)
		.map(function(name){
			return name.replace(/\.(less)$/, '.css');
		})
		.filter(extFilter('.css'))
		.filter(skipFilter);

	return gulp.src('src/index.jade')
		.pipe(jade({
			pretty: true,
			locals: {
				production: false,
				scripts: _scripts,
				styles: _styles
			}
		}))
		.pipe(gulp.dest(paths.build));
});

gulp.task('watch', function () {
	gulp.watch('./src/*.jade', ['index']);
	gulp.watch('./src/app/**/*.jade', ['views']);
	gulp.watch('./src/**/*.less', ['less']);
	gulp.watch('./src/app/**/*.js', ['scripts']);
});

gulp.task('build-develop', function(next) {
	//run('clean', next);
	return run('clean', ['less', 'styles', 'scripts', 'index', 'views', 'assets'], next);
});

gulp.task('build', function(next){
	return run('build-develop', next);
});

gulp.task('live', function(next){
	return run('build', 'watch', next);
});
