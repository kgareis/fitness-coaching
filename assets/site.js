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
