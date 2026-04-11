/*jshint esversion: 6 */
if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", (user) => {
    if (!user) {
      window.netlifyIdentity.on("login", () => {
        document.location.href = "/admin/";
      });
    }
  });
}

$(document).ready(function () {
  var $hamburger = $(".hamburger");
  $hamburger.on("click", function (e) {
    $hamburger.toggleClass("is-active");
    $("nav").toggleClass("is-active");
  });
});

$(document).ready(function () {
  AOS.init();
});

function showHidden() {
  var hiddenText = $(this).closest(".text-timeline-entry").find(".hidden").html();
  $("#timeline-detail").html(hiddenText);
}

$(document).ready(function () {
  $(".photo-timeline").on("mouseover", ".photo-timeline-link", showHidden);
  $("#text-timeline").on("mouseover", ".text-timeline-link", showHidden);
});

$(".scroll-container").scroll(function () {
  $("#scroll-text").fadeOut();
});

$(document).ready(function () {
  $("#bricks ul li, #bricks ol li").magnificPopup({
    delegate: "a",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1],
    },
    type: "image",
    // other options
  });
});

$(document).ready(function () {
  $(".link").each(function (i) {
    $(".button-row").on("click", ".link", function (event) {
      console.log($(this));
      $($(this).attr("href"))
        .addClass("is-active")
        .siblings()
        .removeClass("is-active");
      $(this).addClass("is-active").siblings().removeClass("is-active");
      event.preventDefault();
    });
  });
});

$(document).ready(function () {
  var currentImage = 0;
  var images = $("#viewport img").get();
  var totalImages = images.length;
  var firstImage = $("#viewport img:first");
  var altText = $(firstImage).attr("alt");
  firstImage.addClass("fadedIn");
  $("#caption").html(altText);

  function increaseImage() {
    ++currentImage;
    if (currentImage > totalImages - 1) {
      currentImage = 0;
    }
  }
  function decreaseImage() {
    --currentImage;
    if (currentImage < 0) {
      currentImage = totalImages - 1;
    }
  }

  $("#buttonPrevious").on("click", function () {
    $(images[currentImage]).stop().removeClass("fadedIn");
    decreaseImage();
    $(images[currentImage]).stop().addClass("fadedIn");
    altText = $(images[currentImage]).attr("alt");
    $("#caption").html(altText);
  });
  $("#buttonNext").on("click", function () {
    $(images[currentImage]).stop().removeClass("fadedIn");
    increaseImage();
    $(images[currentImage]).stop().addClass("fadedIn");
    altText = $(images[currentImage]).attr("alt");
    $("#caption").html(altText);
  });

  // Cookie helper functions
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Apply saved preference on page load
  const savedSort = getCookie('tagsListSort');
  if (savedSort) {
    if (savedSort === 'sort_by_count') {
      $(".tag-lists").toggleClass("active");
      $(".tags-list").toggleClass("active");
    }
  }

  $(".tag-lists").on("click", function (event) {
    event.preventDefault();
    const clickedHref = $(this).attr("href");
    const sortPreference = clickedHref === "#tags-number-of-posts" ? "sort_by_count" : "sort_alphabetical";
    
    // Set cookie for 6 months (180 days)
    setCookie('tagsListSort', sortPreference, 180);
    
    $(".tag-lists").toggleClass("active");
    $(".tags-list").toggleClass("active");
  });

  $(".tab-selector").on("click", function (event) {
    event.preventDefault();
    $(".tab-selector").toggleClass("active");
    $(".tab").toggleClass("active");
  });

    MicroModal.init();

    $('#nav-link-search').click(function(ev) {
      MicroModal.show('modal-search', {
          onClose: function() { $('.nav-link-contact').blur(); },
          disableFocus: true
      });
      document.querySelector('.pagefind-ui__search-input').focus();
    });

    $('#onetalker-trigger').on('click', function() {
      var isMobile = window.innerWidth <= 767;
      var $trigger = $(this);
      
      if (isMobile) {
        // On mobile: two-step interaction
        if (!$trigger.hasClass('active')) {
          // First click: show bubble and talking state
          $trigger.addClass('active');
        } else {
          // Second click: open modal
          $trigger.addClass('modal-open').removeClass('active');
          MicroModal.show('modal-onetalker', {
            onClose: function() {
              $('#onetalker-trigger').removeClass('modal-open');
            },
            disableFocus: true
          });
        }
      } else {
        // On desktop: one click opens modal
        $trigger.addClass('modal-open');
        MicroModal.show('modal-onetalker', {
          onClose: function() {
            $('#onetalker-trigger').removeClass('modal-open');
          },
          disableFocus: true
        });
      }
    });
});
