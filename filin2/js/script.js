$(document).ready(function(){
    $("#navanim").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
});

$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        nav: true,
        navText: ["<img src='img/left.png'>", "<img src='img/right.png'>"],
        loop: true,
        items: 1,
        autoplay: true,
        smartSpeed: 1000
    });
});

$(document).ready(function () {
    $(window).bind('scroll', function () {

        var navHeight = $(window).height() - 70;

        if ($(window).scrollTop() > navHeight) {
            $('nav').addClass('fixed');
        }
        else {
            $('nav').removeClass('fixed');
        }
    });
});
