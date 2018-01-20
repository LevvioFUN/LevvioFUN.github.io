$(document).ready(function () {
    /*--------------------------------------------FIXED_NAVBAR---------------------------------------------*/
    $(".navbar_fixed").removeClass("default");
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $(".navbar_fixed").addClass("default").fadeIn('fast');
        }
        else {
            $(".navbar_fixed").removeClass("default").fadeIn('fast');
        }
    });
    /*--------------------------------------------SCROLL_BUTTON---------------------------------------------*/
    $(".link").on("click", "a", function (event) {
        event.preventDefault();
        var id = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
    //E-mail Ajax Send
    $("form").submit(function() { //Change
        var th = $(this);
        $.ajax({
            type: "POST",
            url: "mail.php", //Change
            data: th.serialize()
        }).done(function() {
            alert("Thank you!");
            setTimeout(function() {
                // Done Functions
                th.trigger("reset");
            }, 1000);
        });
        return false;
    });
    /*--------------------------------------------WOW_EFFECTS---------------------------------------------*/
    new WOW().init();
});