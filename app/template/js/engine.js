$(document).ready(function(){

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
		console.log("policy");
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


});

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
