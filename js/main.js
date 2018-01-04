---
layout: null
---
$(document).ready(function () {
  $('a.blog-button').click(function (e) {
    $('.about').addClass('hidden')
    $('.main-post-list').removeClass('hidden')
    if ($('.panel-cover').hasClass('panel-cover--collapsed')) return
    currentWidth = $('.panel-cover').width()
    if (currentWidth < 960) {
      $('.panel-cover').addClass('panel-cover--collapsed')
      $('.content-wrapper').addClass('animated slideInRight')
    } else {
      $('.panel-cover').css('max-width', currentWidth)
      $('.panel-cover').animate({'max-width': '200px', 'width': '25%'}, 400, swing = 'swing', function () {})
    }
  })

  $('a.about-button').click(function (e) {
    $('.about').removeClass('hidden')
    $('.main-post-list').addClass('hidden')
    if ($('.panel-cover').hasClass('panel-cover--collapsed')) return
    currentWidth = $('.panel-cover').width()
    if (currentWidth < 960) {
      $('.panel-cover').addClass('panel-cover--collapsed')
      $('.content-wrapper').addClass('animated slideInRight')
    } else {
      $('.panel-cover').css('max-width', currentWidth)
      $('.panel-cover').animate({'max-width': '200px', 'width': '25%'}, 400, swing = 'swing', function () {})
    }
  })

//  if (window.location.hash && window.location.hash == '#blog') {
    $('.panel-cover').addClass('panel-cover--collapsed')
    $('.about').addClass('hidden')
//  }

  if (window.location.hash && window.location.hash == '#about') {
    $('.panel-cover').addClass('panel-cover--collapsed')
    $('.main-post-list').addClass('hidden')
  }

  if (window.location.pathname !== '{{ site.baseurl }}' && window.location.pathname !== '{{ site.baseurl }}index.html') {
    $('.panel-cover').addClass('panel-cover--collapsed')
  }

  $('.btn-mobile-menu').click(function () {
    $('.navigation-wrapper').toggleClass('visible animated bounceInDown')
    $('.btn-mobile-menu__icon').toggleClass('icon-list icon-x-circle animated fadeIn')
  })

  $('.navigation-wrapper .blog-button').click(function () {
    $('.navigation-wrapper').toggleClass('visible')
    $('.btn-mobile-menu__icon').toggleClass('icon-list icon-x-circle animated fadeIn')
  })

})
