/*
 * stickyNavbar.js v1.2.0
 * https://github.com/jbutko/stickyNavbar.js
 * Fancy sticky navigation jQuery plugin with smart anchor links highlighting
 *
 * Developed and maintenained under MIT licence by Jozef Butko - www.jozefbutko.com
 * http://www.opensource.org/licenses/MIT

 * Original jquery-browser code Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * CREDITS:
 * Daniel Eden for Animate.CSS:
 * http://daneden.github.io/animate.css/
 * jQuery easing plugin:
 * http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * COPYRIGHT (C) 2014 Jozef Butko
 * https://github.com/jbutko
 * LAST UPDATE: 21/03/2015
 *
 */
;(function($, window, document) {

  'use strict';
  
  if ($(document).scrollTop() !== 0) {
    $("#header").css("background-color", "rgba(0, 0, 0, 255)");
  }
  
  var fadeDist = $("#large-header").height();
  $(document).scroll(function() {
    var scrolledDist = $(document).scrollTop();
    if (scrolledDist <= fadeDist) {
      var fractionFade = scrolledDist / fadeDist;
      var scaledFade = 2 * fractionFade;
      var newColor = "rgba(0, 0, 0, " + scaledFade + ")";
      $("#header").css("background-color", newColor);
    }
  });

  $.fn.stickyNavbar = function(prop) {

    // Set default values
    var options = $.extend({
        activeClass: 'active', // Class to be added to highlight nav elements
        sectionSelector: 'scrollto', // Class of the section that is interconnected with nav links
        animDuration: 350, // Duration of jQuery animation as well as jQuery scrolling duration
        startAt: 0, // Stick the menu at XXXpx from the top of the this() (nav container)
        easing: 'swing', // Easing type if jqueryEffects = true, use jQuery Easing plugin to extend easing types - gsgd.co.uk/sandbox/jquery/easing
        animateCSS: true, // AnimateCSS effect on/off
        animateCSSRepeat: false, // Repeat animation everytime user scrolls
        cssAnimation: 'fadeInDown', // AnimateCSS class that will be added to selector
        jqueryEffects: false, // jQuery animation on/off
        jqueryAnim: 'slideDown', // jQuery animation type: fadeIn, show or slideDown
        selector: 'a', // Selector to which activeClass will be added, either 'a' or 'li'
        mobile: false, // If false, nav will not stick under viewport width of 480px (default) or user defined mobileWidth
        mobileWidth: 480, // The viewport width (without scrollbar) under which stickyNavbar will not be applied (due user usability on mobile)
        zindex: 9999, // The zindex value to apply to the element: default 9999, other option is 'auto'
        stickyModeClass: 'sticky', // Class that will be applied to 'this' in sticky mode
        unstickyModeClass: 'unsticky' // Class that will be applied to 'this' in non-sticky mode
      }, prop),
      sections = $('.' + options.sectionSelector);


    return this.each(function() {

      // cache variables
      var $self = $(this),
        $selfPosition = $self.css('position'), // Initial position of this,
        $selfZindex = $self.css('zIndex'), // Z-index of this
        thisHeight = $self.outerHeight(true), // Height of navigation wrapper
        $selfScrollTop = $self.offset().top, // scrollTop position of this
        $topOffset = $self.css('top') === 'auto' ? 0 : $self.css('top'), // Top property of this: if not set = 0
        menuItems = options.selector === 'a' ? $self.find('li a') : $self.find('li'), // Navigation lists or links
        menuItemsHref = $self.find('li a[href*=#]'), // href attributes of navigation links
        windowPosition = $(window).scrollTop();

      /* v1.1.0: Main function, then on bottom called window.scroll, ready and resize */
      var mainFunc = function() {

        // cache window and window position from the top
        var win = $(window),
          windowPosition = win.scrollTop(),
          windowWidth = win.width(),
          windowHeight = win.height();

        // optional mobileWidth
        if (!options.mobile && windowWidth < options.mobileWidth) {
          $self.css('position', $selfPosition);
          return;
        }

        // everytime we scroll remove the activeClass, later on we add it if needed
        menuItems.removeClass(options.activeClass);

        // add activeClass to the div that is passing the top of the window
        sections.each(function() {
          var top = $(this).offset().top - thisHeight,
            bottom = $(this).outerHeight(true) + top;

          if ((windowPosition >= top) && (windowPosition <= bottom)) {
            if (options.selector === 'a') {
              $self.find('li a[href~="#' + this.id + '"]').addClass(options.activeClass);
            } else {
              $self.find('li a[href~="#' + this.id + '"]').parent().addClass(options.activeClass);
            }
          }
        });

        /* 1.) As soon as we start scrolling */
        if (windowPosition >= $selfScrollTop + options.startAt) {

          // add 'sticky' class to this as soon as 'this' is in sticky mode
          $self.removeClass(options.unstickyModeClass).addClass(' ' + options.stickyModeClass);

          // as soon as scrolling starts set position of this() to fixed

          // if jQuery effects are turned on
          if (options.jqueryEffects) {
            if (!options.animateCSSRepeat) {
              $self.hide().stop()[options.jqueryAnim](options.animDuration, options.easing);
            }
            $self.hide().stop()[options.jqueryAnim](options.animDuration, options.easing);

            // if animateCSS are turned on
          } else if (options.animateCSS) {

            // if animateCSSRepeat == true animation will repeat on each scroll
            if (options.animateCSSRepeat) {

              // restart the animation */
              $self.addClass(options.cssAnimation + ' animated').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function(e) {
                $self.removeClass(options.cssAnimation + ' animated');
              });
            } else {

              // restart the animation just once
              $self.addClass(options.cssAnimation + ' animated').one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd');
            }

            // else if jQuery and animateCSS are turned off
          } else {
            $self.stop(); // pin navigation to the top
          }

          // if top of the window is over this() (nav container)
        } else {

          // add 'sticky' class to this as soon as 'this' is in sticky mode */
          $self.css({
            'position': options.$selfPosition,
            'zIndex': $selfZindex
          }).removeClass(options.stickyModeClass).addClass(' ' + options.unstickyModeClass);
        }


        /* 2.) As soon as we hit the bottom of the page */
        if (win.scrollTop() + windowHeight >= $(document).height()) {

          // remove activeClass from menuItem before the last and add activeClass to the lastests one
          menuItems.removeClass(options.activeClass).last().addClass(options.activeClass);

        }

        /* 3.) As soon as we get back to the top of the page */
        // if top of the window is over this() (nav container)
        if (windowPosition <= $selfScrollTop - 2) {
          $self.removeClass(options.cssAnimation + ' animated');

          // if jQuery effects are turned on
          if (options.jqueryEffects) {

            // if we are at the very top of the page remove active class
            if (windowPosition === 0) {
              menuItems.removeClass(options.activeClass);
            }

            // if the top of the window is under the this() stick the nav and start the animation
            if (windowPosition >= $selfScrollTop) {
              $self.css({
                'position': 'fixed',
                'zIndex': options.zindex
              }).hide().stop()[options.jqueryAnim](options.animDuration, options.easing);
            } else {
              $self.css({
                'position': $selfPosition,
                'zIndex': options.zindex
              });
            }

            // if jQuery effects are turned off
          } else {

            // if we are at the very top of the page remove active class
            if (windowPosition === 0) {
              menuItems.removeClass(options.activeClass);
            }

            // set initial position of this() and initial CSS top property
            $self.css({
              'position': $selfPosition,
              'top': $topOffset
            }).stop().animate({
              top: $topOffset
            }, options.animDuration, options.easing);
          }
        } // ( windowPosition <= $selfScrollTop ) end

      };

      $(window).scroll(mainFunc); // scroll fn end
      $(window).ready(mainFunc);
      $(window).resize(mainFunc);
      $(window).load(mainFunc);

    }); // return this.each end
  }; // $.fn.stickyNavbar end

  // Sticky Navbar Options
  $(function () {
      $('.header').stickyNavbar({
          activeClass: "active",          // Class to be added to highlight nav elements
          sectionSelector: "scrollto",    // Class of the section that is interconnected with nav links
          animDuration: 250,              // Duration of jQuery animation
          startAt: 0,                     // Stick the menu at XXXpx from the top of the this() (nav container)
          easing: "linear",               // Easing type if jqueryEffects = true, use jQuery Easing plugin to extend easing types - gsgd.co.uk/sandbox/jquery/easing
          animateCSS: true,               // AnimateCSS effect on/off
          animateCSSRepeat: false,        // Repeat animation everytime user scrolls
          cssAnimation: "fadeInDown",     // AnimateCSS class that will be added to selector
          jqueryEffects: false,           // jQuery animation on/off
          jqueryAnim: "slideDown",        // jQuery animation type: fadeIn, show or slideDown
          selector: "a",                  // Selector to which activeClass will be added, either "a" or "li"
          mobile: true,                   // If false nav will not stick under 768px width of window
          mobileWidth: 768,               // The viewport width (without scrollbar) under which stickyNavbar will not be applied (due usability on mobile devices)
          zindex: 9999,                   // The zindex value to apply to the element: default 9999, other option is "auto"
          stickyModeClass: "sticky",      // Class that will be applied to 'this' in sticky mode
          unstickyModeClass: "unsticky"   // Class that will be applied to 'this' in non-sticky mode
      });
  });

  // Hides navbar on selecting an item
  $('.nav a').on('click', function(){
      $(".navbar-collapse").collapse('hide');
  });
  // Hides navbar on click outside the navbar
  $('body').bind('click', function(e) {
      if($(e.target).closest('.navbar').length == 0) {
          // click happened outside of .navbar, so hide
          var opened = $('.navbar-collapse').hasClass('collapse in');
          if ( opened === true ) {
              $('.navbar-collapse').collapse('hide');
          }
      }
  });

  // Override apply button's preventDefault
  $("#navbar > ul > li:last").bind("click", function(ev) {
    return true;
  });

})(jQuery, window, document); // document ready end
