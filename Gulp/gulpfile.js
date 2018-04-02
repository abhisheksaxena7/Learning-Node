const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');

/*
    TOP-LEVEL FUNCTIONS
    gulp.task - Define tasks
    gulp.src - Point to files to use
    gulp.dest - Points to folder to output
    gulp.watch - Watch files and foler for changes
*/

//Logs a message
gulp.task('message', () => console.log('First gulp task'));

//Copy HTML Files
gulp.task('copyHTML', () => {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

//Minify the Images
gulp.task('imageMin', () =>
    gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);

//Minify JS
gulp.task('minifyjs', () =>
    gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
);

//Compile Sass
gulp.task('sass', () =>
    gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
);

//Default task
//gulp.task('default', () => console.log('Gulp is running!'));
gulp.task('default', ['message', 'copyHTML', 'imageMin', 'minifyjs', 'sass']);

//Watch
gulp.task('watch', () => {
    gulp.watch('src/js/*.js', ['minifyjs']);
    gulp.watch('src/images/*', ['imageMin']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/*.html', ['copyHTML']);
});