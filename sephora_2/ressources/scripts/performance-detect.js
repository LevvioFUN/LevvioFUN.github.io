var listResource = [];
var scope = angular.element('body').scope();

$('.searchImp').on('input', function(){
  getAllResources();
  $(this).parent().next().html(" ");
  checkSearch($(this).val(), $(this), listResource);
}); 

$('.searchClick').on('input', function(){
  $(this).parent().next().html(" ");
  checkSearch($(this).val(), $(this), scope.demoRedirect);
}); 

$('.creative').click(function(){
  $('p.notes-demo').css('display', 'none');
  $('.searchClick').prop( "disabled", false );
}); 

function checkSearch(search, elem, arr){
  var bool = false;
  for (var i = 0; i < arr.length; i++) {
    if ((arr[i].name.indexOf(search) !== -1)&&(search !=='')) {
      bool = true;
      $(elem).parent().next().append( "<p>" + arr[i].name + "</p>" );
    }
  }
  if(bool) {
    $(elem).next().css('background-color', 'green');
  }
  else{
    $(elem).next().css('background-color','red');
    $(elem).parent().next().html("<p class='red'>Not found<p> ");
  }
  if (search =='') {
    $(elem).next().css('background-color', 'white');
    $(elem).parent().next().html(" ");
  }
}

function getAllResources(){
  listResource = []
  if (performance === undefined) {
    console.log("Display Resource Data: peformance NOT supported");
    return;
  }
  var list = window.performance.getEntriesByType("resource");
  if (list === undefined) {
    console.log("Display Resource Data: peformance.getEntriesByType() is  NOT supported");
    return;
  }
  for (var i = 0; i < list.length; i++) {
      listResource.push({ id: i + 1, type: list[i].initiatorType, name: list[i].name });
  }

}


$('.add-link').data('counter', 0).click(function() {
    var counter = $(this).data('counter');    
    $(this).data('counter', counter + 1);                 
});

function clone(name){
  var id = name + $('.add-link').data('counter');
  $('.add-link').data('counter', 0)   
  $("div#" + name).clone(true, true).appendTo(".content-" + name).attr('id', id);

}

