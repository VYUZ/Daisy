const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
// const cssbeautify = require ("gulp-cssbeautify"); //https://www.npmjs.com/package/gulp-beautify  автоформатирование и пр. для js css html
//const removeComments = require ("gulp-strip-css-comments"); //делает cssnano
const rename = require("gulp-rename");
const cssnano = require("gulp-cssnano"); // аналог cleanCss
// const cleanCss = require("gulp-clean-css"); // аналог cssnano
const gulpIf = require("gulp-if");
const debug = require("gulp-debug");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const isDevelopment = true; //true - write sourcemaps, false - no sourcemaps - изменить для продакшна
//копируем нормалайз себе в рабочую папку
// gulp.task("norm", function () {return gulp.src("node_modules/normalize-scss/sass/**/*.scss").pipe(gulp.dest("scss")); });
gulp.task("sass", function () {
  return gulp
    .src(["scss/**/*.sass", "scss/**/*.scss"])
    .pipe(debug({ title: "src" }))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(debug({ title: "sourcemaps" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions", "> 5%"],
        grid: true,
        cascade: false,
      })
    )
    .pipe(debug({ title: "autoprefixer" }))
    .pipe(concat("style.scss"))
    .pipe(debug({ title: "concat" }))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(debug({ title: "sass" }))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(debug({ title: "sourcemaps" }))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
});

gulp.task("scripts", function () {
  return gulp.src(["js/script.js", "libs/**/*.js"]).pipe(browserSync.reload({ stream: true }));
});

gulp.task("serve", function () {
  browserSync.init({
    server: { baseDir: "./" },
    notify: true, //  уведомления
  });
});

gulp.task("clean", function () {
  return del.sync("build");
  //return del('build');
});

gulp.task("mincss", function () {
  return (
    gulp
      .src(["css/*.css"])
      // .pipe(cssbeautify())
      // .pipe(debug({ title: "cssbeautify" }))
      // .pipe(cleanCss())
      // .pipe(debug({ title: "cleanCss" }))
      //.pipe(removeComments())
      //.pipe(debug({ title: "removeComments" }))
      .pipe(gulp.dest("build/css"))
      .pipe(cssnano({ zindex: false, discardComments: { removeAll: true } }))
      .pipe(debug({ title: "cssnano" }))
      .pipe(rename({ suffix: ".min" }))
      .pipe(debug({ title: "rename" }))
      .pipe(gulp.dest("build/css"))
  );
});

gulp.task("minhtml", function () {
  return gulp
    .src(["*.html"])
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(debug({ title: "htmlmin" }))
    .pipe(gulp.dest("build"));
});

gulp.task("minjs", function () {
  return gulp
    .src(["js/script.js", "libs/**/*.js"])
    .pipe(uglify())
    .pipe(debug({ title: "uglify" }))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("script.min.js"))
    .pipe(debug({ title: "concat" }))
    .pipe(gulp.dest("build/js"));
});

gulp.task("minimg", function () {
  return gulp
    .src("img/**/*.+(png|jpg|jpeg|gif|svg|ico)")
    .pipe(changed("build/img"))
    .pipe(debug({ title: "changed" }))
    .pipe(
      imagemin(
        {
          interlaced: true,
          progressive: true,
          optimizationLevel: 5,
        },
        [
          recompress({
            loops: 6,
            min: 50,
            max: 90,
            quality: "high",
            use: [
              pngquant({
                quality: [0.8, 1],
                strip: true,
                speed: 1,
              }),
            ],
          }),
          imagemin.gifsicle(),
          imagemin.optipng(),
          imagemin.svgo(),
        ]
      )
    )
    .pipe(debug({ title: "imagemin" }))
    .pipe(dest("build/img"));
});

gulp.task("prebuild", async function () {
  var buildFonts = gulp
    .src("fonts/**/*") // Переносим шрифты в продакшен
    .pipe(gulp.dest("build/fonts"));
});

gulp.task("watch", function () {
  gulp.watch(["scss/**/*.sass", "scss/**/*.scss"], gulp.parallel("sass"));
  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch(["js/script.js", "libs/**/*.js"], gulp.parallel("scripts"));
});
gulp.task("default", gulp.parallel("serve", "sass", "scripts", "watch"));
gulp.task("build", gulp.series("prebuild", "clean", "mincss", "minjs", "minhtml", "minimg"));
