var gulp = require('gulp');
var webserver = require('gulp-webserver');

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