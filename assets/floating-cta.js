(function () {
  var WA_URL = "https://wa.me/8615869117529";
  var CONTACT_URL = "/#contact";
  var STYLE_ID = "fy-floating-cta-style";
  var ROOT_ID = "fy-floating-cta";
  var LEGACY_SELECTORS = [
    ".whatsapp-float",
    ".floating-whatsapp",
    ".fixed-whatsapp",
    ".fixed-cta",
    ".wa-float",
    ".float-whatsapp",
    ".quick-contact",
    ".quick-actions",
    ".floating-contact",
    "#whatsapp-float",
    "#floating-whatsapp",
    "#fixed-whatsapp",
    "#fixed-cta"
  ];

  function isHomePage() {
    var path = window.location.pathname.replace(/\/index\.html$/i, "/");
    return path === "/" || path === "";
  }

  function normalizeInquiryFields() {
    ["inqWhatsapp", "inqCompany"].forEach(function (id) {
      var field = document.getElementById(id);
      if (!field) return;
      field.required = false;
      field.removeAttribute("required");
      var label = field.closest(".field");
      label = label ? label.querySelector("label") : null;
      if (label) {
        label.textContent = label.textContent.replace(/\s*\*+\s*$/, "");
      }
    });
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".fy-floating-cta{position:fixed!important;left:auto!important;right:22px!important;top:auto!important;bottom:calc(22px + env(safe-area-inset-bottom,0px))!important;z-index:2147483000;display:flex;flex-direction:column;gap:12px;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}" +
      ".fy-floating-cta a{box-sizing:border-box;position:relative;display:inline-flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:999px;text-decoration:none;pointer-events:auto;transform:translateZ(0);outline:none;transition:transform .18s ease,box-shadow .18s ease}" +
      ".fy-floating-cta a:before,.fy-floating-cta a:after{content:none!important;display:none!important}" +
      ".fy-floating-cta svg{display:block;flex:0 0 auto}" +
      ".fy-floating-wa{background:linear-gradient(145deg,#1fb45f,#12844a);color:#fff;box-shadow:0 16px 32px rgba(18,132,74,.30),0 0 0 1px rgba(255,255,255,.20) inset}" +
      ".fy-floating-form{background:linear-gradient(180deg,#f4c76f,#d99b38);color:#16110a;box-shadow:0 16px 32px rgba(217,155,56,.30),0 0 0 1px rgba(255,255,255,.22) inset}" +
      ".fy-floating-cta a:hover,.fy-floating-cta a:focus-visible{transform:translateY(-2px);box-shadow:0 20px 40px rgba(7,23,36,.22),0 0 0 1px rgba(255,255,255,.24) inset}" +
      ".fy-floating-tip{position:absolute;right:calc(100% + 10px);top:50%;white-space:nowrap;transform:translateY(-50%) translateX(4px);opacity:0;visibility:hidden;border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 11px;background:rgba(7,23,36,.94);color:#fff8ee;font-size:12px;font-weight:850;line-height:1;box-shadow:0 10px 24px rgba(7,23,36,.22);transition:opacity .18s ease,transform .18s ease,visibility .18s ease}" +
      ".fy-floating-cta a:hover .fy-floating-tip,.fy-floating-cta a:focus-visible .fy-floating-tip{opacity:1;visibility:visible;transform:translateY(-50%) translateX(0)}" +
      "@media(max-width:720px){.nav .nav-actions{display:none!important}.hero-ctas a[href*='wa.me']{display:none!important}.hero-line{white-space:normal!important}.hero-copy h1{max-width:100%!important;font-size:clamp(36px,10vw,44px)!important}.hero-grid,.hero-copy{min-width:0!important}.fy-floating-cta{left:auto!important;right:16px!important;bottom:calc(16px + env(safe-area-inset-bottom,0px))!important;gap:10px}.fy-floating-cta a{width:48px;height:48px}.fy-floating-wa svg{width:27px;height:27px}.fy-floating-form svg{width:22px;height:22px}.fy-floating-tip{display:none}}" +
      "@media(prefers-reduced-motion:reduce){.fy-floating-cta a{transition:none}}";
    document.head.appendChild(style);
  }

  function removeLegacyFloating() {
    LEGACY_SELECTORS.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) {
        if (node.id === ROOT_ID || (node.closest && node.closest("#" + ROOT_ID))) return;
        node.remove();
      });
    });

    document.querySelectorAll('a[href*="wa.me/8615869117529"]').forEach(function (node) {
      if (node.closest("#" + ROOT_ID) || node.closest(".nav") || node.closest(".hero") || node.closest(".footer")) return;
      var style = window.getComputedStyle(node);
      var className = String(node.className || "").toLowerCase();
      var id = String(node.id || "").toLowerCase();
      if (style.position === "fixed" || /float|fixed|whatsapp/.test(className + " " + id)) {
        node.remove();
      }
    });
  }

  function whatsappIcon() {
    return (
      '<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M16.02 4.2A11.63 11.63 0 0 0 6.08 21.84L4.7 27.02l5.3-1.39a11.6 11.6 0 0 0 6.02 1.67h.01A11.56 11.56 0 0 0 27.6 15.75 11.58 11.58 0 0 0 16.02 4.2Zm0 20.96h-.01a9.43 9.43 0 0 1-4.8-1.31l-.34-.2-3.14.82.84-3.06-.22-.35a9.48 9.48 0 1 1 7.67 4.1Zm5.19-7.09c-.28-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.16.19-.33.21-.61.07-.28-.14-1.2-.44-2.28-1.41a8.55 8.55 0 0 1-1.58-1.97c-.17-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.49-.07-.14-.64-1.54-.87-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.49.07-.75.35-.26.28-.99.97-.99 2.37 0 1.39 1.02 2.74 1.16 2.93.14.19 2 3.05 4.84 4.27.68.29 1.2.46 1.62.59.68.22 1.29.19 1.78.12.54-.08 1.68-.69 1.92-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.54-.33Z"/>' +
      "</svg>"
    );
  }

  function quoteIcon() {
    return (
      '<svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M6.75 3.75h10.5A1.75 1.75 0 0 1 19 5.5v13a1.75 1.75 0 0 1-1.75 1.75H6.75A1.75 1.75 0 0 1 5 18.5v-13a1.75 1.75 0 0 1 1.75-1.75Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M8.5 8h7M8.5 12h7M8.5 16h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function mount() {
    if (!document.body) return;
    normalizeInquiryFields();
    removeLegacyFloating();
    injectStyle();
    var existing = document.getElementById(ROOT_ID);
    if (existing) existing.remove();

    var root = document.createElement("div");
    root.id = ROOT_ID;
    root.className = "fy-floating-cta";
    root.setAttribute("aria-label", "Quick contact actions");

    var wa = document.createElement("a");
    wa.className = "fy-floating-wa";
    wa.href = WA_URL;
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Chat on WhatsApp");
    wa.innerHTML = whatsappIcon() + '<span class="fy-floating-tip">Chat on WhatsApp</span>';

    var quote = document.createElement("a");
    quote.className = "fy-floating-form";
    quote.href = CONTACT_URL;
    quote.setAttribute("aria-label", "Open inquiry form");
    quote.innerHTML = quoteIcon() + '<span class="fy-floating-tip">Open inquiry form</span>';
    quote.addEventListener("click", function (event) {
      if (!isHomePage()) return;
      var contact = document.getElementById("contact");
      if (!contact) return;
      event.preventDefault();
      contact.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", "#contact");
      } else {
        window.location.hash = "contact";
      }
    });

    root.appendChild(wa);
    root.appendChild(quote);
    document.body.appendChild(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
  window.addEventListener("pageshow", mount);
})();
