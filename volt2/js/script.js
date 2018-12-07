$(function () {

    var carousel1 = $('.sertificates .carousel').owlCarousel({
        responsive: {
            0: {
                items: 1,
            },
            767: {
                items: 3
            },
            991: {
                items: 5
            },
            1200: {
                items: 6
            }
        },
        margin: 30,
        nav: true,
        navText: ['', '']
    });

    var carousel1 = $('.partners .carousel').owlCarousel({
        responsive: {
            0: {
                items: 3,
            },
            767: {
                items: 5
            },
            991: {
                items: 6,
                margin: 30
            },
            1200: {
                items: 8,
                margin: 80
            }
        },
        nav: true,
        navText: ['', '']
    });


});

//--------------------------------------SCRIPT_FOR_MOBILE_MENU---------------------------//

$(".mobmenu").click(function (e) {
    e.preventDefault();
    $("#mobile-menu").toggleClass('active', 500);
});

$("#bottom-nav-ul .menu-item").click(function () {

    if ($(this).children("#sub").css("display") == "none") {
        $("[id=sub]").slideUp(300);
        $(this).children().slideDown(300);
    }
});

$('.drop-list').append("<span id='angle'>></span>");

























