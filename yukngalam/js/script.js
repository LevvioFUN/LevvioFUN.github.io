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
/* date-picker  */
$( function() {
    $( "#datepicker" ).datepicker();
} );
// /* drag_object  */
// $( function() {
//     $( "#draggable" ).draggable();
//     $( "#droppable" ).droppable({
//         drop: function( event, ui ) {
//             $( this )
//                 .addClass( "ui-state-highlight" )
//                 .find( "p" )
//                 .html( "Dropped!" );
//         }
//     });
// } );
$(".drag-item").draggable({
    start: function () {
        var $draggedElement = $(this);
        var startingDroppable = $draggedElement.parents('.droppable').get(0);
        $draggedElement.data('aStartingDroppable', startingDroppable);
    },
    revert: function (dropTarget) {
        $(this).data("uiDraggable").originalPosition = {
            top: 0,
            left: 0
        };
        var startingDroppable = $(this).data('aStartingDroppable');
        return dropTarget === false || startingDroppable === dropTarget.get(0);
    }
});//Added drag function

$(".droppable").droppable({
    tolerance: 'touch',
    drop: function (event, ui) {
        var $draggedElement = ui.draggable;
        var draggedElementStartingDroppable = $draggedElement.data('aStartingDroppable');

        if (draggedElementStartingDroppable !== this) {
            $draggedElement
                .css({left: 'auto', top: 'auto'})
                .appendTo(this);

            var $draggedElementStartingDroppable = $(draggedElementStartingDroppable);
            if ($draggedElementStartingDroppable.children().length === 0) {
                $draggedElementStartingDroppable.empty();
            }
        }
    }
});//Added drop function
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