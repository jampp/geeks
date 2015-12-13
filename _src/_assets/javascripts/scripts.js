$(function() {
  var sh = $(".site-header").outerHeight();
  var fh = $(".fluid-container").outerHeight();

  var shrinkHeader = sh - fh;
  $(window).scroll(function() {
    var scroll = getCurrentScroll();
    if (scroll >= shrinkHeader) {
      $('.fluid-container').addClass('shrink slideDown');
    } else {
      $('.fluid-container').removeClass('shrink slideDown');
    }
  });

  function getCurrentScroll() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
});

$(".show-menu").click(function(e) {
  $(this).toggleClass("open");
  $("body").toggleClass('scroll');
  $(".main-menu").toggleClass("opened");
    e.preventDefault();
});


$(".mobile-navigation").click(function() {
  $(this).toggleClass("open");
  $("body").toggleClass('scroll');
  $(".show-mobile-menu").toggleClass("opened");
  if ($('.show-mobile-menu').hasClass('opened')) {
    $('body').on('touchmove', false);
  } else {
    $('body').off('touchmove', false);
  }
});

$(document).on('click', function (e) {
    if ($(e.target).closest(".show-menu").length === 0) {
        $(".main-menu").removeClass("opened");
    }
});

$(".bt-video-container a.youtube").each(function(index) {
  var $this = $(this),
    embedURL,
    videoFrame,
    youtubeId = $this.data("videoid");
  $this.html('');
  $this.prepend('<div class="bt-video-container-div"><span class="svg-icon-play w-dims"></span><img src="http://img.youtube.com/vi/' + youtubeId + '/maxresdefault.jpg" alt=""></div>&nbsp;');
  $this.attr("id", "yt" + youtubeId);
  embedUrl = '//www.youtube-nocookie.com/embed/' + youtubeId + '?autoplay=1&rel=0';
  videoFrame = '<iframe width="' + parseInt($this.data("width"), 10) + '" height="' + parseInt($this.data("height"), 10) + '" style="vertical-align:top;" src="' + embedUrl + '" frameborder="0" allowfullscreen></iframe>';
  $this.click(function(ev) {
    ev.preventDefault();
    $("#yt" + youtubeId).replaceWith(videoFrame);
    return false;
  });
});


WebFontConfig = {
   google: { families: [ 'Yantramanav:100,400,300,500:latin', 'Lekton:400,700:latin' ] }
 };
 (function() {
   var wf = document.createElement('script');
   wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
     '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
   wf.type = 'text/javascript';
   wf.async = 'true';
   var s = document.getElementsByTagName('script')[0];
   s.parentNode.insertBefore(wf, s);
 })();



 $('.style-switcher a').click(function(e) {

     e.preventDefault();
 });
$(document).ready(function() {

  $('.style-switcher').styleSwitcher({
    hasPreview: false,
    defaultThemeId: 'app',
    fullPath: '/assets/css/',
    cookie: {
      expires: 30,
      isManagingLoad: true
    }

  });
  $('body').addClass('markdown-body');
  $('body').hide().fadeIn(1000);
});
