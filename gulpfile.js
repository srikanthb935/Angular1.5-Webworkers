var gulp = require('gulp');
// Include Our Plugins
var webServer = require('gulp-webserver');

// Launch webserver and LiveReload
gulp.task('server', function () {
  gulp.src(__dirname)
    .pipe(webServer({
      port: '9001',
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: 'index.html'
    }));
});