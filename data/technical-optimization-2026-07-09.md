# Technical Optimization Record - 2026-07-09

Status: Completed after local checks and production deployment verification.

## Data basis

Cloudflare recent 24h:
- Visits: 4
- Page Views: 10
- Direct: 4
- US: 4
- LCP Good: 63%
- LCP Poor: 38%
- LCP P75: 4,716ms
- LCP P90/P99: 10,992ms

GSC recent 7d:
- Impressions: 27
- Clicks: 0
- Average position: 14.6

## Pages checked

- Home: /
- Blog index: /blog/
- Buyer Questions: /promotional-gifts-buyer-questions/
- Latest Blog: /promotional-drinkware-for-corporate-gifts/

## LCP observations

- Home: hero product kit image (`assets/image-01.png`) is the likely LCP image. Original PNG is about 1.79MB.
- Blog index: hero/title text is first viewport, with first visible article card image below. First card image can become LCP on shorter viewports.
- Buyer Questions: no hero image; likely LCP is the H1/text block.
- Latest Drinkware Blog: split hero product image (`40oz-handle-tumbler-collection.webp`) and H1 are first viewport candidates.

## Changes made

- Added WebP derivatives for the home hero image:
  - `assets/image-01-hero-1200.webp`
  - `assets/image-01-hero-760.webp`
- Added one preload for the home hero image only.
- Updated home hero markup to use `<picture>` with WebP `srcset` and `sizes`, while preserving the original PNG fallback.
- Added `fetchpriority="high"` to the actual first-viewport image on Home, Blog index, and Latest Blog.
- Added explicit `width` and `height` to images missing dimensions on checked pages.
- Added `loading="lazy"` and `decoding="async"` to non-first-viewport images.
- Kept homepage 8 real product showcase images unchanged; they remain lazy-loaded.
- Added `assets/fy-attribution.js` for session-based UTM attribution, hidden form fields, and enriched dataLayer events.
- Added attribution script to the checked pages.
- Updated mobile floating CTA position to the right side with slightly smaller icons to reduce text overlap.
- Confirmed latest Blog hero uses left text / right image on desktop and text-first stack on mobile. Hero image uses `object-fit: contain` to avoid cropping product body.
- Blog detail layout rule already exists in `AGENTS.md`; no separate build template exists in this static site.

## UTM and attribution

Storage: `sessionStorage.fy_attribution_v1`

Supported fields:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `landing_page`
- `initial_referrer`
- `current_page`
- `session_start_time`

Session TTL used by the script: 2 hours.

Form hidden fields are added dynamically to every form when the script runs.

## dataLayer events handled

- `blog_cta_click`
- `recommended_product_click`
- `whatsapp_click`
- `contact_form_open`
- `contact_form_submit`
- `internal_link_click`

Existing homepage `fyTrack` events are preserved. The new attribution layer enriches dataLayer payloads and avoids adding a duplicate `whatsapp_click` when the old tracker is present.

## SEO / Schema

- No SEO title/meta changes were made; existing titles/descriptions were not obviously broken.
- Latest Blog retains one H1, canonical, Article schema, BreadcrumbList, and a single FAQPage schema.
- FAQPage JSON-LD parsed locally.

## Local checks

- Static checks passed for H1 count, canonical count, image dimensions, image lazy/high-priority rules, and JSON-LD parsing.
- Local simple server returned 200 for the four checked pages and static assets.
- Local simple server does not process Cloudflare `_redirects`, so `/contact/` is verified on production instead.
- Mobile screenshots generated for 375px, 390px, and 430px widths. Chrome headless on this machine has a known narrow-width capture quirk, so a stable 500px visual screenshot was also reviewed.

## Unverified or limited checks

- Real Cloudflare Web Vitals improvement cannot be claimed until new field data arrives.
- No real Formspree submission was sent, to avoid sending test inquiries.
- Browser CDP click automation was unstable in the local environment; dataLayer behavior was validated by code path and static/runtime script checks rather than a full automated click transcript.
