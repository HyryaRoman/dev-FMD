import config from './gulp/config.js';

import gulp from 'gulp';
import clean from 'gulp-clean';
import prettier from 'gulp-prettier';
import autoprefixer from 'gulp-autoprefixer';
import fileinclude from 'gulp-file-include';

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

function clear_build() {
  return gulp.src(config.paths.build, {
    read: false,
    allowEmpty: true
  }).pipe(clean());
}

function gen_html_breakpoints() {
  return gulp.src(config.templates.html.src)
  .pipe(fileinclude(config.fileinclude))
  .pipe(prettier(config.prettier))
  .pipe(gulp.dest(config.templates.html.dest));
}

function gen_sass_breakpoints() {
  return gulp.src(config.templates.sass.src)
  .pipe(fileinclude(config.fileinclude))
  // .pipe(prettier(config.prettier))
  .pipe(gulp.dest(config.templates.sass.dest));
}

const gen_breakpoints = gulp.parallel(gen_html_breakpoints, gen_sass_breakpoints);

function build_html() {
  return gulp.src(config.paths.html.src)
  .pipe(fileinclude(config.fileinclude))
  .pipe(prettier(config.prettier))
  .pipe(gulp.dest(config.paths.html.dest));
}

function build_sass() {
  return gulp.src(config.paths.sass.src, {
    sourcemaps: true
  })
  .pipe(fileinclude(config.fileinclude))
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer(config.autoprefixer))
  .pipe(prettier(config.prettier))
  .pipe(gulp.dest(config.paths.sass.dest, {
    sourcemaps: true
  }));
}

const build =
  gulp.series(
    clear_build,
    gen_breakpoints,
    gulp.parallel(
      build_html,
      build_sass
    )
  );

export {
  clear_build,
  gen_html_breakpoints,
  gen_sass_breakpoints,
  gen_breakpoints,
  build_sass,
  build_html,
  build,
};

// export default build;
