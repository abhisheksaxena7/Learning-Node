const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
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

//Default task
gulp.task('default', () => console.log('Gulp is running!'));