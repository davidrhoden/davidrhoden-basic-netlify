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
    $(".nav-mobile").toggleClass("is-active");
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

    document.querySelectorAll('.recent-posts-carousel').forEach(function(carousel) {
      var viewport = carousel.querySelector('.recent-posts-viewport');
      var prevBtn = carousel.querySelector('.carousel-btn-prev');
      var nextBtn = carousel.querySelector('.carousel-btn-next');

      function getScrollAmount() {
        var card = viewport.querySelector('.recent-post-card');
        if (!card) return 300;
        var gap = parseFloat(window.getComputedStyle(viewport.querySelector('.recent-posts-track')).gap) || 32;
        return card.offsetWidth + gap;
      }

      function updateButtons() {
        prevBtn.disabled = viewport.scrollLeft <= 0;
        nextBtn.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 1;
      }

      prevBtn.addEventListener('click', function() {
        viewport.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', function() {
        viewport.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });

      viewport.addEventListener('scroll', updateButtons);

      requestAnimationFrame(function() {
        viewport.style.scrollBehavior = 'auto';
        viewport.scrollLeft = viewport.scrollWidth - viewport.clientWidth;
        viewport.style.scrollBehavior = '';
        updateButtons();
      });
    });

    $('#nav-link-search').click(function(ev) {
      MicroModal.show('modal-search', {
          onClose: function() { $('.nav-link-contact').blur(); },
          disableFocus: true
      });
      document.querySelector('.pagefind-ui__search-input').focus();
    });

    if (getCookie('mailSignupDismissed') || getCookie('mailSignupCompleted')) {
      $('.footer-card-anchor, .mail-signup-card-inline').hide();
    }

    $(document).on('click', '.mail-signup-close', function() {
      document.cookie = 'mailSignupDismissed=1;path=/';
      $('.footer-card-anchor, .mail-signup-card-inline').hide();
    });

    $(document).on('submit', '.embeddable-buttondown-form', function() {
      setCookie('mailSignupCompleted', '1', 3650);
      $('.footer-card-anchor, .mail-signup-card-inline').hide();
    });

    (function() {
      var el = document.querySelector('.footer-card-anchor .mail-signup-container');
      if (!el) return;

      var isDragging = false;
      var startX, startY, startLeft, startTop;

      el.addEventListener('pointerdown', function(e) {
        if (e.target.closest('button, input, textarea, label, a, select')) return;
        e.preventDefault();

        var rect = el.getBoundingClientRect();
        el.style.position = 'fixed';
        el.style.left = rect.left + 'px';
        el.style.top = rect.top + 'px';
        el.style.bottom = 'auto';
        el.style.right = 'auto';
        el.style.margin = '0';
        el.classList.add('is-dragging');

        startX = e.clientX;
        startY = e.clientY;
        startLeft = rect.left;
        startTop = rect.top;
        isDragging = true;

        el.setPointerCapture(e.pointerId);
      });

      el.addEventListener('pointermove', function(e) {
        if (!isDragging) return;
        el.style.left = (startLeft + e.clientX - startX) + 'px';
        el.style.top  = (startTop  + e.clientY - startY) + 'px';
      });

      el.addEventListener('pointerup', function() {
        isDragging = false;
        el.classList.remove('is-dragging');
      });

      el.addEventListener('pointercancel', function() {
        isDragging = false;
        el.classList.remove('is-dragging');
      });
    })();

    if ($('#modal-announcement').length && !sessionStorage.getItem('announcementDismissed')) {
      MicroModal.show('modal-announcement', {
        onClose: function() {
          sessionStorage.setItem('announcementDismissed', '1');
        },
        disableFocus: true
      });
    }

    $(document).on('change', '#announcement-decline-check', function() {
      var content = document.getElementById('modal-announcement-content');
      if (!content) return;

      content.innerHTML =
        '<div class="announcement-declined">' +
        '<p>Your response has been recorded. Please wait five seconds for admission to the site.</p>' +
        '<p class="announcement-countdown" id="announcement-countdown-num">5</p>' +
        '</div>';

      var count = 5;
      var countEl = document.getElementById('announcement-countdown-num');
      var interval = setInterval(function() {
        count--;
        if (!countEl) { clearInterval(interval); return; }
        if (count > 0) {
          countEl.textContent = count;
        } else {
          clearInterval(interval);
          countEl.textContent = '';
          countEl.className = 'announcement-granted';
          countEl.textContent = 'Admission granted.';
          setTimeout(function() {
            MicroModal.close('modal-announcement');
          }, 800);
        }
      }, 1000);
    });

    $(document).on('change', '#announcement-interest-check', function() {
      var postTitle = $(this).data('post-title');
      var postUrl = $(this).data('post-url');

      if (typeof umami !== 'undefined') {
        umami.track('announcement-interest', { title: postTitle });
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'announcement-interest',
          'post-title': postTitle,
          'post-url': postUrl
        }).toString()
      }).catch(function() {});

      sessionStorage.setItem('announcementDismissed', '1');
      MicroModal.close('modal-announcement');
      setTimeout(function() {
        MicroModal.show('modal-mailing-list', { disableFocus: true });
      }, 350);
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
