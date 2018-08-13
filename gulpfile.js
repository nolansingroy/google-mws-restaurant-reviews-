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

gulp.task('default', ['copy', 'img', 'browser-sync', 'css', 'js','cp-js','idb'], function() {})

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
		.pipe(csso())
    .pipe(gulp.dest("dist/css"));
});


gulp.task('copy', function() {
      gulp.src(['manifest.json', 'index.html', 'restaurant.html',"sw.js"])
			.pipe(
	      $.if(
	        /\.html$/,
	        $.htmlmin({
	          collapseWhitespace: true,
	          minifyCSS: true,
	          minifyJS: { compress: { drop_console: true } },
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
        gulp.src('node_modules/idb/lib/idb.js')
					.pipe(uglify())
          .pipe(gulp.dest('dist/js'));
      });

			gulp.task("img", function (){
			    gulp.src("img/**/*")
			    .pipe(cache(imagemin()))
			    .pipe(gulp.dest("dist/img"));
			});

      gulp.task('cp-js', function(done) {
      gulp.src("js/**/*.js")
          .pipe(gulp.dest("dist/js"));
					done();
      });


      gulp.task('js', function (done) {
          gulp.src(['node_modules/idb/lib/idb.js', 'js/dbhelper.js', 'js/main.js','restaurant_info.js'])
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

					gulp.src('js/dbhelper.js')
								.pipe(gulp.dest('dist/js'))

          browserSync.reload();
          done();
      });
