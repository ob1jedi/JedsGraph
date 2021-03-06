var gulp = require('gulp');
var webserver = require('gulp-webserver');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var build = require('gulp-build');
var through = require('through2')
var print = require('gulp-print');
var pump = require('pump');
var gulpSeries = require('gulp-series');
var clean = require('gulp-clean');
var uglifycss = require('gulp-uglifycss');
var htmlminifier = require('gulp-html-minifier');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglifyes = require('uglify-es');
var composer = require('gulp-uglify/composer');
var minifyes = composer(uglifyes, console);
var obfuscate = require('gulp-obfuscate');
var babel = require('gulp-babel');

gulp.task('default', function() {
	gulp.start('serve');
});

gulp.task('index', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./src/scripts/**/*.js'], {read: false});
 
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
  //gulp.src('src/*.scripts')
  gulp.src(['./src/scripts/**/*.js', 
			'./src/**/*.html', 
			'./src/**/*.css',
			'./src/**/*.svg'])
	  //.pipe(through.obj(function (file, enc, cb) {
		//  console.log(file);
		//}))
	  .pipe(print())
      .pipe(uglify())
	  .pipe(build({ GA_ID: '123456' }))
      .pipe(gulp.dest('dist'))
});

function serveLive(){
  return gulp.src('dist')
    .pipe(webserver({
	  fallback: 'index.html',
      port:'9091',
      livereload: true,
      open: true
    }));
}
function copyDependencies() {
  return gulp.src('./src/deps/*.js')
      .pipe(gulp.dest('dist/deps'))
};

function copyFonts() {
  return gulp.src('./src/fonts/**/*')
      .pipe(gulp.dest('dist/fonts'))
};

function copySupportContent() {
  return gulp.src('./src/html/*')
      .pipe(gulp.dest('dist/html'))
};

function copyAssets() {
  return gulp.src('./src/custom/assets/**/*')
      .pipe(gulp.dest('dist/custom/assets'))

};

function transpile(){
	return gulp.src('./src/scripts/**/*.js')
		.pipe(babel())
}

gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false})
	  .pipe(clean())
});

function compress (callback) {
  pump([
        gulp.src('./src/Index.html'),
		useref(),
		//gulpif('*.js', babel()),
		//gulpif('*.js', minifyes()),
		//gulpif('*.js', obfuscate()),
		gulpif('*.css', uglifycss()),
		gulpif('*.html', htmlminifier()),
		gulp.dest('dist')
    ],
    callback
  );
};


//gulp.task('clean', cleanMe);
gulp.task('copy-dependencies', copyDependencies);
gulp.task('copy-fonts', copyFonts);
gulp.task('copy-assets', copyAssets);
gulp.task('copy-support-content', copySupportContent);
gulp.task('transpile', transpile);
gulp.task('compress', compress);
gulp.task('serve-live', serveLive);

gulp.task('build', gulp.series(
  'clean',
  'copy-dependencies', 
  'copy-fonts', 
  'copy-assets', 
  'copy-support-content',
  'compress',
  'serve-live'
));


gulp.task('default', () =>
    gulp.src('src/app.js')
        
        .pipe(gulp.dest('dist'))
);
