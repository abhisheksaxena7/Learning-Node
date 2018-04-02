const gulp = require('gulp');

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
//Default task
gulp.task('default', () => console.log('Gulp is running!'));