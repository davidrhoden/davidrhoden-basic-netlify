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

// ----- init functions -----

function initHamburger() {
  var $hamburger = $(".hamburger");
  $hamburger.on("click", function (e) {
    var $this = $(this);
    var expanded = $this.attr("aria-expanded") === "true";
    $this.attr("aria-expanded", expanded ? "false" : "true");

    $this.toggleClass("is-active");
    $("nav").toggleClass("is-active");
  });
}

function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init();
  }
}

function showHidden() {
  var hiddenText = $(this).find(".hidden").html();
  $("#timeline-detail").html(hiddenText);
}

function initTimelines() {
  // Legacy 2021 photo timeline hover behavior (parked for now).
  // If you restore the photo timeline strip UI, uncomment this line.
  // $(".photo-timeline").on("mouseover", ".photo-timeline-link", showHidden);

  // Keep text timeline hover behavior active.
  $("#text-timeline").on("mouseover", ".text-timeline-link", showHidden);
}

function initScrollHint() {
  $(".scroll-container").scroll(function () {
    $("#scroll-text").fadeOut();
  });
}

function initBricksPopup() {
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
}

function initButtonRowLinks() {
  $(".button-row").on("click", ".link", function (event) {
    console.log($(this));
    $($(this).attr("href"))
      .addClass("is-active")
      .siblings()
      .removeClass("is-active");
    $(this).addClass("is-active").siblings().removeClass("is-active");
    event.preventDefault();
  });
}

function initSlideshowAndUI() {
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

  $(".tag-lists").on("click", function (event) {
    event.preventDefault();
    $(".tag-lists").toggleClass("active");
    $(".tags-list").toggleClass("active");
  });

  // Legacy 2021 tab UI behavior (parked for now).
  // If you add back tabbed sections using .tab-selector / .tab, restore this block.
  /*
  $(".tab-selector").on("click", function (event) {
    event.preventDefault();
    $(".tab-selector").toggleClass("active");
    $(".tab").toggleClass("active");
  });
  */

  MicroModal.init();

  $("#nav-link-search").click(function (ev) {
    MicroModal.show("modal-search", {
      onClose: function () {
        $(".nav-link-contact").blur();
      },
      disableFocus: true,
    });
    document.querySelector(".pagefind-ui__search-input").focus();
  });
}

// ----- single document.ready -----

$(document).ready(function () {
  initHamburger();
  initAOS();
  initTimelines();
  initScrollHint();
  initBricksPopup();
  initButtonRowLinks();
  initSlideshowAndUI();
});