//http://webdesign-master.ru/blog/tools/2016-03-09-gulp-beginners.html
'use strict';

var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat 		= require('gulp-concat'),
	uglify 		= require('gulp-uglify'),
	pump 		= require('pump'),
	cleancss 	= require('gulp-clean-css'),
	rename	 	= require('gulp-rename'),
	del 		= require('del'),
	spritesmith = require('gulp.spritesmith'),
	imagemin 	= require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant 	= require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache 		= require('gulp-cache'); // Подключаем библиотеку кеширования

	// var devip = require('dev-ip');
	// devip();


var config = {
	sourceDir : 'app/template',
	destDir : 'app/template',
	libsDir : 'app/libs'
};


// обработка scss
gulp.task('scss', function(){
	return gulp.src(config.sourceDir + '/scss/**/*.scss') // Берем источник
		.pipe(sass().on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(gulp.dest(config.destDir + '/css'))  // Выгружаем результата в папку app/css
});


// сжатие css файла
gulp.task('css-libs', ['scss'],  function(){
	return gulp.src('app/template/css/styles.css') // Выбираем файл для минификации
		.pipe(cleancss())  // Сжимаем
		.pipe(rename({suffix: '.min'}))  // Добавляем суффикс .min
		.pipe(gulp.dest('app/template/css')) // Выгружаем в папку app/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
})

// автоперезагрузка страницы браузера
gulp.task('browser-sync', function(){
	browserSync({
		proxy: "subdomain.ambene.local",
		notify: false
	})
});


gulp.task('compress', function(){
	pump([
			gulp.src([  // Берем все необходимые библиотеки
				config.libsDir + '/jquery/dist/jquery.js'
			]),
			concat('libs.min.js'), // Собираем их в кучу в новом файле libs.min.js
			uglify(), // Сжимаем JS файл
			gulp.dest(config.sourceDir + '/js') // Выгружаем в папку app/js
		]
	);
})

// перед сборкой проетка надо сделать очистку папки dist от предыдущих версий
gulp.task('clean', function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});


// отслеживаем изменения
// в квадратных скобках перечисляются таски, которые должны выполниться до watcher (до запуска сервера)
gulp.task('watcher', ['browser-sync', 'css-libs', 'compress'], function(){
	return gulp.watch('app/template/scss/**/*.scss', ['scss', 'css-libs']), // при изменении любого *scss-файла вызываем таск scss
		gulp.watch('app/*.html', browserSync.reload),
		gulp.watch('app/template/js/**/*.js', browserSync.reload)
});



// Удаление старых файлов
gulp.task('sprite-clean', function () {
	del([config.sourceDir + '/images/sprite-*.png']);
});

// Создание спрайтов
gulp.task('sprite-create', ['sprite-clean'], function () {
    // var fileName = 'sprite-' + Math.random().toString().replace(/[^0-9]/g, '') + '.png';
    var fileName = 'sprite.png'

    var spriteData = gulp.src([config.sourceDir + '/images/sprite/*.png', '!' + config.sourceDir + '/images/sprite/buttons.png'])
        .pipe(spritesmith({
            imgName: fileName,
            cssName: '_sprite.scss',
            cssVarMap: function (sprite) {
                sprite.name = 'icon-' + sprite.name;
            },
             imgPath: '../images/' + fileName
        }));

    spriteData.img.pipe(gulp.dest(config.destDir + '/images/'));

    spriteData.css.pipe(gulp.dest(config.sourceDir + '/scss/'));

    return spriteData;
});


gulp.task('img', function() {
    return gulp.src('app/template/images/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/template/images')); // Выгружаем на продакшен
});




gulp.task('build', ['clean', 'img', 'scss', 'compress'], function(){
	// переносим css файлы
	var buildCss = gulp.src([ // Переносим CSS стили в продакшен
		'app/template/css/styles.min.css',
		'app/template/css/owl.carousel.css'
	])
	.pipe(gulp.dest('dist/template/css'));

	var buildFonts = gulp.src(config.sourceDir + '/fonts/**/*').pipe(gulp.dest('dist/template/fonts')); // Переносим шрифты в продакшен
	var buildJs = gulp.src(config.sourceDir + '/js/**/*').pipe(gulp.dest('dist/template/js'));
	var buildHtml = gulp.src('app/*.html').pipe(gulp.dest('dist'));

	var buildOutdate = gulp.src('app/outdatedbrowser/**/*').pipe(gulp.dest('dist/outdatedbrowser'));


	var buildHtaccess = gulp.src('app/.htaccess').pipe(gulp.dest('dist'));	
	var buildrobots = gulp.src('app/robots.txt').pipe(gulp.dest('dist'));	
});



gulp.task('clear', function () {
	return cache.clearAll();
})

gulp.task('default', ['watcher']);

