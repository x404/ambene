$(document).ready(function(){
	'use strict';

	$.fn.ForceNumericOnly =
	function(){
		return this.each(function()	{
			$(this).keydown(function(e){
				var key = e.charCode || e.keyCode || 0;
				// Разрешаем backspace, tab, delete, стрелки, обычные цифры и цифры на дополнительной клавиатуре
				return (
					key == 8 ||
					key == 9 ||
					key == 46 ||
					(key >= 37 && key <= 40) ||
					(key >= 48 && key <= 57) ||
					(key >= 96 && key <= 105));
			});
		});
	};

	

	// scroll page
	$('nav a[href*=\\#]:not([href=\\#]), .visual__button, .toTop').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top-98
				}, 1000);
				return false;
			}
		}
	});


	var thank = '<div class="thank text-center"><p>Спасибо за заказ продукта на нашем сайте. В ближайщее время с вами свяжутся наши менеджеры для уточнения всех деталей.</p></div>';
	var thankcallback = '<div class="thank text-center"><p>В ближайщее время с вами свяжутся наши менеджеры для уточнения всех деталей.</p></div>';
	var thankreview = '<div class="thank text-center"><p>Спасибо за оставленный отзыв.</p></div>';
	var thankqorder = '<div class="thank text-center"><p>Спасибо за заказ продукта на нашем сайте. В ближайщее время с вами свяжутся наши менеджеры для уточнения всех деталей.</p></div>';
	var errorTxt = 'Возникла ошибка при отправке заявки!';


	// validation quick form
	$('#callback-form .submit').click(function(){
		$('#callback-form').submit();
		return false;
	});
	$('#callback-form').validate({
		submitHandler: function(form){
			$('#callback-form').html(thankcallback);

			startClock('callback-form');
			// strSubmit=$(form).serialize();
			// $.ajax({type: "POST",url: "/order.ajax.php",data: strSubmit,
			// 	success: function(){
			// 		$('#orderModal').modal('hide').find('.form-control').val('');
			// 		$('body').append('<div class="modal-backdrop fade in"></div>');
			// 		$('body').addClass('modal-open');
			// 		$('body').append(thank);
			// 	}
			// }).fail(function(error){alert(errorTxt)});
		}
	}); 




	$('#addreview-form .submit').click(function(){
		$('#addreview-form').submit();
		return false;
	});
	$('#addreview-form').validate({
		submitHandler: function(form){
			$('#addreview-form').html(thankreview);
			startClock('addreview-form');
		}
	}); 



	$('#qorder-form .submit').click(function(){
		$('#qorder-form').submit();
		return false;
	});
	$('#qorder-form').validate({
		submitHandler: function(form){
			// $('#qorder-form').html(thankreview);
			$('.qorder__box').append(thankqorder);
			startClock('qorder-form');
		}
	});



	$('#feedback-form .submit').click(function(){
		$('#feedback-form').submit();
		return false;
	});
	$('#feedback-form').validate({
		submitHandler: function(form){
			$('.feedback__form').append(thankcallback);
			$('.feedback__form fieldset').hide();
			startClock('feedback-form');
		}
	});




	// карусель
	$('#foo1').owlCarousel({
		loop:false,
		nav:true,
		dots: false,
		items:1,
		autoplay : false,
		navText: ["", ""]
	});

	$('.policy input').click(function(){
		var $this = $(this),
			$submit = $this.closest('.form-policy');

		if ($this.is(':checked')){
			$submit.find('.input, .form-control, .submit, textarea, input[type=radio]').removeAttr('disabled');
		} else {
			$submit.addClass('disabled');
			$submit.find('.input, .form-control, .submit, textarea, input[type=radio]').attr('disabled', true);
		}
	})

	// mobile-menu
	$('#navbar').each(function(){
		var $this = $(this),
			$link = $('.navbar-toggle'),
			$close = $('.close-menu'),

			init = function(){
				$link.on('click', openMenu);
				$close.on('click', closeMenu);
			},
			openMenu = function(e){
				e.preventDefault();
				var h = $(window).height();
				$('body').addClass('o-menu');
				$('#navbar').height(h);
			},
			closeMenu = function(e){
				e.preventDefault();
				$('body').removeClass('o-menu');
				$('#navbar').height('auto');
			};
		init();
	});	



	$(window).resize(function(){
		if ($('body').width() > 640) {
			$('body').removeClass('o-menu');
			$('#navbar').css('height', 'auto');
		}
	});



	$('#infomodal').on('show.bs.modal', function (e) {
		let $this = $(e.relatedTarget),
			id = $this.data('id'),
			title = $this.data('title'),
			url = id,
			posting = $.post(id);




		// posting.done(function(data) {
		// });

		ajax('/' + url, 'POST').then(function(data) {
			$('#infomodal .title').text(title);
			$('#infomodal .modal__text').html(data);
		});
	});


	// products counters
	$('.products__count .plus').on('click', function(e){
		e.preventDefault();
		let $this = $(this),
			form = $this.closest('form'),
			submit = form.find('.products__submit'),
			priceEl = form.find('.products__price span'),
			countEl = $this.prev('input'),
			price = countEl.data('price');

		var cnt = parseInt(countEl.val())+1,
			cost = 0;

		cost = cnt *  price;
		countEl.val(cnt);
		priceEl.text(splitNums('.', cost.toString()));
		$('.products__tab-cell').find('.products__submit-active').removeClass('products__submit-active');
		submit.addClass('products__submit-active');
		submit.removeAttr('disabled');
	});

	$('.products__count .minus').on('click', function(e){
		e.preventDefault();
		let $this = $(this),
			form = $this.closest('form'),
			submit = form.find('.products__submit'),
			priceEl = $this.closest('form').find('.products__price span'),
			countEl = $this.next('input'),
			price = countEl.data('price');

		var cnt = parseInt(countEl.val())-1,
			cost = 0;


		$('.products__tab-cell').find('.products__submit-active').removeClass('products__submit-active');

		if ( cnt <= 0 ) {
			cnt = 0;
			submit.prop('disabled', 'disabled');
		} else {
			submit.addClass('products__submit-active');			
		};

		cost = cnt *  price;
		countEl.val(cnt);
		priceEl.text(splitNums('.', cost.toString()));

	});


	/*  =cart */
	//delete row
	$(".cart__table .del").click(function(e){
		e.preventDefault();
		let $this = $(this);
		if ($this.closest("table").find("tr").length<=1){
			$this.closest("tr").addClass("remove").fadeOut("slow", function(){
				$this.closest("form").remove();
				// costOne();
			})
		} else {
			$this.closest("tr").addClass("remove").fadeOut("slow", function(){
				$("tr.remove").remove();
				// costOne();
			});
		};
	})


	// products counters

	$('.cart__table .count').ForceNumericOnly();

	$('.cart__table .plus').on('click', function(e){
		e.preventDefault();
		let $this = $(this),
			priceEl = $this.closest('tr').find('.cost'),
			countEl = $this.prev('input'),
			price = countEl.data('price');

		var cnt = parseInt(countEl.val()) + 1,
			cost = 1;

		cost = cnt *  price;
		countEl.val(cnt);
		priceEl.text(splitNums('.', cost.toString()));
	});	


	$('.cart__table .minus').on('click', function(e){
		e.preventDefault();
		let $this = $(this),
			priceEl = $this.closest('tr').find('.cost'),
			countEl = $this.next('input'),
			price = countEl.data('price');

		var	cnt = parseInt(countEl.val()) - 1,
			cost = 0;

		if ($this.data('flag') == 'additional'){
			(cnt <= 0) ? cnt = 0 : '';
		} else{
			(cnt <= 1) ? cnt = 1 : '';
		}
		cost = cnt *  price;
		countEl.val(cnt);
		priceEl.text(splitNums('.', cost.toString()));
	});

	$('.cart__table .reset').on('click', function(e){
		e.preventDefault();
		let $this = $(this);

		$this.closest('tr').find('.count').val('0');
	});


	$('.cart__table .count').keyup(function() {
		let $this = $(this),
			priceEl = $this.closest('tr').find('.cost'),
			price = $this.data('price');
		
		var cnt = 0,
			cost = 0;

		console.log(cnt);
		cnt = $(this).val(),

		cost = cnt *  price;
		priceEl.text(splitNums('.', cost.toString()));
	});
});


function splitNums(delimiter, str){   
	str = str.replace(/(\d+)(\.\d+)?/g,
	function(c,b,a){return b.replace(/(\d)(?=(\d{3})+$)/g, '$1'+delimiter) + (a ? a : '')});
		return str;
}





function ajax(url, method, data) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();
		request.responseType = 'text';
		request.onreadystatechange = function() {
			if (request.readyState === XMLHttpRequest.DONE) {
				if (request.status === 200) {
					resolve(request.responseText);
				} else {
					reject(Error(request.statusText));
				}
			}
		};
		request.onerror = function() {
			reject(Error("Network Error"));
		};
		request.open(method, url, true);
		request.send(data);
	});
}



// new Vue({
// 	el: "#app",
// 	data() {
// 		return {
// 			qty : 0
// 		}
// 	},
// 	methods: {
// 		inc: function(event){
// 			console.log($(event.currentTarget));
// 			this.qty++;
// 		},
// 		dec: function(event){
// 			this.qty--;
// 			// if (item.qty <= 0){
// 			// 	qty = 0;
// 			// }
// 		}
// 	}
// })




// =заглушка для IE
//event listener: DOM ready
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
//call plugin function after DOM ready
addLoadEvent(function(){
	outdatedBrowser({
		bgColor: '#f25648',
		color: '#ffffff',
		lowerThan: 'transform',
		languagePath: '/outdatedbrowser/lang/ru.html'
	})
});
// =/заглушка для IE




var map;
var myCollection;	
ymaps.ready(function () {
	map = new ymaps.Map('ymap', {
		center: [55.764014, 37.655299],
		zoom: 16
	});

	myCollection = new ymaps.GeoObjectCollection(null, {
		preset: 'islands#redDotIcon'
	});
	myCollection.add(new ymaps.Placemark(
		[55.764394, 37.655095],
		{
			hintContent: 'Ambene',
			balloonContent: 'Садовая-Черногрязская улица, 22с1'
		}
	));

	map.behaviors.disable('scrollZoom'); 

	map.geoObjects.add(myCollection);

	map.events.add('click', function onMapClick(e) {
		if(map.behaviors.isEnabled('scrollZoom')) {
			map.events.remove('click', onMapClick);
		} else {
			map.behaviors.enable(['scrollZoom']);
		}
	});
})


var timer,
	sec = 3;


function showTime(sendform){
	sec = sec-1;
	if (sec <=0) {
		stopClock();

		switch (sendform){
			case 'qorder-form':
				$('.qorder__box .thank').fadeOut('normal',function(){
					$('.qorder__box .thank').remove();
					$('.qorder__box .form-control, .qorder__box textarea').val('');
				});
				break;
			case 'feedback-form':
				$('.feedback .thank').fadeOut('normal',function(){
					$('.feedback .thank').remove();
					$('.feedback .form-control, .feedback textarea').val('');
					$('.feedback__form fieldset').show();
				});
				break;				
			default:
				modal = $("#" + sendform).closest('.modal');
				modal.fadeOut('normal',function(){
					modal.modal('hide');
				});
				break;
		}
	}
}
function stopClock(){
	window.clearInterval(timer);
	timer = null;
	sec = 3;
}

function startClock(sendform){
	if (!timer)
		timer = window.setInterval("showTime('" + sendform + "')",1000);
}