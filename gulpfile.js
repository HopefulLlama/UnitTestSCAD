var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
	gulp.start('lint');
});

gulp.task('lint', function() {
	return gulp.src('./src/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});