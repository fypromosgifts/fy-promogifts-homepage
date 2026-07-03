(function () {
  var WA_URL = "https://wa.me/8615869117529";
  var CONTACT_URL = "/#contact";
  var STYLE_ID = "fy-floating-cta-style";
  var ROOT_ID = "fy-floating-cta";

  function isHomePage() {
    var path = window.location.pathname.replace(/\/index\.html$/i, "/");
    return path === "/" || path === "";
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".fy-floating-cta{position:fixed;inset:auto 0 0 0;z-index:2147483000;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}" +
      ".fy-floating-cta a{box-sizing:border-box;position:fixed;bottom:calc(24px + env(safe-area-inset-bottom,0px));display:inline-flex;align-items:center;justify-content:center;text-decoration:none;pointer-events:auto;transform:translateZ(0);will-change:transform,box-shadow;outline:none}" +
      ".fy-floating-cta svg{display:block;flex:0 0 auto}" +
      ".fy-floating-wa{position:fixed!important;z-index:2147483001!important;left:24px;width:64px;height:64px;border-radius:999px;background:linear-gradient(145deg,#1fb45f,#12844a);color:#fff;box-shadow:0 16px 34px rgba(18,132,74,.32),0 0 0 1px rgba(255,255,255,.18) inset;animation:fyWaBreath 2.7s ease-in-out infinite}" +
      ".fy-floating-wa:before{content:'';position:absolute;inset:-9px;border-radius:inherit;background:rgba(31,180,95,.22);z-index:-1;animation:fyWaHalo 2.7s ease-out infinite}" +
      ".fy-floating-wa:hover,.fy-floating-wa:focus-visible{transform:translateZ(0) scale(1.05);box-shadow:0 20px 42px rgba(18,132,74,.42),0 0 0 1px rgba(255,255,255,.24) inset}" +
      ".fy-floating-form{position:fixed!important;z-index:2147483001!important;right:24px;min-height:54px;padding:0 23px;border-radius:999px;gap:10px;background:linear-gradient(180deg,#f4c76f,#d99b38);color:#16110a;font-size:15px;font-weight:900;letter-spacing:.01em;box-shadow:0 16px 34px rgba(217,155,56,.30),0 0 0 7px rgba(217,155,56,.10);animation:fyQuoteGlow 3.2s ease-in-out infinite}" +
      ".fy-floating-form:hover,.fy-floating-form:focus-visible{transform:translateY(-1px);background:linear-gradient(180deg,#ffd27a,#d99b38);box-shadow:0 20px 42px rgba(217,155,56,.42),0 0 0 8px rgba(217,155,56,.14)}" +
      ".fy-floating-tip{position:absolute;bottom:calc(100% + 10px);left:50%;white-space:nowrap;transform:translateX(-50%) translateY(4px);opacity:0;visibility:hidden;border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:7px 10px;background:rgba(7,23,36,.92);color:#fff8ee;font-size:12px;font-weight:800;line-height:1;box-shadow:0 10px 24px rgba(7,23,36,.22);transition:opacity .18s ease,transform .18s ease,visibility .18s ease}" +
      ".fy-floating-form .fy-floating-tip{left:auto;right:0;transform:translateY(4px)}" +
      ".fy-floating-cta a:hover .fy-floating-tip,.fy-floating-cta a:focus-visible .fy-floating-tip{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}" +
      ".fy-floating-form:hover .fy-floating-tip,.fy-floating-form:focus-visible .fy-floating-tip{transform:translateY(0)}" +
      "@keyframes fyWaBreath{0%,100%{box-shadow:0 16px 34px rgba(18,132,74,.30),0 0 0 1px rgba(255,255,255,.18) inset}50%{box-shadow:0 18px 40px rgba(18,132,74,.42),0 0 0 1px rgba(255,255,255,.22) inset}}" +
      "@keyframes fyWaHalo{0%{opacity:.55;transform:scale(.9)}70%,100%{opacity:0;transform:scale(1.34)}}" +
      "@keyframes fyQuoteGlow{0%,100%{box-shadow:0 16px 34px rgba(217,155,56,.28),0 0 0 7px rgba(217,155,56,.09)}50%{box-shadow:0 18px 40px rgba(217,155,56,.38),0 0 0 9px rgba(217,155,56,.13)}}" +
      "@media(max-width:720px){.fy-floating-cta a{bottom:calc(16px + env(safe-area-inset-bottom,0px))}.fy-floating-wa{left:16px;width:56px;height:56px}.fy-floating-wa svg{width:29px;height:29px}.fy-floating-form{right:16px;min-height:48px;padding:0 16px;gap:8px;font-size:13px}.fy-floating-form svg{width:17px;height:17px}.fy-floating-tip{display:none}}" +
      "@media(prefers-reduced-motion:reduce){.fy-floating-wa,.fy-floating-wa:before,.fy-floating-form{animation:none}}";
    document.head.appendChild(style);
  }

  function whatsappIcon() {
    return (
      '<svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M16.02 4.2A11.63 11.63 0 0 0 6.08 21.84L4.7 27.02l5.3-1.39a11.6 11.6 0 0 0 6.02 1.67h.01A11.56 11.56 0 0 0 27.6 15.75 11.58 11.58 0 0 0 16.02 4.2Zm0 20.96h-.01a9.43 9.43 0 0 1-4.8-1.31l-.34-.2-3.14.82.84-3.06-.22-.35a9.48 9.48 0 1 1 7.67 4.1Zm5.19-7.09c-.28-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.16.19-.33.21-.61.07-.28-.14-1.2-.44-2.28-1.41a8.55 8.55 0 0 1-1.58-1.97c-.17-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.49-.07-.14-.64-1.54-.87-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.49.07-.75.35-.26.28-.99.97-.99 2.37 0 1.39 1.02 2.74 1.16 2.93.14.19 2 3.05 4.84 4.27.68.29 1.2.46 1.62.59.68.22 1.29.19 1.78.12.54-.08 1.68-.69 1.92-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.54-.33Z"/>' +
      "</svg>"
    );
  }

  function quoteIcon() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M5 5.75A2.75 2.75 0 0 1 7.75 3h8.5A2.75 2.75 0 0 1 19 5.75v6.5A2.75 2.75 0 0 1 16.25 15H11l-4.4 3.45A1 1 0 0 1 5 17.66V5.75Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M8.5 7.5h7M8.5 10.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      "</svg>"
    );
  }

  function lockFixedLayer(el) {
    el.style.setProperty("position", "fixed", "important");
    el.style.setProperty("z-index", "2147483001", "important");
  }

  function mount() {
    if (!document.body) return;
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
    lockFixedLayer(wa);

    var quote = document.createElement("a");
    quote.className = "fy-floating-form";
    quote.href = CONTACT_URL;
    quote.setAttribute("aria-label", "Open inquiry form");
    quote.innerHTML = "<span>Inquiry Form</span>" + quoteIcon() + '<span class="fy-floating-tip">Send logo, quantity &amp; deadline</span>';
    lockFixedLayer(quote);
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
