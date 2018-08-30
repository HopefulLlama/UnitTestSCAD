const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jasmine = require('gulp-jasmine');

gulp.task('default', ['test']);
gulp.task('test', ['lint', 'unit-test', 'integration-test']);

gulp.task('lint', () => gulp
  .src([
    'src/**/*.js',
    'spec/**/*.js',
    '!spec/e2e/resources/**/*.js',
    '!spec/e2e/RequireTemplate.js'
  ])
  .pipe(jshint({
    esversion: 6
  }))
  .pipe(jshint.reporter('default'))
  .pipe(jshint.reporter('fail'))
);

gulp.task('unit-test', () => gulp
  .src('spec/unit/**/*.js')
  .pipe(jasmine())
);

gulp.task('integration-test', () => gulp
  .src('spec/integration/**/*.js')
  .pipe(jasmine())
);