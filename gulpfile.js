var gulp = require('gulp');
var webserver = require('gulp-webserver');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');

gulp.task('default', function() {
	gulp.start('serve');
});

gulp.task('index', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/js/**/*.js'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
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