import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const products = [
  {
    sku: "GF001",
    slug: "executive-office-gift-set",
    name: "Executive Office Gift Set with Tumbler, Notebook & Pen",
    description: "A coordinated executive office gift set with an insulated tumbler, notebook and pen in a presentation box, ready for custom branding.",
    image: "/catalog/images/gift-sets/GF001-01.webp",
    material: "Metal and PU",
    format: "330 × 270 × 70mm gift box",
    colors: "Black, red, navy, green and blue",
    contents: "Insulated tumbler, notebook, pen and presentation box",
    customization: "Logo printing, laser engraving, notebook debossing and custom packaging",
    bestFor: "Employee onboarding, executive gifts, client appreciation and company anniversaries",
    summary: "A practical branded desk set for programs that need a polished, coordinated presentation without relying on novelty items.",
    ideas: ["Add an insert card with a welcome or thank-you message.", "Coordinate one-color branding across the tumbler, notebook and outer box.", "Pair with a branded gift bag or umbrella for a larger program."],
  },
  {
    sku: "GF002",
    slug: "insulated-tumbler-automatic-umbrella-gift-set",
    name: "Insulated Tumbler & Automatic Umbrella Gift Set",
    description: "A practical two-piece corporate gift set pairing an insulated tumbler with an automatic umbrella in a coordinated presentation box.",
    image: "/catalog/images/gift-sets/GF002-01.webp",
    material: "Metal tumbler and polyester umbrella",
    format: "Two-piece presentation set",
    colors: "Red, blue and black",
    contents: "Insulated tumbler, automatic umbrella and gift box",
    customization: "Logo printing, laser engraving and custom gift packaging",
    bestFor: "Client gifts, company anniversaries, opening events and employee recognition",
    summary: "A useful year-round set that combines daily drinkware with weather-ready utility, giving the brand two practical touchpoints.",
    ideas: ["Match the umbrella, tumbler and box to a campaign color.", "Use laser engraving on the tumbler for a durable executive finish.", "Include a campaign card or event message inside the box."],
  },
  {
    sku: "GF003",
    slug: "premium-multi-piece-executive-gift-set",
    name: "Premium Multi-Piece Executive Gift Set",
    description: "A flexible executive gift kit available in three-, four-, five- and seven-piece configurations with office, drinkware and tech options.",
    image: "/catalog/images/gift-sets/GF003-01.webp",
    material: "Metal and mixed materials",
    format: "3-, 4-, 5- or 7-piece configurations",
    colors: "Red, blue, black, gold and silver",
    contents: "Options include notebook, pen, 450ml tumbler, umbrella, USB drive, power bank and speaker",
    customization: "Logo printing, laser engraving, custom inserts and custom product mix",
    bestFor: "Executive gifts, employee welcome kits and milestone programs",
    summary: "A modular set for buyers who want one visual system across office, drinkware and technology items while retaining budget flexibility.",
    ideas: ["Start with a three-piece core and add tech items for premium recipient tiers.", "Use the same logo treatment across every item for visual consistency.", "Create separate configurations for employees, VIP clients and event speakers."],
  },
  {
    sku: "GF004",
    slug: "portable-comfort-appreciation-gift-set",
    name: "Portable Comfort & Appreciation Gift Set",
    description: "A compact appreciation kit in a reusable carry case, with a flexible product mix for employee care, client thank-you and anniversary programs.",
    image: "/catalog/images/gift-sets/GF004-01.webp",
    material: "Mixed materials with fabric carry case",
    format: "Portable carry case",
    colors: "Brown",
    contents: "Configurable comfort, drinkware and personal-care items in a reusable case",
    customization: "Logo label, printed insert card, custom product mix and outer-case branding",
    bestFor: "Client appreciation, employee care, anniversaries and seasonal gifting",
    summary: "A warm, compact presentation designed for appreciation programs where packaging and perceived care matter as much as the individual items.",
    ideas: ["Build the contents around a wellness, travel or thank-you theme.", "Add a personalized message card for each recipient group.", "Brand the carry case subtly and use the inner card for campaign messaging."],
  },
];

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

for (const product of products) {
  const url = `https://www.fypromogifts.com/catalog/gift-sets/${product.slug}/`;
  const inquiry = encodeURIComponent(`Hello, I would like a quote for ${product.sku} - ${product.name}. Please send MOQ, branding options, lead time and quotation.`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        description: product.description,
        sku: product.sku,
        category: "Custom Corporate Gift Sets",
        material: product.material,
        color: product.colors,
        image: [`https://www.fypromogifts.com${product.image}`],
        url,
        brand: { "@type": "Brand", name: "FY PromoGifts" },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Configuration", value: product.format },
          { "@type": "PropertyValue", name: "Customization", value: product.customization },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Catalog", item: "https://www.fypromogifts.com/catalog/" },
          { "@type": "ListItem", position: 2, name: "Gift Sets", item: "https://www.fypromogifts.com/catalog/gift-sets/" },
          { "@type": "ListItem", position: 3, name: product.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `Can ${product.sku} be customized with our logo?`, acceptedAnswer: { "@type": "Answer", text: `Yes. Available methods include ${product.customization.toLowerCase()}. Final method depends on artwork, item surface and order quantity.` } },
          { "@type": "Question", name: "What is the minimum order quantity?", acceptedAnswer: { "@type": "Answer", text: "MOQ depends on the selected configuration and branding method. Send the required quantity and artwork for a project-specific recommendation." } },
          { "@type": "Question", name: "How is production timing confirmed?", acceptedAnswer: { "@type": "Answer", text: "FY PromoGifts confirms the schedule after the product mix, quantity, branding files, packaging and delivery destination are reviewed." } },
        ],
      },
    ],
  };

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(product.name)} | FY PromoGifts</title><meta name="description" content="${esc(product.description)}"><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}"><meta property="og:type" content="product"><meta property="og:title" content="${esc(product.name)}"><meta property="og:description" content="${esc(product.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://www.fypromogifts.com${product.image}"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/catalog/assets/catalog.css"><script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script></head>
<body><header class="site-header"><div class="header-inner"><a class="brand" href="/catalog/" aria-label="FY PromoGifts catalog home"><span class="brand-logo"><span class="brand-fy">FY</span><span class="brand-promogifts">PromoGifts</span></span></a><nav class="catalog-nav" aria-label="Main navigation"><a href="/catalog/">Shop All</a><a href="/catalog/gift-sets/">Gift Sets</a><a href="/#customization">Customization</a><a href="/#contact">Contact</a></nav><div class="header-actions"><a class="pill-button primary" href="https://wa.me/8615869117529?text=${inquiry}">Request Quote</a></div></div></header>
<main class="product-detail"><nav class="product-breadcrumbs" aria-label="Breadcrumb"><a href="/catalog/">Catalog</a> / <a href="/catalog/gift-sets/">Gift Sets</a> / ${product.sku}</nav>
<div class="product-detail-grid"><div class="product-detail-media"><img src="${product.image}" alt="${esc(product.name)}" width="800" height="800" fetchpriority="high"></div><div><p class="product-detail-kicker">Custom Gift Set · ${product.sku}</p><h1>${esc(product.name)}</h1><p class="product-lede">${esc(product.summary)}</p><dl class="product-facts"><div><dt>Contents</dt><dd>${esc(product.contents)}</dd></div><div><dt>Format</dt><dd>${esc(product.format)}</dd></div><div><dt>Colors</dt><dd>${esc(product.colors)}</dd></div><div><dt>Best for</dt><dd>${esc(product.bestFor)}</dd></div></dl><div class="product-detail-actions"><a class="pill-button primary" href="https://wa.me/8615869117529?text=${inquiry}">Ask on WhatsApp</a><a class="pill-button secondary" href="mailto:info@fypromogifts.com?subject=${encodeURIComponent(`Quote request: ${product.sku}`)}">Email for Quote</a></div></div></div>
<div class="product-detail-copy"><section><h2>Customization options</h2><p>${esc(product.customization)}. We review your logo, recipient profile, quantity, budget and delivery date before recommending the final construction.</p></section><section><h2>Program ideas</h2><ul>${product.ideas.map((idea) => `<li>${esc(idea)}</li>`).join("")}</ul></section><section><h2>MOQ and sampling</h2><p>Minimum quantity varies by configuration and branding method. Tell us your target quantity and destination to receive a suitable option, mockup route and sample plan.</p></section><section><h2>Lead time and quality control</h2><p>Timing is confirmed after artwork and specifications are approved. Production checks can cover logo placement, color, item count, packaging and carton readiness before shipment.</p></section></div></main>
<footer class="site-footer"><p>FY PromoGifts · Custom promotional gifts and branded gift kits · <a href="mailto:info@fypromogifts.com">info@fypromogifts.com</a></p></footer><script src="/assets/fy-attribution.js?v=20260804" defer></script></body></html>`;
  const destination = resolve(root, "catalog", "gift-sets", product.slug, "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html, "utf8");
}
