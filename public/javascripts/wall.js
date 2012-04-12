function wall() {
  
  //$('*').css('border', '1px solid red');
/*
  $("a.photo_group").fancybox({
      'titlePosition'       : 'over',
      'showCloseButton'     : false,
      'showNavArrows'       : true,
      'autoScale'           : true
  });
*/
  $('#submit').submit(function(e) {
    e.preventDefault();
    dataString = $('#submit').serialize();
    $.ajax({
      type: "POST",
      url: "/msg",
      data: dataString,
      success: function(data) {
        $(data).hide().appendTo('.panel').fadeIn("slow");
      },
      error: function(xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        //alert(thrownError);      
      }
    });
  });
}
