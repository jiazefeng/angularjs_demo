var gulp = require('gulp'),
	connect=require('gulp-connect'),
	html2js=require('gulp-ng-html2js'),
	concat=require('gulp-concat'),
	clean=require('gulp-clean'),
	less=require('gulp-less'),
	csso=require('gulp-csso'),
	uglify=require('gulp-uglify'),
	sourceMaps=require('gulp-sourcemaps');

var webServerRoot='dist/',
	appName='robot',
	appJsPath=webServerRoot+'js/',
	appImgPath=webServerRoot+'images/',
	appTemplatesJsName=appName+'.templates.js',
	appJsName=appName+'.js',
	appCssPath=webServerRoot+'css/';

gulp.task('default', ['build-dev', 'webserver', 'watch','copy-image','copy-assets']);

gulp.task('release', ['build-release', 'clean-maps','copy-image','copy-assets', 'webserver-release']);

gulp.task('build-dev',['build-vendor-dev', 'html2js-dev', 'build-js-dev', 'build-less-dev', 'build-index']);

gulp.task('build-release',['build-vendor-release', 'html2js-release','build-js-release', 'build-less-release', 'build-index']);

gulp.task('webserver', ['build-dev'], function() {
	connect.server({
		root:webServerRoot,
		port:11100,
		fallback:webServerRoot+'index.html',
		debug:true
	});
});

gulp.task('webserver-release', ['build-release'], function() {
	connect.server({
		root:webServerRoot,
		port:4000,
		fallback:webServerRoot+'index.html',
		debug:true
	});
});

//html2js
gulp.task('html2js-dev', ['clean-html2js'], function(){
	return gulp.src("src/**/*.tpl.html")
		.pipe(sourceMaps.init())
		.pipe(html2js({
			moduleName: 'robot.templates',
			stripPrefix: 'app/'
		}))
		.pipe(concat(appTemplatesJsName))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath));
});

gulp.task('html2js-release', ['clean-html2js'], function(){
	return gulp.src("src/**/*.tpl.html")
		.pipe(html2js({
			moduleName: 'robot.templates',
			stripPrefix: 'app/'
		}))
		.pipe(concat(appTemplatesJsName))
		.pipe(uglify())
		.pipe(gulp.dest(appJsPath));
});

gulp.task('clean-html2js',function(){
	return gulp.src(webServerRoot+appJsPath+appTemplatesJsName)
		.pipe(clean());
});


//js
gulp.task('build-js-release', ['clean-js'], function(){
	return gulp.src("src/**/*.js")
		.pipe(concat(appJsName))
		.pipe(uglify())
		.pipe(gulp.dest(appJsPath));
});

gulp.task('build-js-dev', ['clean-js'], function(){
	return gulp.src("src/**/*.js")
		.pipe(sourceMaps.init())
		.pipe(concat(appJsName))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath));
});

gulp.task('clean-js',function(){
	return gulp.src(webServerRoot+appJsPath+appJsName)
		.pipe(clean());
});

//index
gulp.task('build-index', ['clean-index'], function(){
	return gulp.src("src/index.html")
		.pipe(gulp.dest(webServerRoot));
});

gulp.task('clean-index',function(){
	return gulp.src([webServerRoot+'index.html'])
		.pipe(clean());
});

//vendor
gulp.task('build-vendor-dev', ['clean-vendor'], function(){
	// gulp.src('vendor/jquery/jquery.js')
	// 	.pipe(sourceMaps.init())
	// 	.pipe(sourceMaps.write('../maps'))
	// 	.pipe(gulp.dest(appJsPath));
	gulp.src(['vendor/reset/reset.css',
			  'vendor/ui-bootstrap/ui-bootstrap.css',
			  'vendor/uploader/webuploader.css'])
		.pipe(sourceMaps.init())
		.pipe(concat('vendor.css'))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appCssPath));
	gulp.src([
			'vendor/angular/angular.js',
			'vendor/angular/angular-animate.js',
			'vendor/angular/angular-touch.js',
			'vendor/angular/angular-mocks.js',
			'vendor/angular/angular-sanitize.js',
			'vendor/angular/angular-mocks.js',	
			'vendor/jquery/jquery.js',
			'vendor/ui-bootstrap/bootstrap.js',
			'vendor/angular/angular-ui-router.js',
			'vendor/ui-bootstrap/ui-bootstrap.js',
			'vendor/ui-bootstrap/ui-bootstrap.tpl.js',
			'vendor/uploader/webuploader.min.js'
			// 'vendor/ueditor/ueditor.config.js',
			// 'vendor/ueditor/ueditor.all.min.js'
			])
		.pipe(sourceMaps.init())
		.pipe(concat('angular.js'))
		// .pipe(uglify())
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath));
});

gulp.task('build-vendor-release', ['clean-vendor'], function(){
	// gulp.src('vendor/jquery/jquery.js')
	// 	.pipe(uglify())
	// 	.pipe(gulp.dest(appJsPath));
	gulp.src(['vendor/reset/reset.css',
		      'vendor/ui-bootstrap/ui-bootstrap.css',
			  'vendor/uploader/webuploader.css'])
		.pipe(concat('vendor.css'))
		.pipe(csso())
		.pipe(gulp.dest(appCssPath));
	gulp.src([
			'vendor/angular/angular.js',
			'vendor/angular/angular-animate.js',
			'vendor/angular/angular-touch.js',
			'vendor/angular/angular-mocks.js',
			'vendor/angular/angular-sanitize.js',
			'vendor/angular/angular-mocks.js',	
			'vendor/jquery/jquery.js',
			'vendor/ui-bootstrap/bootstrap.js',
			'vendor/angular/angular-ui-router.js',
			'vendor/ui-bootstrap/ui-bootstrap.js',
			'vendor/ui-bootstrap/ui-bootstrap.tpl.js',
			'vendor/uploader/webuploader.min.js'
			// 'vendor/ueditor/ueditor.config.js',
			// 'vendor/ueditor/ueditor.all.min.js'
						
			])
		.pipe(concat('angular.js'))
	    .pipe(uglify())
		.pipe(gulp.dest(appJsPath));
});

gulp.task('clean-vendor',function(){
	return gulp.src([
		webServerRoot+appCssPath+'*.css',
		//webServerRoot+appJsPath+'jquery.js',
		webServerRoot+appJsPath+'angular.js'])
		.pipe(clean());
});

//less
gulp.task('build-less-dev', ['clean-css'], function(){
	return gulp.src('src/**/*.less')
		.pipe(sourceMaps.init())
		.pipe(less())
		.pipe(concat('mr-demo.css'))
		// .pipe(csso())
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appCssPath));
});

gulp.task('build-less-release', ['clean-css'], function(){
	return gulp.src('src/**/*.less')
		.pipe(less())
		.pipe(concat('mr-demo.css'))
		.pipe(csso())
		.pipe(gulp.dest(appCssPath));
});

gulp.task('clean-css',function(){
	return gulp.src(webServerRoot+appCssPath+'mr-demo.css')
		.pipe(clean());
});

gulp.task('clean-maps',function(){
	return gulp.src(webServerRoot+'maps')
		.pipe(clean());
});

// ---------------------------------------------------------------------------------
// copy image
// ---------------------------------------------------------------------------------
gulp.task('copy-image', ['clean-image'],function() {

    gulp.src('src/images/**/*.*')
        .pipe(gulp.dest('dist/images'));

});
// ---------------------------------------------------------------------------------
// clean image
// ---------------------------------------------------------------------------------
gulp.task('clean-image',function(){
	return gulp.src('dist/images')
		.pipe(clean());
});
// ---------------------------------------------------------------------------------
// copy assets
// ---------------------------------------------------------------------------------
gulp.task('copy-assets', ['clean-assets'],function() {

   return gulp.src(['vendor/**/fonts/*.*'])
        .pipe(gulp.dest('dist/assets'));

});
// ---------------------------------------------------------------------------------
// clean assets
// ---------------------------------------------------------------------------------
gulp.task('clean-assets',function(){
	return gulp.src('dist/assets')
		.pipe(clean());
});

// ---------------------------------------------------------------------------------
// copy ngCordova
// ---------------------------------------------------------------------------------
// gulp.task('copy-ngcordova', function() {
//    return gulp.src('vendor/angular/ng-cordova.js')
//         .pipe(gulp.dest('dist/js'));

// });

gulp.task('generate', ['build-dev','copy-image','copy-assets']);

gulp.task('watch', function() {
    gulp.watch('src/index.html', ['build-index']);
    gulp.watch('src/**/*.tpl.html', ['html2js-dev']);
    gulp.watch('src/**/*.less', ['build-less-dev']);
    gulp.watch(['src/**/*.js'], ['build-js-dev']);
    gulp.watch('src/images/**/*.*', ['copy-image']); 
});

