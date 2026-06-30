(function () {
  var WA_URL = "https://wa.me/8615869117529";
  var FORM_URL = "/contact/";
  var STYLE_ID = "fy-floating-cta-style";
  var ROOT_ID = "fy-floating-cta";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      ".fy-floating-cta{position:fixed;inset:auto 0 0 0;z-index:2147483000;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}" +
      ".fy-floating-cta a{box-sizing:border-box;position:fixed;bottom:calc(24px + env(safe-area-inset-bottom,0px));display:inline-flex;align-items:center;justify-content:center;text-decoration:none;pointer-events:auto;outline:none}" +
      ".fy-floating-cta svg{display:block;flex:0 0 auto}" +
      ".fy-floating-wa{left:24px;width:64px;height:64px;border-radius:999px;background:linear-gradient(145deg,#1fb45f,#12844a);color:#fff;box-shadow:0 16px 34px rgba(18,132,74,.32),0 0 0 1px rgba(255,255,255,.18) inset}" +
      ".fy-floating-wa:hover,.fy-floating-wa:focus-visible{transform:scale(1.05);box-shadow:0 20px 42px rgba(18,132,74,.42),0 0 0 1px rgba(255,255,255,.24) inset}" +
      ".fy-floating-form{right:24px;min-height:54px;padding:0 23px;border-radius:999px;gap:10px;background:linear-gradient(180deg,#f4c76f,#d99b38);color:#16110a;font-size:15px;font-weight:900;box-shadow:0 16px 34px rgba(217,155,56,.30),0 0 0 7px rgba(217,155,56,.10)}" +
      ".fy-floating-form:hover,.fy-floating-form:focus-visible{transform:translateY(-1px);background:linear-gradient(180deg,#ffd27a,#d99b38)}" +
      "@media(max-width:720px){.fy-floating-cta a{bottom:calc(16px + env(safe-area-inset-bottom,0px))}.fy-floating-wa{left:16px;width:56px;height:56px}.fy-floating-wa svg{width:29px;height:29px}.fy-floating-form{right:16px;min-height:48px;padding:0 16px;gap:8px;font-size:13px}.fy-floating-form svg{width:17px;height:17px}}";
    document.head.appendChild(style);
  }

  function whatsappIcon() {
    return '<svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.02 4.2A11.63 11.63 0 0 0 6.08 21.84L4.7 27.02l5.3-1.39a11.6 11.6 0 0 0 6.02 1.67h.01A11.56 11.56 0 0 0 27.6 15.75 11.58 11.58 0 0 0 16.02 4.2Zm0 20.96h-.01a9.43 9.43 0 0 1-4.8-1.31l-.34-.2-3.14.82.84-3.06-.22-.35a9.48 9.48 0 1 1 7.67 4.1Zm5.19-7.09c-.28-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.11-.16.19-.33.21-.61.07-.28-.14-1.2-.44-2.28-1.41a8.55 8.55 0 0 1-1.58-1.97c-.17-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.49-.07-.14-.64-1.54-.87-2.11-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.49.07-.75.35-.26.28-.99.97-.99 2.37 0 1.39 1.02 2.74 1.16 2.93.14.19 2 3.05 4.84 4.27.68.29 1.2.46 1.62.59.68.22 1.29.19 1.78.12.54-.08 1.68-.69 1.92-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.54-.33Z"/></svg>';
  }

  function formIcon() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5.75A2.75 2.75 0 0 1 7.75 3h8.5A2.75 2.75 0 0 1 19 5.75v6.5A2.75 2.75 0 0 1 16.25 15H11l-4.4 3.45A1 1 0 0 1 5 17.66V5.75Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 7.5h7M8.5 10.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
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
    wa.innerHTML = whatsappIcon();

    var form = document.createElement("a");
    form.className = "fy-floating-form";
    form.href = FORM_URL;
    form.setAttribute("aria-label", "Open inquiry form");
    form.innerHTML = "<span>Inquiry Form</span>" + formIcon();

    root.appendChild(wa);
    root.appendChild(form);
    document.body.appendChild(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
  window.addEventListener("pageshow", mount);
})();
