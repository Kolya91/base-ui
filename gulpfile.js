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
	filter = require('gulp-filter');

var files = require('./build-files.js');

var paths = {
	src: 'src',
	build: 'build'
};

function destPath(conf) {
	return path.join(paths.build, conf.out || '');
}

function dest(conf, stream) {
	return stream.pipe(gulp.dest(destPath(conf)));
}

gulp.task('clean', function () {
	return del(paths.build);
});

gulp.task('scripts', function() {
	return es.merge(files.scripts.map(function (conf) {
		var _files, stream;

		_files = conf.files.map(function(f){
			return path.join(paths.src, f);
		});

		stream = gulp.src(_files, { base: paths.src }).pipe(plumber());

		return dest(conf, stream);
	}));
});

gulp.task('styles', function () {
	return es.merge(files.styles.map(function (conf) {
		var _files, stream;

		_files = conf.files.map(function(f){
			return path.join(paths.src, f);
		});

		stream = gulp.src(_files, { base: paths.src }).pipe(plumber());

		if(conf.less) {
			stream = stream.pipe(less());
		}

		return dest(conf, stream);
	}));
});

gulp.task('views', function() {
	return gulp.src('./src/app/**/*.jade', { base: paths.src })
		.pipe(jade())
		.pipe(gulp.dest(paths.build))
});

gulp.task('assets', function() {
	return gulp.src('./src/assets/**/*', { base: paths.src })
		.pipe(gulp.dest(paths.build))
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
			return conf.files.map(function (pattern) {
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
	return run('clean', ['styles', 'scripts', 'index', 'assets'], next);
});

gulp.task('build', function(next){
	return run('build-develop', next);
});

gulp.task('live', function(next){
	return run('build', 'watch', next);
});
