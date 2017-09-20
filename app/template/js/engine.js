$(document).ready(function(){
	'use strict';


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



	// validation quick form
	$('#callback-form .submit').click(function(){
		$('#callback-form').submit();
		return false;
	});
	$('#callback-form').validate();


	$('#addreview-form .submit').click(function(){
		$('#addreview-form').submit();
		return false;
	});
	$('#addreview-form').validate();


	$('#qorder-form .submit').click(function(){
		$('#qorder-form').submit();
		return false;
	});
	$('#qorder-form').validate();


	$('#feedback-form .submit').click(function(){
		$('#feedback-form').submit();
		return false;
	});
	$('#feedback-form').validate();



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
			price = countEl.data('price'),
			cnt = parseInt(countEl.val())+1,
			cost = 1;

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
			price = countEl.data('price'),
			cnt = parseInt(countEl.val())-1,
			cost = 1;


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
	$('.cart__table .plus').on('click', function(e){
		e.preventDefault();
		let $this = $(this),
			priceEl = $this.closest('tr').find('.cost'),
			countEl = $this.prev('input'),
			price = countEl.data('price'),
			cnt = parseInt(countEl.val()) + 1,
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
			price = countEl.data('price'),
			cnt = parseInt(countEl.val()) - 1,
			cost = 1;

		(cnt <= 1) ? cnt = 1 : '';
		cost = cnt *  price;
		countEl.val(cnt);
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