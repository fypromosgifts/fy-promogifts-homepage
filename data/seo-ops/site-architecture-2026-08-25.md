# FY PromoGifts Site Architecture Audit — 2026-08-25

Scope: 149 HTML pages. This inventory separates search acquisition, conversion, support and utility roles before consolidation.

## Direction

- Gift kits lead positioning and conversion.
- Core single products remain the broader Google acquisition layer.
- Existing search signals are protected; pages are not deleted solely because they are thin today.
- Duplicate URLs consolidate through 301 redirects, are removed from sitemap/internal navigation, and transfer useful content to the retained page.

## Page roles

- kit-product-detail: 42
- single-product-detail: 31
- commercial-or-guide: 22
- legacy-duplicate: 17
- crawl-category: 13
- buyer-guide: 11
- scenario-conversion: 3
- single-product-category: 2
- conversion-home: 1
- campaign-conversion: 1
- catalog-hub: 1
- kit-catalog-hub: 1
- kit-planning-pillar: 1
- packaging-pillar: 1
- conversion-tool: 1
- single-product-guide: 1

## Priority decisions

| URL | Role | Decision | Target / evidence |
|---|---|---|---|
| / | conversion-home | protect-upgrade | 74 GSC impressions; average position 8.27; preserve intent while improving conversion. |
| /blog/ | buyer-guide | keep-support | Retain as the buyer-guide hub and route readers to commercial pages. |
| /blog/client-appreciation-gift-box-ideas/ | buyer-guide | keep-support | Retain for packaging-led client gift intent; keep distinct from recipient-tier selection. |
| /blog/employee-welcome-kit-ideas/ | buyer-guide | keep-support | Retain for item-checklist intent; keep distinct from the budget and work-style guide. |
| /blog/trade-show-giveaway-ideas/ | buyer-guide | keep-support | Retain for quantity-and-audience intent; keep distinct from agency and budget guides. |
| /brand-campaign-giveaways/ | campaign-conversion | protect-upgrade | 13 impressions and the only two recorded clicks; protect title and intent. |
| /catalog/ | catalog-hub | protect-upgrade | 19 impressions; retain as product discovery hub. |
| /catalog/drinkware/mugs/ | single-product-category | keep-upgrade | Canonical commercial mug category. |
| /catalog/gift-sets/ | kit-catalog-hub | protect-upgrade | Primary shoppable gift-set hub; compare configurations and route qualified buyers to product pages. |
| /client-appreciation-gifts/ | scenario-conversion | keep-upgrade | Primary client appreciation transaction page; absorb useful content from nested duplicate. |
| /custom-gift-boxes-packaging/ | packaging-pillar | keep-upgrade | Primary packaging capability and buyer-guide page; absorb legacy custom-packaging content. |
| /custom-promotional-caps/styles/five-panel-promotional-cap/ | commercial-or-guide | review-priority | Validate unique search intent, visual proof and one primary conversion path before retaining as indexable. |
| /custom-promotional-caps/styles/laser-perforated-quick-dry-cap/ | commercial-or-guide | review-priority | Validate unique search intent, visual proof and one primary conversion path before retaining as indexable. |
| /custom-promotional-caps/styles/quick-dry-hiking-bucket-hat/ | commercial-or-guide | review-priority | Validate unique search intent, visual proof and one primary conversion path before retaining as indexable. |
| /custom-promotional-caps/styles/soft-top-dad-cap/ | commercial-or-guide | review-priority | Validate unique search intent, visual proof and one primary conversion path before retaining as indexable. |
| /employee-onboarding-kits/ | scenario-conversion | keep-upgrade | Primary employee onboarding transaction page; absorb useful content from nested duplicate. |
| /kit-studio/ | conversion-tool | upgrade-static-copy | 10 impressions at average position 15.7; upgrade static value before any index decision. |
| /low-moq-promotional-products/ | commercial-or-guide | review-priority | Validate unique search intent, visual proof and one primary conversion path before retaining as indexable. |
| /promotional-gifts-buyer-questions/ | commercial-or-guide | review-priority | Validate unique search intent, visual proof and one primary conversion path before retaining as indexable. |
| /promotional-products-supplier-for-marketing-agencies/ | commercial-or-guide | review-priority | Validate unique search intent, visual proof and one primary conversion path before retaining as indexable. |
| /promotional-products/drinkware/ | single-product-category | keep-distinct | Retain broad drinkware intent and route to narrower mugs and tumbler categories. |
| /trade-show-giveaway-kits/ | scenario-conversion | protect-upgrade | 60 impressions; commercial page remains the primary trade-show kit landing page. |

## Existing consolidations

| Legacy URL | 301 target |
|---|---|
| /catalog/gift-sets/executive-office-gift-set/ | /catalog/gift-sets/executive-tumbler-notebook-pen-gift-set/ |
| /catalog/gift-sets/gift-sets/ | /catalog/gift-sets/executive-wireless-keyboard-and-tech-gift-set/ |
| /catalog/gift-sets/insulated-tumbler-automatic-umbrella-gift-set/ | /catalog/gift-sets/tumbler-automatic-umbrella-gift-set/ |
| /catalog/gift-sets/portable-comfort-appreciation-gift-set/ | /catalog/gift-sets/travel-comfort-coffee-gift-case/ |
| /catalog/gift-sets/premium-multi-piece-executive-gift-set/ | /catalog/gift-sets/configurable-executive-office-tech-gift-set/ |
| /catalog/gift-sets/tulip-theme-women-s-gift-set/ | /catalog/gift-sets/tulip-theme-womens-gift-set/ |
| /catalog/mugs/ | /catalog/drinkware/mugs/ |
| /corporate-gift-kits/client-appreciation-gifts/ | /client-appreciation-gifts/ |
| /corporate-gift-kits/employee-welcome-kits/ | /employee-onboarding-kits/ |
| /custom-lanyards-for-events/ | /catalog/event-party-supplies/ |
| /custom-logo-drinkware/ | /promotional-drinkware-for-corporate-gifts/ |
| /custom-logo-pens/ | /catalog/stationery-office/ |
| /custom-logo-tote-bags/ | /catalog/bags/ |
| /custom-packaging/ | /custom-gift-boxes-packaging/ |
| /custom-products/ | /catalog/ |
| /quality-first-corporate-gift-kits/ | /corporate-gift-kits/ |
| /trade-show-giveaways/ | /trade-show-giveaway-kits/ |

## Guardrails

1. Check GSC queries, backlinks and internal links before any new redirect.
2. Keep one dominant intent per indexable page and one primary inquiry destination.
3. Pages with no impressions after a full 60-day observation window enter merge/noindex review; they are not auto-deleted.
4. Every retained commercial page needs real images, truthful procurement facts, relevant internal links and a tested quote path.
