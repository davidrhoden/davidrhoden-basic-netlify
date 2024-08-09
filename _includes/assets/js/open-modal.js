$(function(){

  var modalCookie = "modal_mailing_list_signup_seen";
  var options = { path: '/', expires: 10 };

  var shouldOpen = $.cookie(modalCookie);

  $('#dialog').jqm();
  if (shouldOpen != "seen") {
    $('#dialog').jqmShow();
    $.cookie(modalCookie, 'seen', options);
  };
});