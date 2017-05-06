var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');

gulp.task('default', function() {
	gulp.start('lint');
	gulp.start('unittest');
});

gulp.task('lint', function() {
	return gulp.src('src/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});

gulp.task('unittest', function() {
	return gulp.src('spec/**/*.js')
	.pipe(jasmine());
});