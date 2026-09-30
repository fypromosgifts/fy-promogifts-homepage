const MAX_BODY_BYTES = 22 * 1024 * 1024;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_FIELD_COUNT = 60;
const MAX_TEXT_BYTES = 40 * 1024;
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const MIN_FILL_TIME_MS = 3000;
const MAX_FILL_TIME_MS = 24 * 60 * 60 * 1000;
const DUPLICATE_WINDOW_SECONDS = 5 * 60;
const ALLOWED_HOSTS = new Set(["fypromogifts.com", "www.fypromogifts.com"]);
const ALLOWED_FILE_EXTENSIONS = /\.(?:ai|eps|jpe?g|pdf|png|svg)$/i;
const SAFE_FIELD_NAME = /^[a-z][a-z0-9_]{0,63}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /(?:https?:\/\/|www\.)/gi;

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "moakt.com",
  "sharklasers.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const json = (body, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...extraHeaders,
    },
  });

const textValue = (form, name) => {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
};

const logRejection = (request, reason) => {
  console.warn(JSON.stringify({
    event: "inquiry_rejected",
    reason,
    country: request.cf?.country || "unknown",
    ray: request.headers.get("cf-ray") || "unknown",
  }));
};

const reject = (request, reason, message, status = 400, extraHeaders = {}) => {
  logRejection(request, reason);
  return json({ ok: false, error: message }, status, extraHeaders);
};

const isAllowedOrigin = (request) => {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};

const hasAllowedFetchMetadata = (request) => {
  const site = request.headers.get("sec-fetch-site");
  return !site || site === "same-origin";
};

const isValidEndpoint = (value) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "formspree.io" &&
      /^\/f\/[a-z0-9]+$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
};

const sourcePath = (request) => {
  const referer = request.headers.get("referer");
  if (!referer) return "/unknown";
  try {
    const url = new URL(referer);
    if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) return "/unknown";
    return url.pathname.slice(0, 300);
  } catch {
    return "/unknown";
  }
};

const inquirySubject = (path) => {
  if (path === "/promotional-products/drinkware/") {
    return "Custom Promotional Drinkware Inquiry - FY PromoGifts";
  }
  return "New Website Inquiry - FY PromoGifts";
};

const validateFields = (request, form) => {
  const entries = Array.from(form.entries());
  if (entries.length > MAX_FIELD_COUNT) {
    return reject(request, "too_many_fields", "The form contains too many fields.");
  }

  let textBytes = 0;
  let linkCount = 0;
  for (const [key, value] of entries) {
    if (typeof value === "string") {
      textBytes += new TextEncoder().encode(value).byteLength;
      if (!["page_url", "source", "source_page"].includes(key)) {
        linkCount += (value.match(URL_PATTERN) || []).length;
      }
      if (value.length > 5000) {
        return reject(request, "field_too_long", `The ${key} field is too long.`);
      }
      if (/\u0000/.test(value)) {
        return reject(request, "invalid_control_character", "The form contains invalid text.");
      }
    } else {
      if (value.size > MAX_FILE_BYTES) {
        return reject(request, "file_too_large", "The uploaded file is too large.", 413);
      }
      if (value.name && !ALLOWED_FILE_EXTENSIONS.test(value.name)) {
        return reject(request, "file_type_not_allowed", "Please upload a JPG, PNG, PDF, AI, EPS or SVG file.", 415);
      }
    }
  }

  if (textBytes > MAX_TEXT_BYTES) {
    return reject(request, "text_payload_too_large", "The form contains too much text.", 413);
  }
  if (linkCount > 3) {
    return reject(request, "too_many_links", "Please remove extra links and try again.");
  }
  return null;
};

const normalizedEmail = (value) => value.trim().toLowerCase();

const isDisposableEmail = (email) => {
  const domain = email.split("@").pop() || "";
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
};

const verifyTurnstile = async (request, secret, token) => {
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const verificationBody = new FormData();
  verificationBody.set("secret", secret);
  verificationBody.set("response", token);
  if (ip) verificationBody.set("remoteip", ip);
  verificationBody.set("idempotency_key", crypto.randomUUID());

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: verificationBody,
  });
  if (!response.ok) throw new Error(`Turnstile returned ${response.status}`);
  return response.json();
};

const digest = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const duplicateRequest = async (request, form, email, path) => {
  if (typeof caches === "undefined" || !caches.default) return null;
  const fingerprint = [
    request.headers.get("CF-Connecting-IP") || "unknown",
    email,
    path,
    textValue(form, "product"),
    textValue(form, "products"),
    textValue(form, "quantity"),
    textValue(form, "message"),
  ].join("\n");
  const key = await digest(fingerprint);
  return new Request(`https://inquiry-dedup.fypromogifts.invalid/${key}`);
};

const forwardForm = (form, path) => {
  const outgoing = new FormData();
  for (const [key, value] of form.entries()) {
    if (
      key.startsWith("_") ||
      key === "cf-turnstile-response" ||
      key === "form_started_at" ||
      key === "company_website_confirm" ||
      key === "source_page" ||
      !SAFE_FIELD_NAME.test(key)
    ) {
      continue;
    }
    if (typeof value === "string") outgoing.append(key, value.trim());
    else outgoing.append(key, value, value.name);
  }
  outgoing.set("source_page", path);
  outgoing.set("_subject", inquirySubject(path));
  return outgoing;
};

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.TURNSTILE_SECRET || !isValidEndpoint(env.FORMSPREE_ENDPOINT || "")) {
    return reject(request, "service_not_configured", "Form service is not configured.", 503);
  }

  if (!isAllowedOrigin(request) || !hasAllowedFetchMetadata(request)) {
    return reject(request, "origin_not_allowed", "Request origin is not allowed.", 403);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return reject(request, "invalid_encoding", "Invalid form encoding.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(declaredLength) || declaredLength < 0 || declaredLength > MAX_BODY_BYTES) {
    return reject(request, "body_too_large", "The uploaded file is too large.", 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return reject(request, "invalid_form_data", "Invalid form data.");
  }

  if (textValue(form, "_gotcha") || textValue(form, "company_website_confirm")) {
    console.info(JSON.stringify({ event: "inquiry_honeypot_caught" }));
    return json({ ok: true });
  }

  const startedAt = Number(textValue(form, "form_started_at"));
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS) {
    return reject(request, "invalid_fill_time", "Please refresh the page and try again.");
  }

  const fieldError = validateFields(request, form);
  if (fieldError) return fieldError;

  const name = textValue(form, "name");
  const email = normalizedEmail(textValue(form, "email"));
  if (name.length < 2 || name.length > 120 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return reject(request, "invalid_identity", "Please provide a valid name and email.");
  }
  if (isDisposableEmail(email)) {
    return reject(request, "disposable_email", "Please use a permanent work or personal email address.");
  }

  const token = textValue(form, "cf-turnstile-response");
  if (!token) {
    return reject(request, "turnstile_missing", "Please complete the security check.");
  }
  if (token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    return reject(request, "turnstile_token_too_long", "Security check failed. Please try again.");
  }

  let verification;
  try {
    verification = await verifyTurnstile(request, env.TURNSTILE_SECRET, token);
  } catch (error) {
    console.error(JSON.stringify({
      event: "turnstile_unavailable",
      error: error instanceof Error ? error.message : String(error),
    }));
    return json({ ok: false, error: "Security check is temporarily unavailable." }, 502);
  }

  const challengeTime = Date.parse(verification.challenge_ts || "");
  if (
    verification.success !== true ||
    !ALLOWED_HOSTS.has(verification.hostname) ||
    verification.action !== "inquiry" ||
    !Number.isFinite(challengeTime) ||
    Math.abs(Date.now() - challengeTime) > 6 * 60 * 1000
  ) {
    return reject(request, "turnstile_failed", "Security check failed. Please try again.", 403);
  }

  const path = sourcePath(request);
  let duplicateKey = null;
  try {
    duplicateKey = await duplicateRequest(request, form, email, path);
    if (duplicateKey && await caches.default.match(duplicateKey)) {
      return json({ ok: true, duplicate: true });
    }
  } catch (error) {
    console.error(JSON.stringify({
      event: "inquiry_dedup_read_failed",
      error: error instanceof Error ? error.message : String(error),
    }));
  }

  let upstream;
  try {
    upstream = await fetch(env.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: forwardForm(form, path),
    });
  } catch (error) {
    console.error(JSON.stringify({
      event: "form_service_unavailable",
      error: error instanceof Error ? error.message : String(error),
    }));
    return json({ ok: false, error: "Form service is temporarily unavailable." }, 502);
  }

  if (!upstream.ok) {
    console.error(JSON.stringify({ event: "form_service_rejected", status: upstream.status }));
    return json({ ok: false, error: "The inquiry could not be sent. Please try again." }, 502);
  }

  if (duplicateKey) {
    try {
      await caches.default.put(duplicateKey, new Response("1", {
        headers: { "cache-control": `public, max-age=${DUPLICATE_WINDOW_SECONDS}` },
      }));
    } catch (error) {
      console.error(JSON.stringify({
        event: "inquiry_dedup_write_failed",
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  }

  console.info(JSON.stringify({ event: "inquiry_forwarded", source_path: path }));
  return json({ ok: true });
}

export function onRequestGet() {
  return json({ ok: false, error: "Method not allowed." }, 405, { allow: "POST" });
}
