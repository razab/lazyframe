const gulp = require('gulp'),
  rollup = require('rollup'),
  sass = require('gulp-sass'),
  babel = require('rollup-plugin-babel'),
  uglify = require('rollup-plugin-uglify'),
  del = require('del'),
  fs = require('fs'),
  refresh = require('gulp-refresh'),
  watch = require('gulp-watch');

gulp.task('scss', () => {
  return gulp.src('src/scss/lazyframe.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
  return rollup
    .rollup({
      entry: 'src/lazyframe.js',
      plugins: [
        babel({
          exclude: 'node_modules/**'
        }),
        uglify()
      ]
    })
    .then(bundle => {
      const files = bundle.generate({
        format: 'umd',
        exports: 'default',
        moduleName: 'lazyframe',
      });
      fs.appendFileSync('dist/lazyframe.min.js', files.code);
    });
});

gulp.task('build', ['scss', 'js']);
gulp.task('clean', () => del('dist/**/*.js'));
gulp.task('default', ['build']);



gulp.task('scss-dev', () => {
  return gulp.src('src/scss/lazyframe.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('../../dist/css/'))
    .pipe(refresh());
});

gulp.task('js-dev', () => {
  return rollup
    .rollup({
      entry: 'src/lazyframe.js',
      plugins: [
        babel({
          exclude: 'node_modules/**'
        }),
        uglify()
      ]
    })
    .then(bundle => {
      const files = bundle.generate({
        format: 'umd',
        exports: 'default',
        moduleName: 'lazyframe',
      });
      fs.writeFileSync('../../dist/js/lazyframe.min.js', files.code);
      refresh();
    });
});

gulp.task('stream-scss-dev', function () {
  refresh.listen()
    gulp.watch('src/**/*.scss', { ignoreInitial: false }, ['scss-dev'])
});
 

gulp.task('stream-js-dev', function () {
  refresh.listen()
    gulp.watch('src/lazyframe.js', { ignoreInitial: false }, ['js-dev'])
});
 


gulp.task('dev', ['js-dev', 'scss-dev']);
gulp.task('watch-dev', ['stream-js-dev', 'stream-scss-dev']);
