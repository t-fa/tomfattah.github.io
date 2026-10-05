(function () {
  var links = Array.from(document.querySelectorAll(".gallery a"));
  var box = document.getElementById("lightbox");
  if (!links.length || !box) return;

  var imgEl = box.querySelector(".lightbox-img");
  var capEl = box.querySelector(".lightbox-caption");
  var btnPrev = box.querySelector(".lightbox-prev");
  var btnNext = box.querySelector(".lightbox-next");
  var btnClose = box.querySelector(".lightbox-close");

  var index = 0;
  var lastFocus = null;

  function render(i) {
    index = (i + links.length) % links.length;
    var link = links[index];
    var thumb = link.querySelector("img");

    imgEl.src = link.getAttribute("href");
    imgEl.alt = thumb ? thumb.alt : "";
    capEl.textContent = thumb && thumb.alt ? thumb.alt : "";

    // preload the neighbours so navigation feels instant
    [index - 1, index + 1].forEach(function (n) {
      var pre = new Image();
      pre.src = links[(n + links.length) % links.length].getAttribute("href");
    });
  }

  function open(i, trigger) {
    lastFocus = trigger || null;
    render(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function close() {
    box.hidden = true;
    imgEl.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (link, i) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      open(i, link);
    });
  });

  btnPrev.addEventListener("click", function () {
    render(index - 1);
  });
  btnNext.addEventListener("click", function () {
    render(index + 1);
  });
  btnClose.addEventListener("click", close);

  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") render(index - 1);
    else if (e.key === "ArrowRight") render(index + 1);
  });

  var startX = null;
  box.addEventListener(
    "touchstart",
    function (e) {
      startX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  box.addEventListener(
    "touchend",
    function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) render(index + (dx < 0 ? 1 : -1));
      startX = null;
    },
    { passive: true }
  );
})();
