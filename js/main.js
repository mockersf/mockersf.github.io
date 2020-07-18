---
  layout: null
---
  $(document).ready(function () {
    $('.panel-cover').addClass('panel-cover--collapsed')

    $('.btn-mobile-menu').click(function () {
      $('.navigation-wrapper').toggleClass('visible animated bounceInDown')
      $('.btn-mobile-menu__icon').toggleClass('fa-bars fa-times-circle animated fadeIn')
    })

    $('.navigation-wrapper .blog-button').click(function () {
      $('.navigation-wrapper').toggleClass('visible')
      $('.btn-mobile-menu__icon').toggleClass('fa-bars fa-times-circle animated fadeIn')
    })

  })
