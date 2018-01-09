$(document).ready(function () {
    /*--------------------------------------------FIXED_NAVBAR---------------------------------------------*/
    $(".navbar_fixed").removeClass("default");
    $(window).scroll(function () {
        if ($(this).scrollTop() > 10) {
            $(".navbar_fixed").addClass("default").fadeIn('fast');
        }
        else {
            $(".navbar_fixed").removeClass("default").fadeIn('fast');
        }
    });
    /*--------------------------------------------OWL_CAROUSEL---------------------------------------------*/
    $(".owl-slide_one").owlCarousel({
        loop: true,
        items: 1,
        margin: 0,
        autoplay: true,
        smartSpeed: 1000,
        navText: ["<i class=\"fa fa-angle-left\" aria-hidden=\"true\"></i>", "<i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i>"]
    });
    //
    $(".owl-slide_two").owlCarousel({
        loop: true,
        items: 1,
        margin: 10,
        autoplay: true,
        smartSpeed: 1000,
    });
    /*--------------------------------------------BUTTON_SCROLL---------------------------------------------*/
    $("#link").on("click", "a", function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
    /*--------------------------------------------FILTER_GALLERY---------------------------------------------*/
    $(".filter-button").click(function () {
        var value = $(this).attr('data-filter');
        if (value == "all") {
            //$('.filter').removeClass('hidden');
            $('.filter').show('1000');
        }
        else {
            $(".filter").not('.' + value).hide('3000');
            $('.filter').filter('.' + value).show('3000');
        }
    });
    if ($(".filter-button").removeClass("active")) {
        $(this).removeClass("active");
    }
    $(this).addClass("active");
    /*--------------------------------------------IMAGE_GALLERY---------------------------------------------*/
    $('a[data-rel^=lightcase]').lightcase();
    /*--------------------------------------------WOW_EFFECTS---------------------------------------------*/
    new WOW().init();
    /*--------------------------------------------NUMBER_COUNTER---------------------------------------------*/
    var time = 2, cc = 1;
    $(window).scroll(function () {
        $('#counter').each(function () {
            var
                cPos = $(this).offset().top,
                topWindow = $(window).scrollTop();
            if (cPos < topWindow + 200) {
                if (cc < 2) {
                    $('.number').addClass('viz');
                    $('div').each(function () {
                        var
                            i = 1,
                            num = $(this).data('num'),
                            step = 1000 * time / num,
                            that = $(this),
                            int = setInterval(function () {
                                if (i <= num) {
                                    that.html(i);
                                }
                                else {
                                    cc = cc + 2;
                                    clearInterval(int);
                                }
                                i++;
                            }, step);
                    });
                }
            }
        });
    });
    /*--------------------------------------------BUTTON_TO_TOP---------------------------------------------*/
    $(window).scroll(function () {
        if ($(this).scrollTop() != 0) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').click(function () {
        $('body,html').animate({scrollTop: 0}, 800);
    });
});