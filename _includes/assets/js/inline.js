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
    // Do something else, like open/close menu
    $("nav").toggleClass("is-active");
	});
});


$(document).ready(function() {
    var i = 0; 
    var imgs = $('.home main').children();
    runIt(imgs);

    function runIt() {
      $(imgs).eq(i).fadeIn(2000, function() {
        setTimeout(runIt,'300');
      });
      i = i + 1; 
      if (i == imgs.length) {
        i = 0; 
        $('.home main p').fadeOut(1000)
      } 
    }
});

function showHidden() {
  var hiddenText = $(this).parent().find(".hidden").text();
  console.log(hiddenText);
  $("#timeline-detail").html(hiddenText);
};

$(document).ready(function(){
  $( ".photo-timeline" ).on( "mouseover", ".tiny-thumbnail", showHidden );
});