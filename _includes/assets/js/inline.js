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


$(document).ready(function() {
  
  var currentImage = 0;
  var images = $('#viewport img').get();
  var totalImages = images.length;
  var firstImage = $('#viewport img:first');
  console.log("firstImage: ", firstImage);
  console.log("currentImageindex: ", currentImage);
  console.log("images[currentImage]: ",images[currentImage]);
  var altText = $(firstImage).attr("alt");
  console.log(altText);
  firstImage.addClass("fadedIn");
  $('#caption').html(altText);

  function increaseImage() {
    ++currentImage;
    if(currentImage > (totalImages - 1)) {
      currentImage = 0;
    }
  }
  function decreaseImage() {
    --currentImage;
    if(currentImage < 0) {
      currentImage = (totalImages - 1);
    }
  }

  $('#buttonPrevious').on('click', function(){
    $(images[currentImage]).stop().removeClass('fadedIn');
    console.log($(images[currentImage]));
    decreaseImage();
      console.log(currentImage);
    $(images[currentImage]).stop().addClass('fadedIn');
    altText = $(images[currentImage]).attr("alt");
    $('#caption').html(altText);
  }); 
  $('#buttonNext').on('click', function(){
    $(images[currentImage]).stop().removeClass('fadedIn');
    console.log($(images[currentImage]));
    increaseImage();
      console.log(currentImage);
    $(images[currentImage]).stop().addClass('fadedIn');
    altText = $(images[currentImage]).attr("alt");
    $('#caption').html(altText);
  });

});