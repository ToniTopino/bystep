$(document).ready(function(){

    $('.section_4_slider').slick({
        arrows: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        prevArrow: '<button type="button" class="slick-arrow slick-prev"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>',
		nextArrow: '<button type="button" class="slick-arrow slick-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>',
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: false
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 451,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
      });





  });