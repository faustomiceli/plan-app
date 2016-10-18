var fs                = require('fs');
var path              = require('path');
var del               = require('del');
var runSequence       = require('run-sequence');
var notify            = require('gulp-notify');
var mainBowerFiles    = require('main-bower-files');

var gulp              = require('gulp');
var clean             = require('gulp-clean');
var gutil             = require('gulp-util');
var sass              = require('gulp-sass');
var autoprefixer      = require('gulp-autoprefixer');
var minifycss         = require('gulp-minify-css');
var concat            = require('gulp-concat');
var rename            = require('gulp-rename');
var jshint            = require('gulp-jshint');
var jscs              = require('gulp-jscs');
var uglify            = require('gulp-uglify');
var header            = require('gulp-header');
var replace           = require('gulp-replace');
var imagemin          = require('gulp-imagemin');
var gulpFilter        = require('gulp-filter');
var connect           = require('gulp-connect');

//  Package
var pkg               = require('./package.json');

//  Directories
var DIRS              = pkg['ff-configs'].directories;
var ROOT              = '.';
var DIR_SOURCE        = path.join(ROOT, DIRS.src);
var DIR_DIST          = path.join(ROOT, DIRS.dist);
var DIR_SRC_STYLES    = path.join(DIR_SOURCE, DIRS.assets.styles);
var DIR_SRC_SCRIPTS   = path.join(DIR_SOURCE, DIRS.assets.scripts);
var DIR_SRC_IMAGES    = path.join(DIR_SOURCE, DIRS.assets.images);
var DIR_SRC_FONTS     = path.join(DIR_SOURCE, DIRS.assets.fonts);
var DIR_DIST_STYLES   = path.join(DIR_DIST, DIRS.assets.styles);
var DIR_DIST_SCRIPTS  = path.join(DIR_DIST, DIRS.assets.scripts);
var DIR_DIST_IMAGES   = path.join(DIR_DIST, DIRS.assets.images);
var DIR_DIST_FONTS    = path.join(DIR_DIST, DIRS.assets.fonts);

//  File header
var banner = '/*! ' + pkg.appName + ' - ' + pkg.description + ' | @version v' + pkg.version + ' */\n';

var isProduction = true;
var sassStyle = 'compressed';

if (gutil.env.dev === true) {
  sassStyle = 'expanded';
  isProduction = false;
}

// ------------------
//  Styles
// ------------------
gulp.task('styles', function() {
  return gulp.src(DIR_SRC_STYLES + '/*.scss')
    .pipe(sass({style: sassStyle}))
    .pipe(autoprefixer({browser: ['last 2 versions']}))
    .pipe(header(banner))
    .pipe(isProduction ? minifycss() : gutil.noop())
    .pipe(gulp.dest(DIR_DIST_STYLES))
    .pipe(isProduction ? notify({title: 'Styles production complete'}) : notify({title: 'Styles development complete'}));
});

gulp.task('styles:bower', function() {
  var filter = gulpFilter(['*.css']);
  return gulp.src(mainBowerFiles())
    .pipe(filter)
    .pipe(gulp.dest(DIR_SRC_STYLES + '/vendor'));
});

// ------------------
//  Scripts
// ------------------
var ScriptsFile = {
  name: {
    app: 'app.js',
    lib: 'lib.js',
    main: 'main.js'
  },
  src: {
    app: [DIR_SRC_SCRIPTS + '/**/*.js', '!' + DIR_SRC_SCRIPTS + '/vendor/**/*', '!' + DIR_SRC_SCRIPTS + '/_lib/**/*'],
    lib: DIR_SRC_SCRIPTS + '/_lib/**/*.js'
  },
  dist: {
    files: [DIR_DIST_SCRIPTS + '/lib.js', DIR_DIST_SCRIPTS + '/app.js']
  }
};

gulp.task('scripts', ['scripts:main'], function() {
  return gulp.src(ScriptsFile.dist.files)
    .pipe(isProduction ? clean({force: true}) : gutil.noop())
    .pipe(isProduction ? notify({title: 'Scripts production complete'}) : notify({title: 'Scripts development complete'}));
});

gulp.task('scripts:main', ['scripts:lib', 'scripts:app'], function() {
  return gulp.src(ScriptsFile.dist.files)
    .pipe(concat(ScriptsFile.name.main))
    .pipe(isProduction ? uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }) : gutil.noop())
    .pipe(header(banner), {pkg: pkg})
    .pipe(gulp.dest(DIR_DIST_SCRIPTS))
});

gulp.task('scripts:app', function() {
  return gulp.src(ScriptsFile.src.app)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jshint.reporter('default'))
    .pipe(concat(ScriptsFile.name.app))
    .pipe(gulp.dest(DIR_DIST_SCRIPTS));
});

gulp.task('scripts:lib', function() {
  return gulp.src(ScriptsFile.src.lib)
    .pipe(concat(ScriptsFile.name.lib))
    .pipe(gulp.dest(DIR_DIST_SCRIPTS));
});

// ------------------
//  Images
// ------------------
gulp.task('images', function() {
  return gulp.src(DIR_SRC_IMAGES + '/**/*')
    .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest(DIR_DIST_IMAGES))
    .pipe(notify({title: 'Images complete'}));
});

// ------------------
//  Copy file
// ------------------
gulp.task('copy', [
  'copy:index.html',
  'copy:jquery',
  'copy:misc',
]);

//  Copy index.html
gulp.task('copy:index.html', function() {
  return gulp.src(DIR_SOURCE + '/index.html')
    .pipe(replace(/{{JQUERY_VERSION}}/g, pkg.devDependencies.jquery))
    .pipe(gulp.dest(DIR_DIST));
});

//  Copy jquery and replace script tag (index.html)
gulp.task('copy:jquery', function() {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
    .pipe(rename('jquery-' + pkg.devDependencies.jquery + '.min.js'))
    .pipe(gulp.dest(DIR_DIST_SCRIPTS + '/vendor'));
});

//  Copy other file
gulp.task('copy:misc', function() {
  return gulp.src([
    DIR_SOURCE + '/**/*',
    '!' + DIR_SRC_STYLES + '/**/*',
    '!' + DIR_SRC_IMAGES + '/**/*',
    '!' + DIR_SRC_SCRIPTS + '/**/*',
    '!' + DIR_SOURCE + '/index.html'
  ], {
    dot: true
  }).pipe(gulp.dest(DIR_DIST));
});

// ------------------
//  Watch
// ------------------
gulp.task('watch', function() {
  //  Watch .scss files
  gulp.watch(DIR_SRC_STYLES + '/**/*.scss', ['styles'], function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  //  Watch .js files
  gulp.watch(DIR_SRC_SCRIPTS + '/**/*.js', ['scripts'], function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  //  Watch image files
  gulp.watch(DIR_SRC_IMAGES + '/**/*', ['images'], function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  //  Watch html files
  gulp.watch(DIR_SOURCE + '/**/*.html', ['copy:misc', 'copy:index.html'], function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

// ------------------
//  Build
// ------------------
gulp.task('build', function(done) {
  runSequence(
    ['clean'],
    ['styles', 'scripts', 'images', 'copy'],
    done);
  return notify({title: 'Build complete'});
});

gulp.task('start', function() {
  connect.server({
    root: DIR_DIST,
  });
});

//  Clean dist
gulp.task('clean', function() {
  return del([DIR_DIST]);
});

gulp.task('default', function(done) {
  runSequence(['build'], ['start'], done);
});
