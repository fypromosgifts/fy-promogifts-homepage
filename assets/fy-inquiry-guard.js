(function () {
  "use strict";

  var SITE_KEY = "0x4AAAAAAEk6HaanW9N0Acp9";
  var widgetIds = new WeakMap();
  var scriptPromise;

  function getStatus(form) {
    var status = form.querySelector(".form-status, [aria-live]");
    if (status) return status;
    status = document.createElement("div");
    status.className = "form-status fy-form-status";
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);
    return status;
  }

  function setStatus(form, message, isError) {
    var status = getStatus(form);
    if (!status) return;
    status.textContent = message || "";
    status.classList.toggle("is-error", Boolean(isError));
  }

  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = function () { resolve(window.turnstile); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return scriptPromise;
  }

  function prepareForm(form) {
    form.action = "/api/inquiry";

    var started = form.querySelector('input[name="form_started_at"]');
    if (!started) {
      started = document.createElement("input");
      started.type = "hidden";
      started.name = "form_started_at";
      form.appendChild(started);
    }
    started.value = String(Date.now());

    if (!form.querySelector('input[name="_gotcha"]')) {
      var trap = document.createElement("input");
      trap.type = "text";
      trap.name = "_gotcha";
      trap.tabIndex = -1;
      trap.autocomplete = "off";
      trap.setAttribute("aria-hidden", "true");
      trap.style.cssText = "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden";
      form.appendChild(trap);
    }

    var mount = document.createElement("div");
    mount.className = "fy-turnstile-wrap";
    mount.setAttribute("aria-label", "Security verification");
    var actions = form.querySelector(".actions");
    if (actions) actions.parentNode.insertBefore(mount, actions);
    else {
      var submitButton = form.querySelector('[type="submit"]');
      if (submitButton) submitButton.parentNode.insertBefore(mount, submitButton);
      else form.appendChild(mount);
    }

    getStatus(form);

    loadTurnstile().then(function (turnstile) {
      var id = turnstile.render(mount, {
        sitekey: SITE_KEY,
        action: "inquiry",
        theme: "light",
        size: "flexible",
        callback: function () { setStatus(form, "", false); },
        "error-callback": function () {
          setStatus(form, "Security check could not load. Please refresh and try again.", true);
        },
        "expired-callback": function () {
          setStatus(form, "Security check expired. Please verify again.", true);
        }
      });
      widgetIds.set(form, id);
    }).catch(function () {
      setStatus(form, "Security check could not load. Please refresh and try again.", true);
    });

    form.addEventListener("reset", function () {
      setTimeout(function () {
        var id = widgetIds.get(form);
        if (window.turnstile && id !== undefined) window.turnstile.reset(id);
        started.value = String(Date.now());
      }, 0);
    });
  }

  async function submitForm(form) {
    if (form.dataset.fySubmitting === "true") return;
    form.dataset.fySubmitting = "true";
    var button = form.querySelector('[type="submit"]');
    var defaultText = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = "Submitting...";
    }
    setStatus(form, "", false);

    try {
      var response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });
      var payload = await response.json().catch(function () { return {}; });
      if (!response.ok || !payload.ok) throw new Error(payload.error || "The inquiry could not be sent.");
      form.reset();
      setStatus(form, "Thanks, your inquiry has been sent. We will reply as soon as possible.", false);
      if (typeof window.fyTrack === "function") window.fyTrack("form_submit_success", { form_id: form.id || "inquiry" });
    } catch (error) {
      var message = error && error.message ? error.message : "The inquiry could not be sent. Please try again.";
      setStatus(form, message + " You can also email info@fypromogifts.com or chat on WhatsApp.", true);
      var id = widgetIds.get(form);
      if (window.turnstile && id !== undefined) window.turnstile.reset(id);
    } finally {
      delete form.dataset.fySubmitting;
      if (button) {
        button.disabled = false;
        button.textContent = defaultText;
      }
    }
  }

  function init() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("form")).filter(function (form) {
      return form.matches('[action="/api/inquiry"], [action*="formspree.io/f/"]');
    });
    forms.forEach(prepareForm);

    document.addEventListener("submit", function (event) {
      var form = event.target;
      if (!forms.includes(form)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      var token = form.querySelector('input[name="cf-turnstile-response"]');
      if (!token || !token.value) {
        setStatus(form, "Please complete the security check before submitting.", true);
        return;
      }
      if (typeof window.fyTrack === "function") window.fyTrack("form_submit_attempt", { form_id: form.id || "inquiry" });
      submitForm(form);
    }, true);

    var style = document.createElement("style");
    style.textContent = ".fy-turnstile-wrap{grid-column:1/-1;min-height:65px;max-width:100%;margin:4px 0 12px}.fy-turnstile-wrap iframe{max-width:100%}.fy-form-status{margin-top:10px}.fy-form-status.is-error{color:#a4262c}";
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}());
