import './../scss/style.scss';

import $ from 'jquery';

/* prevent showing loading spinner when page back button is clicked */
$(window).on('popstate', function () {
  $('#loader').css('display', 'none');
});

$(document).ready(function ($) {
  /* wink hamburger menu toggle */

  $('#wink-mainmenu-toggle').click(function () {
    $('.menu-row').toggleClass('active');

    $(this).toggleClass('is-active');
    $('body').toggleClass('mainnav-active');
    /* prevent menu-row from loosing z-index:999 too early on menu close */
    if ($('.mainnav-active ').length) {
      $('header').removeAttr('style');
    } else {
      $('header').css('z-index', '999');
      $('header').css('mix-blend-mode', 'normal');
      setTimeout(function () {
        $('header').removeAttr('style');
      }, 1000);
    }
  });

  /* set blendmode effect to normal if menu item is clicked */

  $('.menu-row a').click(function () {
    //$('.menu-row').removeClass('active');
    //$('body').toggleClass('mainnav-active');
    $('#loader').show();
    $('.menu-row > div').css('opacity', '0.4');
    $('header').css('mix-blend-mode', 'normal');
  });

  /* Dark mode is set cookie on click */

  $('.dark-mode-switch a').click(function (e) {
    let element = document.body;
    element.classList.toggle('dark-mode');

    if ($.cookie('theme')) {
      if ($.cookie('theme') === 'light') {
        $.cookie('theme', 'dark', { path: '/' });
      } else {
        $.cookie('theme', 'light', { path: '/' });
      }
    }
    e.preventDefault();
  });

  /* Override the addClass to prevent fixed header class from being added */

  let addclass = $.fn.addClass;
  $.fn.addClass = function () {
    let result = addclass.apply(this, arguments);
    $('#main-header').removeClass('et-fixed-header');
    return result;
  };

  $('#main-header').removeClass('et-fixed-header');

  /*
   * divi accordion
   */

  /* remove open icon if accordion has no content */

  $('.et_pb_toggle_content').each(function (i, obj) {
    //test
    if ($(this).is(':empty')) {
      $(this).prev('.et_pb_toggle_title').addClass('no-content');
    }
  });

  /* make divi accordion closeable & change animation speed */

  $('.et_pb_toggle').click(function () {
    let $toggle = $(this);

    setTimeout(function () {
      $('body')
        .find($('.et_pb_toggle_close.et_pb_toggle_minus'))
        .removeClass('et_pb_toggle_minus')
        .addClass('et_pb_toggle_plus');
    }, 400);

    $toggle
      .siblings()
      .removeClass('et_pb_toggle_minus')
      .addClass('et_pb_toggle_plus');

    /* add divi accordion toggle icon animation */
    if (!$toggle.hasClass('et_pb_accordion_toggling')) {
      let $accordion = $toggle.closest('.et_pb_accordion');
      if ($toggle.hasClass('et_pb_toggle_open')) {
        $toggle
          .addClass('et_pb_toggle_plus')
          .removeClass(
            'et_pb_toggle_minus'
          ); /* add divi accordion toggle icon animation */
        $accordion.addClass('et_pb_accordion_toggling');
        $toggle.find('.et_pb_toggle_content').slideToggle(300, function () {
          $toggle
            .removeClass('et_pb_toggle_open')
            .addClass('et_pb_toggle_close');
        });
      } else {
        $('.et_pb_toggle')
          .removeClass('et_pb_toggle_open')
          .addClass('et_pb_toggle_close');
        $('.et_pb_toggle_content').slideUp(300);
        $toggle
          .addClass('et_pb_toggle_minus')
          .removeClass(
            'et_pb_toggle_plus'
          ); /* add divi accordion toggle icon animation */

        $toggle.find('.et_pb_toggle_content').slideToggle(300, function () {
          $toggle
            .removeClass('et_pb_toggle_close')
            .addClass('et_pb_toggle_open');
        });
      }
      setTimeout(function () {
        $accordion.removeClass('et_pb_accordion_toggling');
      }, 750);
    }
  });

  /*
   * cssonly carousel for portfolio items
   */

  $.fn.portfolioCarousel();

  /*
   * Show Navigation on Scroll up
   */
  $.fn.showNavOnScrollUp();

  /* portfolio detail page project field more details toggle */

  $('.wink-portfolio-detailview-description .et_pb_button').click(function (
    event
  ) {
    event.preventDefault();
    $(this).toggleClass('open');
    //$('.wink-project-fields-list-row').toggleClass('show');

    $('.wink-project-fields-list-row').slideToggle(300, function () {
      $(this).toggleClass('show');
    });
  });

  /* Blog post list - set filter 'Alle' to active state on page load */

  $('.el-dbe-post-categories li:first-child a').addClass(
    'el-dbe-active-category'
  );

  /* Close Divi Accordion first element per Default on pageload */
  $('.et_pb_accordion .et_pb_toggle_open')
    .addClass('et_pb_toggle_close')
    .removeClass('et_pb_toggle_open');

  $('.et_pb_accordion .et_pb_toggle').click(function () {
    let $this = $(this);
    setTimeout(function () {
      $this.closest('.et_pb_accordion').removeClass('et_pb_accordion_toggling');
    }, 700);
  });

  /* wink accordion fullwidth sticky headers */
  if ($('.wink-accordion-fullwidth ').length > 0) {
    $(window).resize(function () {
      if ($(this).width() > 753) {
        $('.wink-accordion-fullwidth .et_pb_accordion .et_pb_toggle')
          .addClass('et_pb_toggle_open')
          .removeClass('et_pb_toggle_close');
        $.fn.accordionStickyItems();
      }
    });
  }

  /* Youtube: remove controls and hide next video suggestions for youtube team video 
  - add '&rel=0' to end of all YouTube video URL's
  - to prevent displaying related videos */

  $('.wink-video-header iframe').attr('src', function (i, val) {
    return val + '&rel=0&controls=0&autoplay=1&mute=1';
  });

  /* Cursor shadow: aura shine for mouse pointer */

  let cursor = document.getElementById('cursor-shadow');
  document.body.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  /* divi global header: active menu item on corresponding active page */

  let currentPage = window.location.pathname.split('/')[1];
  if (currentPage == 'project') {
    // exeption for projects single view page
    currentPage = 'projekte';
  }
  $(
    '#wink-mainnav .menu-row .et_pb_column .et_pb_module a[href="' +
      currentPage +
      '/"]'
  ).addClass('active');
});

$.fn.portfolioCarousel = function () {
  $('.wink-horizontal-projects-slider').each(function () {
    let portfolioItems = $(this).find('.et_pb_portfolio_item');
    let portfolioItemsId = [];
    let i = 0;
    portfolioItems.each(function () {
      i++;

      portfolioItemsId[i] =
        '<a class="dotNav" href=#' + $(this).attr('id') + '>dot' + i + '</a> ';
    });
    $(this).find('.et_pb_portfolio').append(portfolioItemsId);
  });
};

$.fn.accordionStickyItems = function () {
  let stickyTop = [];
  let containerTop = 0;
  $('.wink-accordion-fullwidth .et_pb_toggle').each(function (index) {
    stickyTop[index] = $(this).offset().top;
  });
  containerTop = $('.wink-accordion-fullwidth').offset().top;
  $(window).scroll(function () {
    let windowTop = $(window).scrollTop() + 100;
    $.each(stickyTop, function (index, value) {
      if (value < windowTop) {
        $('.wink-accordion-fullwidth .et_pb_accordion_item_' + index).addClass(
          'sticky'
        );
      }
      $('#wink-mainnav ').removeClass('stickyBg');
      if (containerTop < windowTop) {
        $('#wink-mainnav ').addClass('stickyBg');
      }
    });
  });
};

$.fn.showNavOnScrollUp = function () {
  var lastScrollTop; // This Varibale will store the top position
  var navbar;
  var darkmodeToggle;
  darkmodeToggle = document.getElementsByClassName('dark-mode-switch');
  navbar = document.getElementById('wink-mainnav'); // Get The NavBar

  window.addEventListener('scroll', function () {
    //on every scroll this funtion will be called

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    //This line will get the location on scroll

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      //if it will be greater than the previous
      navbar.style.top = '-100px';

      darkmodeToggle[0].style.left = '-30px';

      //set the value to the negetive of height of navbar
    } else {
      navbar.style.top = '0';
      darkmodeToggle[0].style.left = '20px';
    }

    lastScrollTop = scrollTop; //New Position Stored
  });
};
