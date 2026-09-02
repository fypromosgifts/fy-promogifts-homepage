const MAX_BODY_BYTES = 22 * 1024 * 1024;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MIN_FILL_TIME_MS = 3000;
const MAX_FILL_TIME_MS = 24 * 60 * 60 * 1000;
const ALLOWED_HOSTS = new Set(["fypromogifts.com", "www.fypromogifts.com"]);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

const textValue = (form, name, maxLength = 500) => {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
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

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.TURNSTILE_SECRET || !isValidEndpoint(env.FORMSPREE_ENDPOINT || "")) {
    return json({ ok: false, error: "Form service is not configured." }, 503);
  }

  if (!isAllowedOrigin(request)) {
    return json({ ok: false, error: "Request origin is not allowed." }, 403);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return json({ ok: false, error: "Invalid form encoding." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "The uploaded file is too large." }, 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Invalid form data." }, 400);
  }

  if (textValue(form, "_gotcha", 200)) {
    return json({ ok: true });
  }

  const startedAt = Number(textValue(form, "form_started_at", 20));
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS) {
    return json({ ok: false, error: "Please refresh the page and try again." }, 400);
  }

  const token = textValue(form, "cf-turnstile-response", 4096);
  if (!token) {
    return json({ ok: false, error: "Please complete the security check." }, 400);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const verificationBody = new FormData();
  verificationBody.set("secret", env.TURNSTILE_SECRET);
  verificationBody.set("response", token);
  if (ip) verificationBody.set("remoteip", ip);
  verificationBody.set("idempotency_key", crypto.randomUUID());

  let verification;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verificationBody,
    });
    verification = await response.json();
  } catch {
    return json({ ok: false, error: "Security check is temporarily unavailable." }, 502);
  }

  if (
    !verification.success ||
    !ALLOWED_HOSTS.has(verification.hostname) ||
    (verification.action && verification.action !== "inquiry")
  ) {
    return json({ ok: false, error: "Security check failed. Please try again." }, 403);
  }

  const name = textValue(form, "name", 120);
  const email = textValue(form, "email", 254);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Please provide a valid name and email." }, 400);
  }

  for (const [key, value] of form.entries()) {
    if (typeof value === "string" && value.length > 5000) {
      return json({ ok: false, error: `The ${key} field is too long.` }, 400);
    }
    if (typeof value !== "string" && value.size > MAX_FILE_BYTES) {
      return json({ ok: false, error: "The uploaded file is too large." }, 413);
    }
  }

  form.delete("cf-turnstile-response");
  form.delete("form_started_at");

  let upstream;
  try {
    upstream = await fetch(env.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    });
  } catch {
    return json({ ok: false, error: "Form service is temporarily unavailable." }, 502);
  }

  if (!upstream.ok) {
    return json({ ok: false, error: "The inquiry could not be sent. Please try again." }, 502);
  }

  return json({ ok: true });
}

export function onRequestGet() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}
