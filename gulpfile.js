const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jasmine = require('gulp-jasmine');

const E2E = require('./spec/e2e/E2E.js');

gulp.task('default', ['test']);
gulp.task('test', ['lint', 'unit-test', 'e2e']);

gulp.task('lint', () => {
  return gulp
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
    .pipe(jshint.reporter('fail'));
});

gulp.task('unit-test', () => {
  return gulp
    .src('spec/unit/**/*.js')
    .pipe(jasmine());
});

gulp.task('e2e', done => {
  const failures = E2E();
  failures.forEach(failure => console.log(failure));
  if(failures.length === 0) {
    done();
  } else {
    done(failures);
  }
});