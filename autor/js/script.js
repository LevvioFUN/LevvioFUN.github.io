$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        nav: true,
        navText: ["<img src='img/left.png'>","<img src='img/right.png'>"],
        loop:true,
        items:1,
        autoplay:true,
        smartSpeed:1000
    });
});