if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

$(document).ready(function(){
  var $hamburger = $(".hamburger");
  $hamburger.on("click", function(e) {
    $hamburger.toggleClass("is-active");
    $("nav").toggleClass("is-active");
	});
});

$(document).ready(function(){
  AOS.init();
});

function showHidden() {
  var hiddenText = $(this).find(".hidden").html();
  $("#timeline-detail").html(hiddenText);
};

$(document).ready(function(){
  $( ".photo-timeline" ).on( "mouseover", ".photo-timeline-link", showHidden );
});
