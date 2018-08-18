var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    coffee = require('gulp-coffee'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    data = require('gulp-data'),
    nunjucksRender = require('gulp-nunjucks-render');
var coffeeSources = ['app/scripts/hello.coffee'],
    jsSources = ['app/scripts/*.js'],
    sassSources = ['app/styles/*.scss'],
    htmlSources = ['**/*.html','app/templates/**/*.njk'],
    outputDir = 'docs/assets';

gulp.task('sass', function() {
  gulp.src(sassSources)
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('docs/assets/styles'))
  .pipe(connect.reload())
});

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
  .pipe(coffee({bare: true})
    .on('error', gutil.log))
  .pipe(gulp.dest('docs/assets/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('docs/assets/scripts'))
  .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(htmlSources, ['nunjucks','html']);
});

gulp.task('connect', function() {
  connect.server({
    root: './docs',
    livereload: true
  })
});

gulp.task('nunjucks', function() {
    return gulp.src('app/pages/**/*.+(html|nunjucks)')
      // Adding data to Nunjucks
      .pipe(data(function() {
        return require('./app/data.json')
      }))
      .pipe(nunjucksRender({
        path: ['app/templates']
      }))
      .pipe(gulp.dest('docs'))
  });

gulp.task('html', function() {
  gulp.src(htmlSources)
  .pipe(connect.reload())
});

gulp.task('default', ['nunjucks','html', 'coffee', 'js', 'sass', 'connect', 'watch']);