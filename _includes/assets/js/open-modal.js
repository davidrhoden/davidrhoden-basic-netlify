$(function(){

  var modalCookie = "modal_mailing_list_signup_seen";
  var options = { path: '/', expires: 10 };

  var shouldOpen = $.cookie(modalCookie);

  $("#setCookieButton").click(function(){
    $.cookie(modalCookie, 'see', options);
    return false;
  });
  $("#deleteCookieButton").click(function(){
    $.cookie(modalCookie, null, options);
    return false;
  });

  $('#dialog').jqm();
  if (shouldOpen != "seen") {
    $('#dialog').jqmShow();
    $.cookie(modalCookie, 'see', options);
  };
});