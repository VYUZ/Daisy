const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
// const removeComments = require ("gulp-strip-css-comments");
const rename = require("gulp-rename");
// const cleanCss = require("gulp-clean-css");
// const gulpIf = require("gulp-if");
const debug = require("gulp-debug");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cssnano = require("gulp-cssnano");
const sourcemaps = require("gulp-sourcemaps");

// gulp.task("norm", function () {
//   return gulp.src("node_modules/normalize-scss/sass/**/*.scss").pipe(gulp.dest("scss"));
// });
gulp.task("scss-compile", function () {
  return gulp
    .src(["scss/**/*.sass", "scss/*.scss"])
    .pipe(debug({ title: "src" }))
    .pipe(sourcemaps.init())
    .pipe(debug({ title: "sourcemaps" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions", "> 5%"],
        cascade: false,
      })
    )
    .pipe(debug({ title: "autoprefixer" }))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(debug({ title: "sass" }))
    .pipe(concat("style.css"))
    .pipe(debug({ title: "concat" }))
    .pipe(sourcemaps.write())
    .pipe(debug({ title: "sourcemaps" }))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
});

gulp.task("mincss", function () {
  return (
    gulp
      .src(["css/*.css"])
      .pipe(rename({ suffix: ".min" }))
      .pipe(debug({ title: "rename" }))
      // .pipe(cleanCss())
      // .pipe(debug({ title: "cleanCss" }))
      // .pipe(removeComments())
      // .pipe(debug({ title: "removeComments" }))
      .pipe(
        cssnano({
          zindex: false,
          discardComments: {
            removeAll: true,
          },
        })
      )
      .pipe(debug({ title: "cssnano" }))
      .pipe(gulp.dest("css"))
  );
});

gulp.task("minjs", function () {
  return gulp
    .src("js/*.js")
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("js"));
});

gulp.task("serve", function () {
  browserSync.init({
    server: { baseDir: "./" },
  });
  gulp.watch(["scss/**/*.sass", "scss/**/*.scss"], gulp.parallel("scss-compile"));
  gulp.watch("./*.html").on("change", browserSync.reload);
});

gulp.task("default", gulp.parallel("scss-compile", "serve"));

gulp.task("min", gulp.parallel("mincss", "minjs")); // при продакшене сначала запустить дефолтный таск (gulp), а затем этот (gulp min)
