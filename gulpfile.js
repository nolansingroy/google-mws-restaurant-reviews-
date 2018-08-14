var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var compress = require('compression');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var csso = require('gulp-csso');
var gulpLoadPlugins = require("gulp-load-plugins");
const $ = gulpLoadPlugins();
const del = require("del");
var zlib = require('zlib');
var  critical = require('critical');
var responsive = require('gulp-responsive');


gulp.task("clean", del.bind(null, ["dist"]));

gulp.task('default', ['copy', 'browser-sync', 'css', 'js','critical','images'], function() {})

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./dist",
      middleware: [compress()]
    }
  });
});

gulp.task('critical', function () {
    critical.generate({
        inline: true,
        base: '.',
        css: ['dist/css/styles.css'],
        src: 'index.html',
        dest: './dist/index.html',
        minify: true,
        width: 320,
        height: 480
    });

    critical.generate({
        inline: true,
        base: '.',
        css: ['dist/css/styles.css'],
        src: 'restaurant.html',
        dest: './dist/restaurant.html',
        minify: true,
        width: 320,
        height: 480
    });
});

gulp.task('images', function () {
    return gulp.src('img/*.{png,jpg}')
        .pipe(responsive({
            '*.png': [{ /* DO NOTHING */ }],
            '*.jpg': [{ /* DO NOTHING */ },
                {
                    width: 280,
                    rename: function (path) {
                        path.dirname += "/scaled";
                        path.basename += "_280";
                        path.extname = ".jpg";
                        return path;
                    }
                },
                {
                    width: 280,
                    rename: function (path) {
                        path.dirname += "/scaled";
                        path.basename += "_280";
                        path.extname = ".jpg";
                        return path;
                    }
                },
                {
                    width: 335,
                    rename: function (path) {
                        path.dirname += "/scaled";
                        path.basename += "_335";
                        path.extname = ".jpg";
                        return path;
                    }
                },
                {
                    width: 385,
                    rename: function (path) {
                        path.dirname += "/scaled";
                        path.basename += "_385";
                        path.extname = ".jpg";
                        return path;
                    }
                },
                {
                    width: 432,
                    rename: function (path) {
                        path.dirname += "/scaled";
                        path.basename += "_432";
                        path.extname = ".jpg";
                        return path;
                    }
                },
                {
                    width: 640,
                    rename: function (path) {
                        path.dirname += "/scaled";
                        path.basename += "_640";
                        path.extname = ".jpg";
                        return path;
                    }
                }
            ]
        }))
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});

gulp.task("css", () => {
  return gulp
    .src("css/*.css")
    .pipe(autoprefixer({
      browsers: ["> 1%", "last 2 versions", "Firefox ESR"]
    }))
    .pipe(csso())
    .pipe(gulp.dest("dist/css"));
});


gulp.task('copy', function() {
  gulp.src(['manifest.json', 'index.html', 'restaurant.html', "sw.js"])
    .pipe(
      $.if(
        /\.html$/,
        $.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: {
            compress: {
              drop_console: true
            }
          },
          processConditionalComments: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        })
      )
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('idb', function() {
  gaulp.src('node_modules/idb/lib/idb.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task("img", function() {
  gulp.src("img/**/*")
    //.pipe(cache(imagemin()))
    .pipe(gulp.dest("dist/img"));
});

gulp.task('cp-js', function(done) {
  gulp.src("js/**/*.js")
    .pipe(gulp.dest("dist/js"));
  done();
});


gulp.task('js', function(done) {
  gulp.src(['node_modules/idb/lib/idb.js', 'js/dbhelper.js', 'js/main.js', 'restaurant_info.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'));

  gulp.src(['node_modules/idb/lib/idb.js', 'js/dbhelper.js', 'js/restaurant_info.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('restaurant_all.js'))
    .pipe(gulp.dest('dist/js'));

  gulp.src(['node_modules/idb/lib/idb.js', 'sw.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('sw.js'))
    .pipe(gulp.dest('dist'));

  gulp.src(['node_modules/intersection-observer/intersection-observer.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));


  browserSync.reload();
  done();
});
