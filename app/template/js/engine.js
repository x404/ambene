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
				h = $(document).height();
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
