var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
//var sass = require('gulp-sass');
//var eslint = require('gulp-eslint');
//var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var compress = require('compression');


gulp.task('default', ['copy', 'cp-img', 'browser-sync', 'css', 'cp-js', 'idb'], function() {})

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./dist",
      middleware: [compress()]
    }
  });
});

gulp.task("css", () => {
  return gulp
    .src("css/*.css")
    .pipe(autoprefixer({
      browsers: ["> 1%", "last 2 versions", "Firefox ESR"]
    }))
    .pipe(gulp.dest("dist/css"));
});


gulp.task('copy', function() {
      gulp.src(['manifest.json', 'index.html', 'restaurant.html', 'sw.js'])
        .pipe(gulp.dest('dist'));
});
      gulp.task('idb', function() {
        gulp.src('node_modules/idb/lib/idb.js')
          .pipe(gulp.dest('dist/js'));
      });


      gulp.task('cp-img', function() {
        gulp.src('img/**/')
          .pipe(gulp.dest('dist/img'));
      });

      gulp.task('cp-js', function() {
        gulp.src('js/**/')
          .pipe(gulp.dest('dist/js'));
      });

      //
      // gulp.task('js', function (done) {
      //     gulp.src(['node_modules/idb/lib/idb.js', 'js/dbhelper.js', 'js/main.js'])
      //         .pipe(babel())
      //         .pipe(uglify())
      //         .pipe(concat('all.js'))
      //         .pipe(gulp.dest('dist/js'));
      //
      //     gulp.src(['node_modules/idb/lib/idb.js', 'js/dbhelper.js', 'js/restaurant_info.js'])
      //         .pipe(babel())
      //         .pipe(uglify())
      //         .pipe(concat('restaurant_info.min.js'))
      //         .pipe(gulp.dest('dist/js'));
      //
      //     gulp.src(['node_modules/idb/lib/idb.js', 'sw.js'])
      //         .pipe(babel())
      //         .pipe(uglify())
      //         .pipe(concat('sw.js'))
      //         .pipe(gulp.dest('dist'));
      //
      //     browserSync.reload();
      //     done();
      // });
