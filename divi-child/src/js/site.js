import './../scss/style.scss';

import $ from 'jquery';

$(document).ready(function ($) {
  /* wink hamburger menu toggle */

  $('#wink-mainmenu-toggle').click(function () {
    $('.menu-row').toggleClass('active');
    $('body').toggleClass('mainnav-active');
  });

  /* prevent menu-row from loosing z-index:999 too early on menu close */

  $('#wink-mainmenu-toggle').click(function () {
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
    $('.menu-row').removeClass('active');
    $('body').toggleClass('mainnav-active');
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

  var addclass = $.fn.addClass;
  $.fn.addClass = function () {
    var result = addclass.apply(this, arguments);
    $('#main-header').removeClass('et-fixed-header');
    return result;
  };

  $('#main-header').removeClass('et-fixed-header');

  /* cssonly carousel for portfolio items */

  portfolioCarousel();

  function portfolioCarousel() {
    $('.wink-horizontal-projects-slider').each(function () {
      let portfolioItems = $(this).find('.et_pb_portfolio_item');
      let portfolioItemsId = [];
      let i = 0;
      portfolioItems.each(function () {
        i++;

        portfolioItemsId[i] =
          '<a class="dotNav" href=#' +
          $(this).attr('id') +
          '>dot' +
          i +
          '</a> ';
      });
      $(this).find('.et_pb_portfolio').append(portfolioItemsId);
    });
  }

  /* portfolio detail page project field details more toggle */

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

  /* remove controls and hide next video suggestions for youtube team video */
  // add '&rel=0' to end of all YouTube video URL's
  // to prevent displaying related videos
  $('.wink-video-header iframe').attr('src', function (i, val) {
    return val + '&rel=0&controls=0';
  });

  /* nice select box */
  //customSelect();
  /* If the user clicks anywhere outside the select box,
  then close all select boxes: */
  //document.addEventListener('click', closeAllSelect);

  function customSelect() {
    var x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName('abb-custom-select');
    l = x.length;
    for (i = 0; i < l; i++) {
      selElmnt = x[i].getElementsByTagName('select')[0];
      ll = selElmnt.length;
      /* For each element, create a new DIV that will act as the selected item: */
      a = document.createElement('DIV');
      a.setAttribute('class', 'select-selected');
      a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
      x[i].appendChild(a);
      /* For each element, create a new DIV that will contain the option list: */
      b = document.createElement('DIV');
      b.setAttribute('class', 'select-items select-hide');
      for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
      create a new DIV that will act as an option item: */
        c = document.createElement('DIV');
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener('click', function (e) {
          /* When an item is clicked, update the original select box,
          and the selected item: */
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName('select')[0];
          sl = s.length;
          h = this.parentNode.previousSibling;
          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              s.options[i].setAttribute('selected', '');
              y = this.parentNode.getElementsByClassName('same-as-selected');
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute('class');
              }
              this.setAttribute('class', 'same-as-selected');
              break;
            }
            s.options[i].removeAttribute('selected');
          }
          h.click();
        });
        b.appendChild(c);
      }
      x[i].appendChild(b);
      a.addEventListener('click', function (e) {
        /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
      });
    }
  }

  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
  except the current select box: */
    var x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected');
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }
});
