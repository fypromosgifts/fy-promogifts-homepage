(function () {
  var KEY = "fy_attribution_v1";
  var TTL = 2 * 60 * 60 * 1000;
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var DATA_KEYS = UTM_KEYS.concat(["landing_page", "initial_referrer", "current_page", "session_start_time"]);
  var recent = [];

  function now() {
    return Date.now ? Date.now() : new Date().getTime();
  }

  function clean(value, fallback) {
    value = String(value || "").replace(/\s+/g, " ").trim();
    return value || fallback || "not_available";
  }

  function slug() {
    var path = location.pathname.replace(/^\/|\/$/g, "");
    return path || "home";
  }

  function readStored() {
    try {
      var raw = sessionStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data.session_start_time || now() - Number(data.session_start_time) > TTL) {
        sessionStorage.removeItem(KEY);
        return null;
      }
      return data;
    } catch (error) {
      return null;
    }
  }

  function collect() {
    var params = new URLSearchParams(location.search);
    var stored = readStored() || {};
    var hasNewUtm = UTM_KEYS.some(function (key) {
      return params.has(key);
    });
    var data = {};
    UTM_KEYS.forEach(function (key) {
      data[key] = hasNewUtm ? clean(params.get(key)) : clean(stored[key]);
    });
    data.landing_page = hasNewUtm || !stored.landing_page ? location.pathname + location.search : clean(stored.landing_page);
    data.initial_referrer = hasNewUtm || !stored.initial_referrer ? clean(document.referrer) : clean(stored.initial_referrer);
    data.current_page = location.pathname;
    data.session_start_time = hasNewUtm || !stored.session_start_time ? now() : stored.session_start_time;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch (error) {}
    return data;
  }

  var attribution = collect();

  function enrich(payload) {
    payload = payload || {};
    DATA_KEYS.forEach(function (key) {
      if (!payload[key]) payload[key] = attribution[key] || "not_available";
    });
    if (!payload.page_path) payload.page_path = location.pathname;
    if (!payload.article_slug) payload.article_slug = slug();
    return payload;
  }

  function signature(payload) {
    return [
      payload.event,
      payload.page_path,
      payload.article_slug,
      payload.cta_text || payload.link_text || payload.product_name || payload.button_location || "",
      payload.cta_target || payload.destination_url || payload.link_url || ""
    ].join("|");
  }

  function shouldPush(payload) {
    var cutoff = now() - 900;
    recent = recent.filter(function (item) {
      return item.time > cutoff;
    });
    var sig = signature(payload);
    if (recent.some(function (item) { return item.sig === sig; })) return false;
    recent.push({ sig: sig, time: now() });
    return true;
  }

  window.dataLayer = window.dataLayer || [];
  if (!window.dataLayer.__fyAttributionPatched) {
    var originalPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function () {
      var args = Array.prototype.slice.call(arguments).map(function (item) {
        return item && item.event ? enrich(item) : item;
      });
      return originalPush.apply(window.dataLayer, args);
    };
    window.dataLayer.__fyAttributionPatched = true;
  }

  window.fyAttribution = {
    get: function () { return Object.assign({}, attribution, { current_page: location.pathname }); },
    enrich: enrich
  };

  window.fyTrackEvent = function (eventName, params) {
    var payload = enrich(Object.assign({ event: eventName }, params || {}));
    if (!shouldPush(payload)) return;
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", eventName, payload);
    window.dispatchEvent(new CustomEvent("fy:track", { detail: { name: eventName, params: payload } }));
  };

  function ensureHidden(form, name, value) {
    var field = form.querySelector('input[name="' + name + '"]');
    if (!field) {
      field = document.createElement("input");
      field.type = "hidden";
      field.name = name;
      form.appendChild(field);
    }
    field.value = value || "not_available";
  }

  function applyForms() {
    document.querySelectorAll("form").forEach(function (form) {
      var data = window.fyAttribution.get();
      DATA_KEYS.forEach(function (key) {
        ensureHidden(form, key, data[key]);
      });
    });
  }

  function trackClick(event) {
    var target = event.target.closest && event.target.closest("a,button");
    if (!target) return;
    var href = target.getAttribute("href") || "";
    var text = clean(target.textContent || target.getAttribute("aria-label") || target.id);
    var pagePath = location.pathname;
    if (href.indexOf("wa.me/") > -1 && typeof window.fyTrack !== "function") {
      window.fyTrackEvent("whatsapp_click", {
        page_path: pagePath,
        button_location: target.closest("#fy-floating-cta") ? "floating_cta" : "page_link",
        article_slug: slug(),
        cta_target: href
      });
    }
    if (target.closest(".cta") || target.classList.contains("read")) {
      window.fyTrackEvent("blog_cta_click", {
        page_path: pagePath,
        article_slug: slug(),
        cta_text: text,
        cta_target: href || "not_available"
      });
    }
    if (target.closest(".showcase-card")) {
      window.fyTrackEvent("recommended_product_click", {
        product_name: clean(target.closest(".showcase-card").querySelector("h3") && target.closest(".showcase-card").querySelector("h3").textContent),
        product_type: clean(target.closest(".product-showcase") && target.closest(".product-showcase").querySelector("h2") && target.closest(".product-showcase").querySelector("h2").textContent),
        destination_url: href || "not_available",
        page_path: pagePath
      });
    }
    if (href === "/contact/" || href === "#contact" || href.indexOf("#contact") > -1) {
      window.fyTrackEvent("contact_form_open", {
        page_path: pagePath,
        button_location: target.closest("#fy-floating-cta") ? "floating_cta" : "page_link",
        article_slug: slug(),
        cta_target: href
      });
    }
    if (href && href.charAt(0) === "/" && href.indexOf("wa.me") === -1) {
      window.fyTrackEvent("internal_link_click", {
        link_text: text,
        destination_url: href,
        page_path: pagePath,
        article_slug: slug()
      });
    }
  }

  function bindForms() {
    document.querySelectorAll("form").forEach(function (form) {
      if (form.__fyAttributionBound) return;
      form.__fyAttributionBound = true;
      form.addEventListener("submit", function () {
        applyForms();
        window.fyTrackEvent("contact_form_submit", {
          page_path: location.pathname,
          form_id: form.id || clean(form.getAttribute("name")),
          article_slug: slug(),
          landing_page: window.fyAttribution.get().landing_page
        });
      }, true);
    });
  }

  function init() {
    attribution.current_page = location.pathname;
    applyForms();
    bindForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("click", trackClick, true);
  window.addEventListener("pageshow", init);
})();
