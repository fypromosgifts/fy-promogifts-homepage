import assert from "node:assert/strict";
import { onRequestGet, onRequestPost } from "../functions/api/inquiry.js";

const endpoint = "https://formspree.io/f/abcdefgh";
const env = { TURNSTILE_SECRET: "test-secret", FORMSPREE_ENDPOINT: endpoint };
const originalFetch = globalThis.fetch;

function request(fields, { origin = "https://www.fypromogifts.com" } = {}) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return new Request("https://www.fypromogifts.com/api/inquiry", {
    method: "POST",
    headers: { origin },
    body,
  });
}

async function bodyOf(response) {
  return { status: response.status, body: await response.json() };
}

assert.equal(onRequestGet().status, 405);

let result = await bodyOf(await onRequestPost({
  request: request({ name: "Test", email: "test@example.com" }),
  env: {},
}));
assert.equal(result.status, 503);

result = await bodyOf(await onRequestPost({
  request: request({ name: "Test", email: "test@example.com" }, { origin: "https://evil.example" }),
  env,
}));
assert.equal(result.status, 403);

let externalCalls = 0;
globalThis.fetch = async () => {
  externalCalls += 1;
  throw new Error("Honeypot requests must not leave the Worker");
};
result = await bodyOf(await onRequestPost({
  request: request({ _gotcha: "bot", form_started_at: String(Date.now() - 5000) }),
  env,
}));
assert.equal(result.status, 200);
assert.equal(externalCalls, 0);

result = await bodyOf(await onRequestPost({
  request: request({ name: "Test", email: "test@example.com", form_started_at: String(Date.now() - 5000) }),
  env,
}));
assert.equal(result.status, 400);

let forwardedForm;
globalThis.fetch = async (url, options) => {
  externalCalls += 1;
  if (String(url).includes("siteverify")) {
    return Response.json({ success: true, hostname: "www.fypromogifts.com", action: "inquiry" });
  }
  assert.equal(url, endpoint);
  forwardedForm = options.body;
  return Response.json({ ok: true });
};
result = await bodyOf(await onRequestPost({
  request: request({
    name: "Test Buyer",
    email: "buyer@example.com",
    form_started_at: String(Date.now() - 5000),
    "cf-turnstile-response": "valid-test-token",
  }),
  env,
}));
assert.equal(result.status, 200);
assert.equal(forwardedForm.get("name"), "Test Buyer");
assert.equal(forwardedForm.has("cf-turnstile-response"), false);
assert.equal(forwardedForm.has("form_started_at"), false);

globalThis.fetch = async () => Response.json({
  success: true,
  hostname: "attacker.example",
  action: "inquiry",
});
result = await bodyOf(await onRequestPost({
  request: request({
    name: "Test Buyer",
    email: "buyer@example.com",
    form_started_at: String(Date.now() - 5000),
    "cf-turnstile-response": "wrong-host-token",
  }),
  env,
}));
assert.equal(result.status, 403);

globalThis.fetch = originalFetch;
console.log("Inquiry Function tests passed.");
