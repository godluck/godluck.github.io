var gulp = require('gulp');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var sequence = require('run-sequence');
var inlinesource = require('gulp-inline-source');
var inlineCss = require('gulp-inline-css');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var postCss = require('gulp-postcss')
var postcssOpacity = require('postcss-opacity');
var autoPrefixer = require('autoprefixer')({
    browsers: [
        'iOS >= 6',
        'Android >= 3',
        'ie >= 8',
        'last 2 Firefox versions',
        'last 2 Opera versions',
        'last 2 Safari versions',
        'last 2 UCAndroid versions',
    ]
});
// var cssnext = require('postcss-cssnext')
// var precss = require('precss')
// var color_rgba_fallback = require('postcss-color-rgba-fallback');
// var opacity = require('postcss-opacity');
// var pseudoelements = require('postcss-pseudoelements');
// var vmin = require('postcss-vmin');
// var pixrem = require('pixrem');
// var will_change = require('postcss-will-change');
// var doiuse = require('doiuse')({
//         browsers: [
//             'iOS >= 6',
//             'Android >= 3'
//         ],
//         onFeatureUsage: function(usageInfo) {
//             console.log(usageInfo.message)
//         }
//     });

var postCssProcessors = [
    autoPrefixer,
    postcssOpacity
]
var timeStamp = new Date().getTime();

var taskName = [
    'modelTester',
    'yxcardh5',
    'yxcard',
    'appbugs',
];
var cssTaskName = []
var watchers = [],
    watcher;
var mainTask = [];
for (var i in taskName) {
    var name = taskName[i];
    buildTasks(name);
}
for (var i in cssTaskName) {
    var name = cssTaskName[i];
    buildCSSTasks(name);
}

function buildCSSTasks(name) {
    gulp.task(name + 'less', function() {
        return gulp.src('./' + name + '/*.less')
            .pipe(plumber())
            .pipe(less({
                pathes: ['./']
            })).pipe(rename({
                extname: '.css'
            })).pipe(postCss(postCssProcessors)).pipe(gulp.dest('./' + name));
    });
    gulp.task('run' + name, function(done) {
        sequence(name + 'less', done);
    });
    watcher = gulp.watch('./' + name + '/*', ['run' + name]);
    watcher.on('change', function(event) {
        timeStamp = new Date().getTime();
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...' + name + '---' + new Date());
    });
    watchers.push(watcher);
    mainTask.push('run' + name);
}

function buildTasks(name) {
    gulp.task(name + 'less', function() {
        return gulp.src('./' + name + '/*.less')
            .pipe(plumber())
            .pipe(less({
                pathes: ['./']
            })).pipe(rename({
                extname: '.css'
            })).pipe(postCss(postCssProcessors)).pipe(gulp.dest('./' + name));
    });
    gulp.task(name + 'webpack', function() {
        return gulp.src('./' + name + '/entry.js')
            .pipe(plumber())
            .pipe(webpack({
                watcher: true,
                output: {
                    filename: "index.js"
                }
            })).pipe(gulp.dest('./' + name))
    })
    gulp.task(name + 'webpackh5', function() {
        return gulp.src('./' + name + '/h5.js')
            .pipe(plumber())
            .pipe(webpack({
                watcher: true,
                output: {
                    filename: "index2.js"
                }
            })).pipe(gulp.dest('./' + name))
    })
    gulp.task(name + 'combine', function() {
        return gulp.src('./' + name + '/*.html')
            .pipe(plumber())
            .pipe(inlinesource({
                compress: false,
                pretty: true
            })).pipe(gulp.dest('./' + name + '/combine'))
    });
    gulp.task('run' + name, function(done) {
        sequence(name + 'less', name + 'webpack', name + 'webpackh5', name + 'combine', done);
    });
    watcher = gulp.watch('./' + name + '/*', ['run' + name]);
    watcher.on('change', function(event) {
        timeStamp = new Date().getTime();
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...' + name + '---' + new Date());
    });
    watchers.push(watcher);
    mainTask.push('run' + name);
}
gulp.watch('./js/*', ['default']).on('change', function(event) {
    timeStamp = new Date().getTime();
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...' + taskName[i] + '---' + new Date());
});
gulp.task('default', mainTask);