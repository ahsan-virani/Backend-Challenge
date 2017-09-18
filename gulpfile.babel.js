import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
var exec = require('child_process')
  .exec;

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**'],
  nonJs: ['./package.json', './.gitignore', './.env'],
  tests: './server/tests/*.js'
};

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del.sync(['dist/**', 'dist/.*', 'coverage/**', '!dist', '!coverage'])
);

// Copy non-js files to dist
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
  .pipe(plugins.newer('dist'))
  .pipe(gulp.dest('dist'))
);

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
  .pipe(plugins.newer('dist'))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.babel())
  .pipe(plugins.sourcemaps.write('.', {
    includeContent: false,
    sourceRoot(file) {
      return path.relative(file.path, __dirname);
    }
  }))
  .pipe(gulp.dest('dist'))
);

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel']
  })
);

// gulp serve for development
gulp.task('serve', () => runSequence('nodemon'));

// gulp serve for prod
gulp.task('prod', () => runSequence('seed', 'nodemon'));

gulp.task('seed', ['clean', 'copy', 'babel'], (callback) => {
  exec('node dist/seed.js', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});


gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'babel']
  );
});
