import './../scss/style.scss';

import $ from 'jquery';

$(document).ready(function ($) {
  /* wink hamburger menu toggle */

  $('#wink-mainmenu-toggle').click(function () {
    $('.menu-row').toggleClass('active');
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

  /* Dark mode is set in local storage on page load */

  let onpageLoad = localStorage.getItem('dark-mode') || '';
  let element = document.body;

  if (onpageLoad) {
    element.classList.add(onpageLoad);
  }

  /* Dark mode state to localStorage on click */

  $('.dark-mode-switch a').click(function (e) {
    let element = document.body;
    element.classList.toggle('dark-mode');

    let theme = localStorage.getItem('dark-mode');
    if (theme && theme === 'dark-mode') {
      localStorage.setItem('dark-mode', '');
    } else {
      localStorage.setItem('dark-mode', 'dark-mode');
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

  /* make divi accordion closeable */

  $('.et_pb_toggle_title').click(function () {
    let $toggle = $(this).closest('.et_pb_toggle');
    $(this)
      .parent()
      .siblings()
      .removeClass('et_pb_toggle_minus')
      .addClass(
        'et_pb_toggle_plus'
      ); /* add divi accordion toggle icon animation */
    if (!$toggle.hasClass('et_pb_accordion_toggling')) {
      let $accordion = $toggle.closest('.et_pb_accordion');
      if ($toggle.hasClass('et_pb_toggle_open')) {
        $(this)
          .parent()
          .addClass('et_pb_toggle_plus')
          .removeClass(
            'et_pb_toggle_minus'
          ); /* add divi accordion toggle icon animation */
        $accordion.addClass('et_pb_accordion_toggling');
        $toggle.find('.et_pb_toggle_content').slideToggle(700, function () {
          $toggle
            .removeClass('et_pb_toggle_open')
            .addClass('et_pb_toggle_close');
        });
      } else {
        $(this)
          .parent()
          .addClass('et_pb_toggle_minus')
          .removeClass(
            'et_pb_toggle_plus'
          ); /* add divi accordion toggle icon animation */
      }
      setTimeout(function () {
        $accordion.removeClass('et_pb_accordion_toggling');
      }, 750);
    }
  });

  /* cssonly carousel for portfolio items */

  $.fn.portfolioCarousel();

  /* portfolio detail page project field more details toggle */

  $('.wink-portfolio-detailview-description .et_pb_button').click(function (
    event
  ) {
    event.preventDefault();
    $(this).toggleClass('open');
    $('.wink-project-fields-list-row').toggleClass('show');
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
    return val + '&rel=0&controls=0';
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
