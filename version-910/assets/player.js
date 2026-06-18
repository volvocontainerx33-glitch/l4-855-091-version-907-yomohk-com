function initMoviePlayer(videoId, buttonId, sourceUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  if (!video || !button || !sourceUrl) {
    return;
  }
  var attached = false;

  function attach() {
    if (attached) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
      attached = true;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      attached = true;
      return;
    }
    video.src = sourceUrl;
    attached = true;
  }

  function play() {
    attach();
    button.classList.add("is-hidden");
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  }

  button.addEventListener("click", play);
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
}
