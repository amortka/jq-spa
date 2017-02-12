/*var autoprefixer = require('gulp-autoprefixer');
var csso         = require('gulp-csso');
var debug        = require('gulp-debug');
var filter       = require('gulp-filter');
var jshint       = require('gulp-jshint');
var sass         = require('gulp-sass');
var uglify       = require('gulp-uglify');
var useref       = require('gulp-useref');*/

var browserSync  = require('browser-sync').create();
var del          = require('del');
var gulp         = require('gulp');
var plugins      = require('gulp-load-plugins')();

gulp.task('clean', function(done) {
    del([
        './_tmp'
    ], done);
});

gulp.task('html', ['sass'], function() {
  var target = gulp.src('./src/index.html');

  var filterJs = plugins.filter(['**/*.js'], {restore: true});

  return target.pipe(plugins.useref())
            .pipe(filterJs)
            .pipe(plugins.debug())
            .pipe(plugins.uglify())
            .pipe(filterJs.restore)
            .pipe(gulp.dest('./_tmp/'));
})

gulp.task('sass', function() {
  return gulp.src('./src/**/*.scss')
        .pipe(plugins.debug())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer('last 1 version'))
        .pipe(plugins.csso())
        .pipe(gulp.dest('./_tmp/'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src(['./src/**/*.js', '!**/*.min.js'])
        .pipe(plugins.jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('serve', ['html'], function() {
    browserSync.init({
        port: 8080,
        server: {
            baseDir: ['./src/', './_tmp']
        }
    });

    gulp.watch('./src/**/*.js', ['js-watch']);
    gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.html').on('change', browserSync.reload);
});
