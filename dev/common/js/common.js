'use strict';
//import objectFitImages from 'object-fit-images';

$(function() {

	// На мобильных при открытии разворачиваем/сворачиваем меню
	//if ($(window).width() < 768) {
		$('.nav-mobile').on('click', function(){
		$('.nav-top').stop().slideToggle(150);
		});

		// Подменю на мобильном
		$('.nav-top__link_has-sub').on('click', function(e){
			e.preventDefault();
			$(this).parent().find('.subnav').stop().slideToggle(150);
		});
	//}

	// Прокрутка
	$(".home-link__button, .reviews-text__button").on("click", function(e){
		var elementClick = $(this).attr("href");
        var destination = $(elementClick).offset().top;

		$('html, body').animate({ scrollTop: destination }, 1100);

		return false;
	});



});
