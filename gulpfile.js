var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	sassPlugin = require('gulp-ruby-sass'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

//Minify Javascript + Error handling
gulp.task('scripts', function(){
	gulp.src('public/javascripts/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(gulp.dest('public/build/javascripts'));
});

//Compile SASS + Error handling (compressed)
gulp.task('sass', function(){
	sassPlugin('public/sass/style.scss', { style: 'compressed' } )
	.on('error', function(err){
		console.log('Error', err.message);
	})
	.pipe(gulp.dest('public/css'))
	.pipe(reload({stream:true}));
});

//Live reload
gulp.task('browser-sync', function() {
	browserSync.init(null, {
		proxy: 'http://localhost:3000',
        files: ['views/**/*.*'],
        port: 1030,
        open: false
	});
});

//Watch for changes
gulp.task('watch', function(){
	gulp.watch('public/javascripts/*.js', ['scripts']);
	gulp.watch('public/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['scripts', 'watch', 'sass', 'browser-sync']);