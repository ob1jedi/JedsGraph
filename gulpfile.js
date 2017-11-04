var gulp = require('gulp');
var webserver = require('gulp-webserver');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var build = require('gulp-build');
var through = require('through2')

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

//import through from'through2';

gulp.task('build', function() {
  //gulp.src('src/*.js')
  gulp.src('./src/**/*.js')
	  //.pipe(through.obj(function (file, enc, cb) {
		//  console.log(file);
		//}))
      .pipe(build({ GA_ID: '123456' }))
      .pipe(gulp.dest('dist'))
});
