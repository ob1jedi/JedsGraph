var gulp = require('gulp');
var webserver = require('gulp-webserver');
var browserSync = require('browser-sync').create();


gulp.task('default', function() {
	gulp.start('serve');
});

gulp.task('serve', function() {
  gulp.src('src')
    .pipe(webserver({
	  fallback: 'index.html',
      port:'9090',
      livereload: true,
      open: true
    }));
});

// Static server
gulp.task('sync', function () {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
});