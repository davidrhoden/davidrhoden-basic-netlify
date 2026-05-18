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

/* ── Calendar timeline ── */
$(document).ready(function () {
  if (!window.TIMELINE_POSTS || !document.getElementById('calendar-timeline')) return;

  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun',
                     'Jul','Aug','Sep','Oct','Nov','Dec'];

  // Build date → posts lookup map
  var postMap = {};
  TIMELINE_POSTS.forEach(function (p) {
    var key = p.date.substring(0, 10);
    if (!postMap[key]) postMap[key] = [];
    postMap[key].push(p);
  });

  // Year range
  var years = Object.keys(postMap).map(function (k) { return parseInt(k.substring(0, 4)); });
  var minYear = Math.min.apply(null, years);
  var maxYear = new Date().getFullYear();

  var container = document.getElementById('calendar-timeline');

  for (var y = maxYear; y >= minYear; y--) {
    var yearDiv = document.createElement('div');
    yearDiv.className = 'cal-year';

    var label = document.createElement('span');
    label.className = 'cal-year-label';
    label.textContent = y;
    yearDiv.appendChild(label);

    // 3 rows of 4 months each
    for (var row = 0; row < 3; row++) {
      var monthRow = document.createElement('div');
      monthRow.className = 'cal-month-row';

      for (var col = 0; col < 4; col++) {
        var m = row * 4 + col;
        var monthDiv = document.createElement('div');
        monthDiv.className = 'cal-month';

        var grid = document.createElement('div');
        grid.className = 'cal-grid';

        var firstDay = new Date(y, m, 1).getDay(); // 0=Sun
        var daysInMonth = new Date(y, m + 1, 0).getDate();

        // Leading pad cells
        for (var p2 = 0; p2 < firstDay; p2++) {
          var pad = document.createElement('div');
          pad.className = 'cal-cell cal-cell--pad';
          grid.appendChild(pad);
        }

        for (var d = 1; d <= daysInMonth; d++) {
          var dateStr = y + '-' +
            String(m + 1).padStart(2, '0') + '-' +
            String(d).padStart(2, '0');

          var posts = postMap[dateStr];
          var cell;

          if (posts) {
            cell = document.createElement('a');
            cell.className = 'cal-cell cal-cell--active';
            cell.href = posts[0].url;
            cell.setAttribute('data-cal-date', dateStr);
            cell.setAttribute('data-cal-posts', JSON.stringify(posts));
            cell.setAttribute('title', posts.map(function (pp) { return pp.title; }).join(' / '));
          } else {
            cell = document.createElement('div');
            cell.className = 'cal-cell cal-cell--empty';
          }

          grid.appendChild(cell);
        }

        // Trailing pad cells so grid rows complete evenly
        var lastDayOfWeek = new Date(y, m, daysInMonth).getDay();
        var trailingPads = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;
        for (var t = 0; t < trailingPads; t++) {
          var tpad = document.createElement('div');
          tpad.className = 'cal-cell cal-cell--pad';
          grid.appendChild(tpad);
        }

        monthDiv.appendChild(grid);
        monthRow.appendChild(monthDiv);
      }

      yearDiv.appendChild(monthRow);
    }

    container.appendChild(yearDiv);
  }

  // Hover handler
  var detail = document.getElementById('calendar-detail');
  if (!detail) return;

  $(document).on('mouseenter', '.cal-cell--active', function () {
    var posts = JSON.parse(this.getAttribute('data-cal-posts'));
    var dateStr = this.getAttribute('data-cal-date');
    var parts = dateStr.split('-');
    var formattedDate = MONTHS[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]) + ', ' + parts[0];

    var html = '';
    posts.forEach(function (post) {
      html += '<div class="cal-detail-entry">';
      html += '<div class="cal-detail-date">' + formattedDate + '</div>';
      html += '<a class="cal-detail-title" href="' + post.url + '">' + post.title + '</a>';
      html += '</div>';
    });

    // Image from first post that has one
    var imgPost = posts.find(function (p) { return p.image; });
    if (imgPost) {
      html += '<div class="thumbnail-container">';
      html += '<a href="' + imgPost.url + '">';
      html += '<img src="' + imgPost.image + '?nf_resize=fit&w=320" alt="' + imgPost.title + '" onerror="this.style.display=\'none\'">';
      html += '</a></div>';
    }

    detail.innerHTML = html;
    detail.classList.remove('is-animating');
    void detail.offsetWidth; // reflow to restart animation
    detail.classList.add('is-animating');
  });
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
