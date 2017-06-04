var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var coverage = require('gulp-coverage');

gulp.task('default', function() {
	gulp.start('test');
});

gulp.task('test', function() {
	gulp.start('lint');
	gulp.start('coverage');
});

gulp.task('lint', function() {
	return gulp.src([
		'src/**/*.js',
		'spec/**/*.js'
	])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});

gulp.task('coverage', function() {
	return gulp.src('spec/**/*.js')
	.pipe(coverage.instrument({
		pattern: ['src/**/*.js']
	}))
	.pipe(jasmine())
	.pipe(coverage.gather())
	.pipe(coverage.format())
	.pipe(gulp.dest('reports'));
});

gulp.task('unittest', function() {
	return gulp.src('spec/**/*.js')
	.pipe(jasmine());
});