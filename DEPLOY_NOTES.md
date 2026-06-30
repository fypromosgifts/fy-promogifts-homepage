# FY PromoGifts Independent Site Deploy Notes

## 2026-06-26 First-Round Remediation

### Scope

- Working directory: `D:\Documents\独立站-publish`
- Cloudflare Pages project: `fy-promogifts-homepage`
- Production domains:
  - `https://www.fypromogifts.com/`
  - `https://fypromogifts.com/`
  - `https://fy-promogifts-homepage.pages.dev/`

### Files Changed

- `index.html`
  - Unified public contact email to `info@fypromogifts.com`.
  - Kept Formspree endpoint unchanged: `https://formspree.io/f/xgoqqrno`.
  - Added planning/quotation note for example kit combinations.
  - Added product-pill click behavior that prefills the `Products Interested In` field.
  - Kept Products buttons linking to `#contact`.
  - Confirmed canonical uses `https://www.fypromogifts.com/`.
- `kit-studio/index.html`
  - Kept the current quiz and recommendation logic.
  - Added `Example kit concept` and `Customizable kit idea` labels to recommendation output.
  - Added planning/quotation note near recommendations and inside kit notes.
  - Expanded `Send This Kit Idea` message content to include use case, color story, budget, quantity, recommended kit name, included items, MOQ suggestion, logo method, packaging idea, sample time and production time.
  - Kept the current Formspree submission behavior.
- `assets/kit-studio-luxe.css`
  - Added styling for the Kit Studio planning note.
- `custom-products/index.html`
  - Updated visible navigation and copy from the old Kit Builder wording to Kit Studio.
- `assets/builder.js`
  - Updated fallback wording from old Kit Builder terminology to Kit Studio.
- `kit-builder/index.html`
  - Added/kept `noindex,nofollow`.
  - Updated visible legacy wording toward Kit Studio.
- `preview-kit-builder/index.html`
  - Added/kept `noindex,nofollow` for preview content.
- `preview-kit-builder/luxe.html`
  - Added/kept `noindex,nofollow` for preview content.
- `preview-kit-builder/v2.html`
  - Added/kept `noindex,nofollow` for preview content.
- `preview-custom-products/index.html`
  - Added/kept `noindex,nofollow` for preview content.
- `seo-patch.js`
  - Unified public email and Kit Studio navigation wording in the helper patch script.
- `form-patch.js`
  - Unified public fallback email.
- `assets/studio-preview.js`
  - Updated old Kit Builder paths to Kit Studio paths.
- `_redirects`
  - Added canonical host redirects to `https://www.fypromogifts.com/`.
  - Kept `/kit-builder/` and `/kit-builder/*` redirecting to `/kit-studio/`.
- `AGENTS.md`
  - Updated the public contact email reference to `info@fypromogifts.com`.

### SEO / Indexing Checks

- Canonical homepage URL: `https://www.fypromogifts.com/`
- Formal sitemap URLs only:
  - `https://www.fypromogifts.com/`
  - `https://www.fypromogifts.com/blog/`
  - `https://www.fypromogifts.com/custom-products/`
  - `https://www.fypromogifts.com/kit-studio/`
  - Formal blog article URLs
- Preview and legacy pages are marked `noindex,nofollow`.
- Redirect rules target the formal `https://www.fypromogifts.com/` host.

### Deployment Status

- Status: Deployed
- Deployment command: `npx wrangler pages deploy . --project-name fy-promogifts-homepage --branch main --commit-dirty=true`
- Cloudflare Pages deployment preview: `https://f27170df.fy-promogifts-homepage.pages.dev`
- Deployment result: uploaded 14 changed files, reused 118 existing files.

### Online Verification Links

- Homepage: `https://www.fypromogifts.com/`
- Kit Studio: `https://www.fypromogifts.com/kit-studio/`
- Legacy redirect: `https://www.fypromogifts.com/kit-builder/`
- Sitemap: `https://www.fypromogifts.com/sitemap.xml`
- Preview noindex sample: `https://www.fypromogifts.com/preview-kit-builder/luxe.html`

### Online Verification Results

- `https://www.fypromogifts.com/`: `200`
  - Contains `info@fypromogifts.com`.
  - Does not contain `sira@fypromogifts.com`, `sirazheng` or public `Sira` wording.
  - Contains `/kit-studio/` link.
  - Does not contain `/kit-builder/` homepage link.
  - Contains product prefill script `fy-product-prefill-v1`.
  - Contains the planning/quotation note for example kit combinations.
- `https://www.fypromogifts.com/kit-studio/`: `200`
  - Contains `Example kit concept - Recommendation`.
  - Contains `Customizable kit idea -`.
  - `Send This Kit Idea` message template contains use case, color story, budget, quantity, kit name, included items, MOQ suggestion, logo method and packaging idea.
- `https://www.fypromogifts.com/kit-builder/`: `301` to `/kit-studio/`.
- `https://www.fypromogifts.com/preview-kit-builder/luxe.html`: reachable preview content contains `noindex,nofollow`.
- `https://www.fypromogifts.com/sitemap.xml`: only formal `https://www.fypromogifts.com/` URLs; no Pages preview, legacy kit-builder or preview-kit-builder URLs.
- `http://www.fypromogifts.com/`: `301` to `https://www.fypromogifts.com/`.
- `https://fypromogifts.com/`: currently returns `200`, not a host-level `301`.
  - `_redirects` includes a desired apex-to-www rule, but Pages host-level redirect did not apply to the apex custom domain.
  - Cloudflare API token can deploy Pages and read Pages domains, but zone-level Rulesets API returned an authentication error.
  - Follow-up needed: give the API token zone redirect/rules permission or configure a Cloudflare Redirect Rule/Page Rule from `fypromogifts.com/*` to `https://www.fypromogifts.com/$1`.

## 2026-06-26 Blog Purchasing Guide Update

### Scope

- Kept Blog at 3 articles only.
- Avoided broad homepage or global visual changes.
- Updated `https://www.fypromogifts.com/promotional-gifts-buyer-questions/` because the live page existed but was missing from the current publish directory and still showed the old public email.

### Files Changed

- `blog/index.html`
  - Compressed Blog hero height by reducing hero padding and headline scale.
  - Replaced abstract card visuals with existing kit/product-oriented images from `assets/kit-studio-final/`.
  - Kept the Blog homepage structure and 3-card layout.
- `blog/employee-welcome-kit-ideas/index.html`
  - Replaced article hero visual with the employee onboarding kit image.
  - Added `Quick Answer`, `Recommended kit table`, `MOQ & lead time notes`, mid-article CTA, `Quote checklist`, and a stronger bottom inquiry module.
  - Updated public email references to `info@fypromogifts.com`.
- `blog/client-appreciation-gift-box-ideas/index.html`
  - Replaced article hero visual with the client appreciation kit image.
  - Added `Quick Answer`, `Recommended kit table`, `MOQ & lead time notes`, mid-article CTA, `Quote checklist`, and a stronger bottom inquiry module.
  - Updated public email references to `info@fypromogifts.com`.
- `blog/trade-show-giveaway-ideas/index.html`
  - Replaced article hero visual with the trade show event kit image.
  - Added `Quick Answer`, `Recommended kit table`, `MOQ & lead time notes`, mid-article CTA, `Quote checklist`, and a stronger bottom inquiry module.
  - Updated public email references to `info@fypromogifts.com`.
- `promotional-gifts-buyer-questions/index.html`
  - Added the page to the current publish directory to overwrite the old live residual page.
  - Updated public email to `info@fypromogifts.com`.
- `sitemap.xml`
  - Kept only formal Blog URLs.
  - Updated Blog `lastmod` dates to `2026-06-26`.

### Local Checks

- No matches for `sira@fypromogifts.com`, `sirazheng` or public `Sira` in Blog and buyer-question pages.
- Each of the 3 Blog articles contains:
  - `Quick Answer`
  - `Recommended kit table`
  - `MOQ & lead time notes`
  - `Quote checklist`
  - Mid-article CTA
  - Bottom inquiry module
- Sitemap still contains only the current 3 Blog URLs and no old/empty Blog URLs.

### Deployment Status

- Status: Deployed
- Cloudflare Pages deployment preview: `https://2ac4fb74.fy-promogifts-homepage.pages.dev`
- Deployment result: uploaded 7 changed files, reused 126 existing files.

### Blog Online Verification Results

- `https://www.fypromogifts.com/blog/`: `200`; card visuals use kit images; Blog hero compressed.
- `https://www.fypromogifts.com/blog/employee-welcome-kit-ideas/`: `200`; contains Quick Answer, Recommended kit table, MOQ & lead time notes, mid CTA, Quote checklist and bottom inquiry module.
- `https://www.fypromogifts.com/blog/client-appreciation-gift-box-ideas/`: `200`; contains Quick Answer, Recommended kit table, MOQ & lead time notes, mid CTA, Quote checklist and bottom inquiry module.
- `https://www.fypromogifts.com/blog/trade-show-giveaway-ideas/`: `200`; contains Quick Answer, Recommended kit table, MOQ & lead time notes, mid CTA, Quote checklist and bottom inquiry module.
- `https://www.fypromogifts.com/promotional-gifts-buyer-questions/`: `200`; old public email removed. Cloudflare Email Obfuscation rewrites visible email markup to `__cf_email__` at the edge, but the source page uses `info@fypromogifts.com`.
- `https://www.fypromogifts.com/sitemap.xml`: `200`; contains only current formal Blog URLs and no preview/old Blog URLs. Blog lastmod entries updated to `2026-06-26`.

## 2026-06-26 Global Floating Contact Entries

### Scope

- Added two global fixed floating entries across all current HTML pages in `D:\Documents\独立站-publish`.
- No homepage module/content redesign was performed.
- Replaced the old buyer-question page floating script that used an image-based WhatsApp icon.

### Files Changed

- `assets/floating-cta.js`
  - New reusable global component.
  - Injects a left-bottom WhatsApp floating button and a right-bottom quote/contact floating button.
  - Uses inline SVG icons only; no PNG/JPG/AI-generated icon assets.
  - Uses CSS `position: fixed`, high z-index, safe-area bottom spacing, desktop/mobile sizing and pure CSS breathing glow animations.
  - Adds `prefers-reduced-motion` fallback.
  - Homepage quote button scrolls smoothly to `#contact`.
  - Non-homepage quote button links to `https://www.fypromogifts.com/#contact`.
- All current HTML pages
  - Added `<script src="/assets/floating-cta.js?v=20260626-cta2" defer></script>` before `</body>`.
  - Pages covered include homepage, Blog pages, Kit Studio, custom products, preview pages, legacy kit-builder page and buyer-question page.
- `promotional-gifts-buyer-questions/index.html`
  - Removed the previous `fy-contact-buttons-v4` inline floating script that used `/assets/whatsapp-delivery-icon.jpg`.

### Local Verification

- Static checks confirm every current HTML page includes the floating component script.
- Static checks confirm no current HTML page contains `whatsapp-delivery-icon` or `fy-contact-buttons-v4`.
- Component checks confirm:
  - WhatsApp icon is inline SVG.
  - Quote icon is inline SVG.
  - No image assets are used for either floating button.
  - `aria-label="Chat on WhatsApp"` and `aria-label="Get a Free Quote"` are present.
  - Fixed positioning is locked in both CSS and inline JS as a defensive fallback.
  - WhatsApp uses `https://wa.me/8615869117529`.
  - Quote uses `#contact` on homepage and `https://www.fypromogifts.com/#contact` elsewhere.
  - Both buttons include restrained breathing glow animations.

### Deployment Status

- Status: Deployed
- Cloudflare Pages deployment preview: `https://ddb75bbd.fy-promogifts-homepage.pages.dev`
- Production URLs verified:
  - `https://www.fypromogifts.com/`
  - `https://www.fypromogifts.com/blog/`
  - `https://www.fypromogifts.com/kit-studio/`
  - `https://www.fypromogifts.com/custom-products/`
  - `https://www.fypromogifts.com/promotional-gifts-buyer-questions/`

### Online Verification Results

- Homepage desktop and mobile:
  - WhatsApp button is visible, fixed, stable after scroll, uses inline SVG, and opens `https://wa.me/8615869117529`.
  - Quote button is visible, fixed, stable after scroll, uses inline SVG, and smoothly scrolls to `#contact`.
- Blog desktop and mobile:
  - Both floating entries are visible, fixed, stable after scroll and use the global component.
  - Quote button links to `https://www.fypromogifts.com/#contact`.
- Kit Studio desktop and mobile:
  - Both floating entries are visible, fixed, stable after scroll and use the global component.
  - Quote button links to `https://www.fypromogifts.com/#contact`.
- Custom Products and buyer-question pages:
  - Both floating entries are visible, fixed, stable after scroll and use the global component.
  - The old image-based WhatsApp floating script is no longer present.
- Technical checks:
  - The floating component is appended under `body`, outside section containers.
  - Computed button positioning is `fixed` with z-index `2147483001`.
  - Desktop sizing: WhatsApp `64px`; Quote `54px` high.
  - Mobile sizing: WhatsApp `56px`; Quote `48px` high.
  - Both buttons keep restrained breathing glow animations and support `prefers-reduced-motion`.

## 2026-06-27 Summer Promotional Gifts Blog Article

### Scope

- Added a new English Blog article in the formal publish directory only: `/blog/useful-summer-promotional-gifts-people-actually-keep/`.
- Added the new article card to `/blog/`.
- Added a local featured image asset: `/assets/summer-promotional-gift-kit-2026.png`.
- Updated `sitemap.xml` with the new article URL and `lastmod` value `2026-06-27`; updated `/blog/` lastmod to `2026-06-27`.

### Content Notes

- Title: `Useful Summer Promotional Gifts People Actually Keep: Top Picks for 2026`.
- Category/kicker: `Promotional Product Guide`.
- Author line: `FY PromoGifts - Custom branded gift kits`.
- Meta title and meta description follow the requested copy.
- Included natural internal links to:
  - `/kit-studio/`
  - `/promotional-gifts-buyer-questions/`
  - `/custom-products/`
  - `/trade-show-giveaways/`
- Added CTA buttons:
  - `Build Your Kit Idea` -> `/kit-studio/`
  - `Ask for a Free Mockup` -> `/#contact`
- Added Article and FAQPage JSON-LD.
- Avoided official event, licensed, USA-made, and authorization-sensitive claims.

### Local Verification

- Static file checks confirm the new Blog detail page exists at `blog/useful-summer-promotional-gifts-people-actually-keep/index.html`.
- Static checks confirm the `/blog/` listing includes the new article card and link.
- Static checks confirm the requested internal links are present.
- Static checks confirm `sitemap.xml` includes the new URL with `lastmod` set to `2026-06-27`.
- The new detail page and Blog listing both still load `/assets/floating-cta.js?v=20260626-cta2`, preserving the floating WhatsApp and Quote buttons.
- Added `_redirects` rule for `/trade-show-giveaways/` -> `/blog/trade-show-giveaway-ideas/` so the requested internal link resolves on Cloudflare Pages.

## 2026-06-29 Employee Welcome Kit Standard Template Update

### Scope

- Updated the existing Blog article at `/blog/employee-welcome-kit-ideas/` using the FY Promo Gifts Blog Standard Template.
- Kept the existing page header, footer and floating WhatsApp / Quote script unchanged.
- Updated the Blog Index employee welcome kit card summary.
- Updated `sitemap.xml` lastmod values for `/blog/` and `/blog/employee-welcome-kit-ideas/` to `2026-06-29`.
- Added `_redirects` entries for `/catalog/` -> `/custom-products/` and `/contact/` -> `/#contact` so requested internal links resolve.

### Content Notes

- Meta title: `Employee Welcome Kit Ideas | Custom Corporate Gifts for New Hires`.
- Meta description follows the requested copy.
- Main article order: H1, Introduction, What, Why, How, Procurement Tips, FAQ, CTA.
- FAQ questions use H3 headings.
- Final CTA includes:
  - `Browse Online Catalog` -> `/catalog/`
  - `Explore Kit Studio` -> `/kit-studio/`
  - `Contact Us` -> `/contact/`
- Added previous / next Blog links in the sidebar.

### Local Verification

- Static checks confirm the article contains required internal links to `/catalog/`, `/kit-studio/`, `/promotional-gifts-buyer-questions/`, and `/contact/`.
- Static checks confirm Article and FAQPage JSON-LD parse correctly.
- Browser checks confirm the page and Blog Index render locally on desktop and mobile without horizontal overflow.
- Browser checks confirm the floating WhatsApp and Quote buttons remain visible and fixed.

## 2026-06-30 Blog Index Image Grid and Floating CTA Update

### Scope

- Updated `/blog/` to use real image cards instead of decorative placeholders.
- Changed Blog Index cards to square image frames, desktop 4-column layout, tablet 2-column layout, and mobile 1-column layout.
- Kept all existing Blog entries and added the Summer promotional gifts article card back into the index.
- Restored the fixed floating quick actions with WhatsApp on the left and Inquiry Form on the right.
- Published the missing Summer promotional gift image asset so the article image path returns a real PNG.

### Verification

- Live `/blog/` contains 9 Blog cards, square image CSS, and the floating CTA script.
- Live responsive CSS includes desktop 4 columns, tablet 2 columns, and mobile 1 column.
- Live floating CTA script contains the WhatsApp link and `/contact/` form entry.
- Live Summer image asset returns `image/png`.
