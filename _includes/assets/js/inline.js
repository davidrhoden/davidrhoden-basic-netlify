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

document.addEventListener("DOMContentLoaded", function () {
  var hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("is-active");
      var navMobile = document.querySelector(".nav-mobile");
      if (navMobile) navMobile.classList.toggle("is-active");
    });
  }
});

function showHidden() {
  var entry = this.closest(".text-timeline-entry");
  if (!entry) return;
  var hiddenEl = entry.querySelector(".hidden");
  var detail = document.getElementById("timeline-detail");
  if (hiddenEl && detail) detail.innerHTML = hiddenEl.innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
  var photoTimeline = document.querySelector(".photo-timeline");
  if (photoTimeline) {
    photoTimeline.addEventListener("mouseover", function (e) {
      var link = e.target.closest(".photo-timeline-link");
      if (link) showHidden.call(link);
    });
  }
  var textTimeline = document.getElementById("text-timeline");
  if (textTimeline) {
    textTimeline.addEventListener("mouseover", function (e) {
      var link = e.target.closest(".text-timeline-link");
      if (link) showHidden.call(link);
    });
  }
});

var scrollContainer = document.querySelector(".scroll-container");
if (scrollContainer) {
  scrollContainer.addEventListener("scroll", function () {
    var scrollText = document.getElementById("scroll-text");
    if (scrollText) {
      scrollText.style.transition = "opacity 0.4s";
      scrollText.style.opacity = "0";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // magnificPopup for #bricks — still requires jQuery/magnific-popup
  if (typeof $ !== "undefined" && $.fn.magnificPopup) {
    $("#bricks ul li, #bricks ol li").magnificPopup({
      delegate: "a",
      gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1],
      },
      type: "image",
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var buttonRow = document.querySelector(".button-row");
  if (buttonRow) {
    buttonRow.addEventListener("click", function (event) {
      var link = event.target.closest(".link");
      if (!link) return;
      var href = link.getAttribute("href");
      var target = href ? document.querySelector(href) : null;
      if (target) {
        target.classList.add("is-active");
        Array.from(target.parentNode.children).forEach(function (sib) {
          if (sib !== target) sib.classList.remove("is-active");
        });
      }
      link.classList.add("is-active");
      Array.from(link.parentNode.children).forEach(function (sib) {
        if (sib !== link) sib.classList.remove("is-active");
      });
      event.preventDefault();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var viewport = document.getElementById("viewport");
  if (!viewport) return;

  var images = Array.from(viewport.querySelectorAll("p img, li img"));
  var totalImages = images.length;
  if (!totalImages) return;

  var currentImage = 0;
  var caption = document.getElementById("caption");

  images[0].classList.add("fadedIn");
  if (caption) caption.innerHTML = images[0].getAttribute("alt") || "";

  function increaseImage() {
    currentImage = (currentImage + 1) % totalImages;
  }
  function decreaseImage() {
    currentImage = (currentImage - 1 + totalImages) % totalImages;
  }

  var btnPrev = document.getElementById("buttonPrevious");
  var btnNext = document.getElementById("buttonNext");

  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      images[currentImage].classList.remove("fadedIn");
      decreaseImage();
      images[currentImage].classList.add("fadedIn");
      if (caption) caption.innerHTML = images[currentImage].getAttribute("alt") || "";
    });
  }
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      images[currentImage].classList.remove("fadedIn");
      increaseImage();
      images[currentImage].classList.add("fadedIn");
      if (caption) caption.innerHTML = images[currentImage].getAttribute("alt") || "";
    });
  }
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

document.addEventListener("DOMContentLoaded", function () {
  // Apply saved tag sort preference on page load
  const savedSort = getCookie('tagsListSort');
  if (savedSort === 'sort_by_count') {
    document.querySelectorAll(".tag-lists").forEach(function (el) { el.classList.toggle("active"); });
    document.querySelectorAll(".tags-list").forEach(function (el) { el.classList.toggle("active"); });
  }

  document.querySelectorAll(".tag-lists").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      const clickedHref = el.getAttribute("href");
      const sortPreference = clickedHref === "#tags-number-of-posts" ? "sort_by_count" : "sort_alphabetical";
      setCookie('tagsListSort', sortPreference, 180);
      document.querySelectorAll(".tag-lists").forEach(function (t) { t.classList.toggle("active"); });
      document.querySelectorAll(".tags-list").forEach(function (t) { t.classList.toggle("active"); });
    });
  });

  document.querySelectorAll(".tab-selector").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelectorAll(".tab-selector").forEach(function (t) { t.classList.toggle("active"); });
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.toggle("active"); });
    });
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

  var navLinkSearch = document.getElementById('nav-link-search');
  if (navLinkSearch) {
    navLinkSearch.addEventListener('click', function(ev) {
      MicroModal.show('modal-search', {
        onClose: function() {
          var navLinkContact = document.querySelector('.nav-link-contact');
          if (navLinkContact) navLinkContact.blur();
        },
        disableFocus: true
      });
      var searchInput = document.querySelector('.pagefind-ui__search-input');
      if (searchInput) searchInput.focus();
    });
  }

  if (getCookie('mailSignupDismissed') || getCookie('mailSignupCompleted')) {
    document.querySelectorAll('.footer-card-anchor, .mail-signup-card-inline').forEach(function (el) {
      el.style.display = 'none';
    });
  }

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mail-signup-close')) return;
    document.cookie = 'mailSignupDismissed=1;path=/';
    document.querySelectorAll('.footer-card-anchor, .mail-signup-card-inline').forEach(function (el) {
      el.style.display = 'none';
    });
  });

  document.addEventListener('submit', function(e) {
    if (!e.target.closest('.embeddable-buttondown-form')) return;
    setCookie('mailSignupCompleted', '1', 3650);
    document.querySelectorAll('.footer-card-anchor, .mail-signup-card-inline').forEach(function (el) {
      el.style.display = 'none';
    });
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

  if (document.getElementById('modal-announcement') && !sessionStorage.getItem('announcementDismissed')) {
    MicroModal.show('modal-announcement', {
      onClose: function() {
        sessionStorage.setItem('announcementDismissed', '1');
      },
      disableFocus: true
    });
  }

  document.addEventListener('change', function(e) {
    if (!e.target.matches('#announcement-decline-check')) return;
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

  document.addEventListener('change', function(e) {
    if (!e.target.matches('#announcement-interest-check')) return;
    var postTitle = e.target.dataset.postTitle;
    var postUrl = e.target.dataset.postUrl;

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

  var onetalkerTrigger = document.getElementById('onetalker-trigger');
  if (onetalkerTrigger) {
    onetalkerTrigger.addEventListener('click', function() {
      var isMobile = window.innerWidth <= 767;

      if (isMobile) {
        // On mobile: two-step interaction
        if (!onetalkerTrigger.classList.contains('active')) {
          // First click: show bubble and talking state
          onetalkerTrigger.classList.add('active');
        } else {
          // Second click: open modal
          onetalkerTrigger.classList.add('modal-open');
          onetalkerTrigger.classList.remove('active');
          MicroModal.show('modal-onetalker', {
            onClose: function() {
              onetalkerTrigger.classList.remove('modal-open');
            },
            disableFocus: true
          });
        }
      } else {
        // On desktop: one click opens modal
        onetalkerTrigger.classList.add('modal-open');
        MicroModal.show('modal-onetalker', {
          onClose: function() {
            onetalkerTrigger.classList.remove('modal-open');
          },
          disableFocus: true
        });
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll('audio').forEach(function(audio) {
    audio.addEventListener('play', function() {
      var src = audio.getAttribute('src') || '';
      if (typeof umami !== 'undefined') {
        if (src.includes('Coal-Miner')) {
          umami.track('audio-play-coal-miner');
        } else if (src.includes('Country-Doctor')) {
          umami.track('audio-play-country-doctor');
        }
      }
    });
  });
});

document.addEventListener('click', function(e) {
  var facade = e.target.closest('.youtube-facade');
  if (!facade) return;
  var src = facade.getAttribute('data-src');
  var title = facade.getAttribute('data-title') || 'YouTube video';
  if (!src) return;
  var separator = src.indexOf('?') > -1 ? '&' : '?';
  var iframe = document.createElement('iframe');
  iframe.src = src + separator + 'autoplay=1';
  iframe.title = title;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.aspectRatio = '16/9';
  iframe.style.maxWidth = '100%';
  iframe.style.width = '100%';
  facade.parentNode.replaceChild(iframe, facade);
});
