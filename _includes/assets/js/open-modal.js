$(function(){

  var modalCookie = "modal_mailing_list_signup_seen";
  var options = { path: '/', expires: 10 };

  var shouldOpen = $.cookie(modalCookie);

  if (shouldOpen != "seen") {
    // Wait 5 seconds before showing the modal
    setTimeout(function() {
      $('#dialog').jqm().jqmShow();
      $.cookie(modalCookie, 'seen', options);
    }, 5000);
  };
});