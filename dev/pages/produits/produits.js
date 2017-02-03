'use strict';
import stick_in_parent from 'sticky-kit/dist/sticky-kit.js'
import GoogleMapsLoader from 'google-maps';
import slick from 'slick-carousel';

$(function(){

    // боковая панель
    const $sticky_sidebar = $(".product-contact");

    function toggle_sticky () {
        if ($(window).width() > 1024) {
            $sticky_sidebar.stick_in_parent({
                inner_scrolling: false
            });
        }
        else $sticky_sidebar.trigger('sticky_kit:detach');
    }

    $(window).on('resize', function() { toggle_sticky(); }).trigger('resize');



  $(window).on('resize', function(){
    $(window).width() > 768 ? $('.nav-top').css('display', 'block') : $('.nav-top').css('display', 'none')
  });

  // гугл карты
  GoogleMapsLoader.load(function(google) {
      var mapCanvas = document.getElementById("mapGoogle");
      var mapOptions = {
        center: new google.maps.LatLng(45.7181698,-1.1064613),
        zoom: 8,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        rotateControl: false
      };

      var map = new google.maps.Map(mapCanvas, mapOptions);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(45.6247091,-1.0284325),
        icon: '/img/map-icon.png'
      });

      marker.setMap(map);
  });

  // Слайдер

  $(".reviews-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    //autoplay: true
  })



});
