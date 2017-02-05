var gulp = require('gulp');
var concat = require('gulp-concat');
var iife = require("gulp-iife");

gulp.task('js', function () {
	return gulp.src(['client/src/**/*.js'])
		.pipe(iife())
		.pipe(concat('mobilerange.js'))
		.pipe(gulp.dest('client/dist/app'));
});

gulp.task('copy libs', function () {
	return gulp.src([
			'node_modules/angular/angular.js',
			'node_modules/socket.io-client/dist/socket.io.js'
		])
		.pipe(gulp.dest('client/dist/js'));
});

gulp.task('build', [
	'js',
	'copy libs'
], function () {
	return gulp.src([
			'client/src/**',
			'!client/src/**/*.js'
		])
		.pipe(gulp.dest('client/dist'));
});

gulp.task('watch', function () {
	return gulp.watch('client/src/**', ['build']);
});
