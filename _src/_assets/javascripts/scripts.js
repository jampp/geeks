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

$(".mobile-navigation").click(function() {
  $(this).toggleClass("open");
  $("body").toggleClass('scroll');
  $(".show-menu").toggleClass("opened");
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
