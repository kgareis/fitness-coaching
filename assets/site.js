(function () {
  var first = document.querySelector(".hero-name-first");
  var last = document.querySelector(".hero-name-last");
  var name = first && first.parentElement;
  if (!first || !last || !name) return;

  var desktop = window.matchMedia("(min-width: 1024px)");
  var context = document.createElement("canvas").getContext("2d");

  function renderedText(el) {
    var text = (el.textContent || "").replace(/\s+/g, "");
    var transform = getComputedStyle(el).textTransform;
    if (transform === "uppercase") return text.toUpperCase();
    if (transform === "lowercase") return text.toLowerCase();
    return text;
  }

  function sideBearings(el, character) {
    var style = getComputedStyle(el);
    context.font = style.fontWeight + " " + style.fontSize + " " + style.fontFamily;
    var metrics = context.measureText(character);
    var right = metrics.actualBoundingBoxRight != null ? metrics.actualBoundingBoxRight : metrics.width;
    return {
      left: -(metrics.actualBoundingBoxLeft || 0),
      right: metrics.width - right
    };
  }

  function align() {
    last.style.marginLeft = "";
    name.style.marginLeft = "";
    name.style.width = "";
    if (!desktop.matches) return;
    var firstBox = first.getBoundingClientRect();
    var lastBox = last.getBoundingClientRect();
    var h = sideBearings(first, renderedText(first).slice(-1));
    var r = sideBearings(last, renderedText(last).charAt(0));
    var targetLeft = firstBox.right - h.right - r.left;
    last.style.marginLeft = (targetLeft - lastBox.left) + "px";

    var placedFirst = first.getBoundingClientRect();
    var placedLast = last.getBoundingClientRect();
    var parent = name.parentElement;
    var parentStyle = getComputedStyle(parent);
    var parentBox = parent.getBoundingClientRect();
    var padLeft = parseFloat(parentStyle.paddingLeft) || 0;
    var padRight = parseFloat(parentStyle.paddingRight) || 0;
    var borderLeft = parseFloat(parentStyle.borderLeftWidth) || 0;
    var borderRight = parseFloat(parentStyle.borderRightWidth) || 0;
    var contentWidth = parentBox.width - padLeft - padRight - borderLeft - borderRight;
    var compLeft = Math.min(placedFirst.left, placedLast.left);
    var compRight = Math.max(placedFirst.right, placedLast.right);
    var compWidth = compRight - compLeft;
    var artworkInset = compLeft - name.getBoundingClientRect().left;
    name.style.width = compWidth + "px";
    name.style.marginLeft = ((contentWidth - compWidth) / 2 - artworkInset) + "px";
  }

  function schedule() {
    window.requestAnimationFrame(align);
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();
  window.addEventListener("resize", schedule);
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(first.parentNode);
  if (desktop.addEventListener) desktop.addEventListener("change", schedule);
})();

(function () {
  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");
  if (!form || !success) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    form.classList.add("hidden");
    success.classList.remove("hidden");
    success.focus();
  });
})();
