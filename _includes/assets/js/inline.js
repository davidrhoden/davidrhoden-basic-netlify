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


$('.scroll-container').scroll(function() {
    $('#scroll-text').fadeOut();
}); 


$(document).ready(function(){
  $('.link').each( function(i) {
    $('.button-row').on( 'click', '.link', function( event ) {
      console.log($(this));
      $($(this).attr('href')).addClass('is-active').siblings().removeClass('is-active');
      $(this).addClass('is-active').siblings().removeClass('is-active');
      event.preventDefault();
    });
  });
});
