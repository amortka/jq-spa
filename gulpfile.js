var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('js', function () {
    return gulp.src('./src/**/*.js')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('serve', ['js'], function() {
    browserSync.init({
        port: 8080,
        server: {
            baseDir: "./src/"
        }
    });

    gulp.watch("./src/**/*.js", ['js-watch']);
});
