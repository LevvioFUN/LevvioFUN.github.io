/* scroll-btn  */
$(document).ready(function () {
    $("#link").on("click", "a", function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
});
/* owl-carousel  */
$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        loop: true,
        items: 1,
        margin: 10,
        autoplay: true,
        smartSpeed: 1000
    });
});
/* filter-gallery  */
$(document).ready(function () {
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
});