import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const allProducts = JSON.parse(await readFile(resolve(root, 'catalog/data/products.json'), 'utf8'));
const products = allProducts.filter((product) => product.category_slug === 'gift-sets' && product.publish_to_catalog !== false);
const assetVersion = '20260814-catalog7';
const site = 'https://www.fypromogifts.com';

const esc = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const absolute = (path) => `${site}${path}`;
const slugFromUrl = (url) => url.split('/').filter(Boolean).at(-1);
const list = (items) => items.map((item) => `<li>${esc(item)}</li>`).join('');
const whatsappText = (product) => encodeURIComponent(`Hello, I would like a project quote for ${product.product_id} - ${product.title_en}. Please advise options, MOQ, branding, lead time and shipping.`);

function header() {
  return `<header class="site-header"><div class="header-inner"><a class="brand" href="/catalog/" aria-label="FY PromoGifts catalog home"><span class="brand-logo"><span class="brand-fy">FY</span><span class="brand-promogifts">PromoGifts</span></span></a><nav class="catalog-nav" aria-label="Main navigation"><a href="/catalog/">Shop All</a><a href="/catalog/gift-sets/">Gift Sets</a><a href="/#customization">Customization</a><a href="/#projects">Projects</a><a href="/#contact">Contact</a></nav><div class="header-actions"><a class="pill-button primary" href="/#contact">Start a Project</a></div></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><p>FY PromoGifts · Custom promotional gifts and branded gift kits · <a href="mailto:info@fypromogifts.com">info@fypromogifts.com</a> · <a href="https://wa.me/8615869117529">WhatsApp +86 158 6911 7529</a> · <a href="/privacy-policy/">Privacy Policy</a></p></footer>`;
}

function productCard(product) {
  const specs = [product.material, product.size, product.colors?.join(' / ')].filter(Boolean);
  return `<article class="product-card"><a class="product-card-link" href="${product.detail_url}" aria-label="View ${esc(product.title_en)}"><div class="product-image-wrap"><img src="${product.image_main}" alt="${esc(product.title_en)}" loading="lazy" width="800" height="800"><span class="product-id">${product.product_id}</span></div><div class="product-copy"><p class="product-category">Gift Sets</p><h2>${esc(product.title_en)}</h2><p class="product-card-description">${esc(product.short_description)}</p><ul class="product-specs">${list(specs)}</ul></div></a><button class="add-inquiry" type="button" data-product-id="${product.product_id}">Add to Inquiry</button></article>`;
}

const categoryUrl = `${site}/catalog/gift-sets/`;
const categorySchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': categoryUrl, url: categoryUrl, name: 'Custom Corporate Gift Sets', description: 'Custom corporate gift sets for employee, client, event and onboarding programs.', mainEntity: { '@id': `${categoryUrl}#products` } },
    { '@type': 'ItemList', '@id': `${categoryUrl}#products`, numberOfItems: products.length, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: absolute(product.detail_url), name: product.title_en })) },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Catalog', item: `${site}/catalog/` },
      { '@type': 'ListItem', position: 2, name: 'Gift Sets', item: categoryUrl }
    ] }
  ]
};

const categoryHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Custom Corporate Gift Sets | FY PromoGifts</title><meta name="description" content="Explore configurable corporate gift sets for employees, clients, events and onboarding. Add your logo, choose contents and request a project quote."><meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${categoryUrl}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><meta property="og:type" content="website"><meta property="og:title" content="Custom Corporate Gift Sets | FY PromoGifts"><meta property="og:description" content="Configurable branded gift sets for B2B programs."><meta property="og:url" content="${categoryUrl}"><meta property="og:image" content="${absolute(products[0].image_main)}"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/catalog/assets/catalog.css?v=${assetVersion}"><script type="application/ld+json">${JSON.stringify(categorySchema).replaceAll('<', '\\u003c')}</script></head>
<body data-page-type="category" data-category-slug="gift-sets" data-category-name="Gift Sets" data-products-url="/catalog/data/products.json?v=${assetVersion}" data-categories-url="/catalog/data/categories.json?v=${assetVersion}" data-use-cases-url="/catalog/data/use-cases.json?v=${assetVersion}">${header()}
<main><section class="catalog-hero"><div><p class="eyebrow">Custom Gift Sets</p><h1>Build a gift set people will actually use</h1><p>Start with a verified configuration, then align the contents, logo treatment, packaging, quantity and delivery plan to your campaign.</p><div class="hero-actions"><a class="pill-button primary" href="/#contact">Discuss Your Project</a><a class="pill-button secondary" href="https://wa.me/8615869117529">Ask on WhatsApp</a></div></div></section>
<section class="catalog-shell" aria-labelledby="productsHeading"><div class="catalog-heading"><div><p class="eyebrow">Source-verified collection</p><h2 id="productsHeading">Gift set options</h2></div><p id="catalogSummary">${products.length} configurable products</p></div><div id="filterBar" class="filter-bar" aria-label="Product filters"></div><p id="resultCount" class="result-count">Showing ${products.length} products</p><div id="productGrid" class="product-grid">${products.map(productCard).join('')}</div><div id="emptyState" class="empty-state" hidden>No products match these filters.</div></section></main>
<button id="inquiryBagButton" class="inquiry-bag-button" type="button" aria-controls="inquiryDrawer">Inquiry List <span id="inquiryCount">0</span></button><div id="drawerOverlay" class="drawer-overlay" hidden></div><aside id="inquiryDrawer" class="inquiry-drawer" aria-label="Inquiry list" aria-hidden="true"><button id="closeDrawer" class="drawer-close" type="button" aria-label="Close inquiry list">×</button><h2>Your inquiry list</h2><p id="inquiryEmpty">Add products to prepare a quote request.</p><div id="inquiryItems"></div><div class="drawer-actions"><a id="whatsappLink" class="pill-button primary" href="https://wa.me/8615869117529">Send on WhatsApp</a><a id="emailLink" class="pill-button secondary" href="mailto:info@fypromogifts.com">Send by Email</a><button id="clearInquiry" class="text-button" type="button">Clear list</button></div></aside>
${footer()}<script src="/catalog/assets/catalog.js?v=${assetVersion}" defer></script><script src="/assets/fy-attribution.js?v=20260804" defer></script></body></html>`;

await writeFile(resolve(root, 'catalog/gift-sets/index.html'), categoryHtml, 'utf8');

for (const product of products) {
  const url = absolute(product.detail_url);
  const images = [product.image_main, ...(product.image_gallery || [])];
  const faqs = [
    { question: `Can ${product.product_id} be customized with our logo?`, answer: `Yes. The listed options are ${product.customization.join(', ').toLowerCase()}. The final method and printable area are confirmed after artwork and item-surface review.` },
    { question: 'What is the minimum order quantity?', answer: 'MOQ depends on the selected configuration, branding method and packaging. Send the required quantity and destination for a project-specific recommendation.' },
    { question: 'How are samples and production timing handled?', answer: 'We confirm the sample route and production schedule after the item mix, artwork, packaging, quantity and delivery destination are reviewed.' }
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Product', '@id': `${url}#product`, name: product.title_en, description: product.short_description, sku: product.product_id, category: 'Gift Sets', material: product.material, color: product.colors.join(', '), image: images.map(absolute), url, additionalProperty: [
        { '@type': 'PropertyValue', name: 'Configuration', value: product.size },
        { '@type': 'PropertyValue', name: 'Customization', value: product.customization.join(', ') }
      ] },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Catalog', item: `${site}/catalog/` },
        { '@type': 'ListItem', position: 2, name: 'Gift Sets', item: categoryUrl },
        { '@type': 'ListItem', position: 3, name: product.title_en, item: url }
      ] },
      { '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }
    ]
  };
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(product.title_en)} | Custom Promotional Product</title><meta name="description" content="${esc(product.short_description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><meta property="og:type" content="product"><meta property="og:title" content="${esc(product.title_en)}"><meta property="og:description" content="${esc(product.short_description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${absolute(product.image_main)}"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/catalog/assets/catalog.css?v=${assetVersion}"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script></head>
<body>${header()}<main class="product-detail"><nav class="product-breadcrumbs" aria-label="Breadcrumb"><a href="/catalog/">Catalog</a> / <a href="/catalog/gift-sets/">Gift Sets</a> / ${product.product_id}</nav>
<div class="product-detail-grid"><div class="product-detail-gallery">${images.map((image, index) => `<figure class="product-detail-media"><img src="${image}" alt="${esc(product.title_en)}${index ? ` — view ${index + 1}` : ''}" width="900" height="900" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}></figure>`).join('')}</div><div class="product-detail-intro"><p class="product-detail-kicker">Custom Gift Sets · ${product.product_id}</p><h1>${esc(product.title_en)}</h1><p class="product-lede">${esc(product.short_description)}</p><dl class="product-facts"><div><dt>Configuration</dt><dd>${esc(product.size)}</dd></div><div><dt>Materials</dt><dd>${esc(product.material)}</dd></div><div><dt>Colors</dt><dd>${esc(product.colors.join(', '))}</dd></div><div><dt>Best for</dt><dd>${esc(product.suitable_for.join(', '))}</dd></div></dl><p class="configuration-note">${esc(product.configuration_note)}</p><div class="product-detail-actions"><a class="pill-button primary" href="#product-inquiry">Request Project Quote</a><a class="pill-button secondary" href="https://wa.me/8615869117529?text=${whatsappText(product)}">Ask on WhatsApp</a></div></div></div>
<div class="product-detail-copy"><section><h2>What can be included</h2><ul>${list(product.product_contents)}</ul></section><section><h2>Customization options</h2><ul>${list(product.customization)}</ul><p>Logo feasibility, color matching and packaging are confirmed against your artwork, quantity and deadline.</p></section><section><h2>Project fit</h2><ul>${list(product.use_case)}</ul></section><section><h2>How quotation works</h2><ol><li>Share quantity, destination and need-by date.</li><li>Confirm the item mix, branding and packaging.</li><li>Approve the mockup or sample route before production.</li></ol></section></div>
<section class="product-faq" aria-labelledby="faqHeading"><p class="eyebrow">Buyer questions</p><h2 id="faqHeading">Frequently asked questions</h2>${faqs.map((faq) => `<details><summary>${esc(faq.question)}</summary><p>${esc(faq.answer)}</p></details>`).join('')}</section>
<section id="product-inquiry" class="product-inquiry" aria-labelledby="inquiryHeading"><div><p class="eyebrow">B2B project brief</p><h2 id="inquiryHeading">Request a quote for ${product.product_id}</h2><p>Send the essentials and we will reply with a suitable configuration, branding route, MOQ guidance and next step.</p></div><form action="https://formspree.io/f/xgoqqrno" method="POST" enctype="multipart/form-data"><input type="hidden" name="product" value="${esc(`${product.product_id} - ${product.title_en}`)}"><div class="inquiry-form-grid"><label>Name <input name="name" autocomplete="name" required></label><label>Work email <input type="email" name="email" autocomplete="email" required></label><label>Company <input name="company" autocomplete="organization" required></label><label>WhatsApp / phone <input name="whatsapp" autocomplete="tel"></label><label>Estimated quantity <input type="number" name="quantity" min="1" inputmode="numeric" required></label><label>Need-by date <input type="date" name="need_by_date"></label><label class="form-span">Delivery country or city <input name="destination" autocomplete="country-name" required></label><label class="form-span">Project details <textarea name="message" rows="5" placeholder="Recipients, target budget, preferred colors, branding and packaging"></textarea></label><label class="form-span">Logo or artwork <input type="file" name="logo" accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg"></label></div><button class="pill-button primary" type="submit">Send Quote Request</button><p class="form-privacy">By submitting, you agree that FY PromoGifts may use these details to respond to your request. See our <a href="/privacy-policy/">Privacy Policy</a>.</p></form></section></main>${footer()}<script src="/assets/fy-attribution.js?v=20260804" defer></script></body></html>`;
  const destination = resolve(root, 'catalog/gift-sets', slugFromUrl(product.detail_url), 'index.html');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html, 'utf8');
}

console.log(`Generated gift set category and ${products.length} product pages from catalog/data/products.json.`);
