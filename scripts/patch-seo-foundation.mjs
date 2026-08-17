import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const site = 'https://www.fypromogifts.com';
const fallbackImage = `${site}/assets/image-01-hero-1200.webp`;
const catalogProducts = JSON.parse(await readFile(resolve(root, 'catalog/data/products.json'), 'utf8'));
const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

async function updateFile(relative, transform) {
  const file = resolve(root, relative);
  const source = await readFile(file, 'utf8');
  const output = transform(source);
  if (output !== source) await writeFile(file, output, 'utf8');
}

await updateFile('kit-studio/index.html', (source) => {
  let html = source;
  html = html.replace(
    '<link rel="stylesheet" href="../assets/kit-studio-luxe.css?v=20260802-product-card-fix">',
    '<link rel="stylesheet" href="../assets/kit-studio-luxe.css?v=20260817-seo1">',
  );
  if (!html.includes('id="studio-title"')) {
    const intro = '    <section class="studio-intro" aria-labelledby="studio-title">      <p class="kicker">Interactive planning tool</p>      <h1 id="studio-title">Custom Branded Gift Kit Builder</h1>      <p>Choose the occasion, color direction, budget range and estimated quantity to see practical kit concepts. Use the recommendations as a starting point, then adjust products, logo methods and packaging before requesting a project-specific quote.</p>      <nav class="studio-links" aria-label="Related gift kit options">        <a href="/catalog/gift-sets/">Browse Gift Sets</a>        <a href="/employee-onboarding-kits/">Employee Onboarding Kits</a>        <a href="/client-appreciation-gifts/">Client Appreciation Gifts</a>        <a href="/branded-gift-kits-for-events/">Event Gift Kits</a>      </nav>    </section>';
    html = html.replace('    <section class="result-head">', `${intro}    <section class="result-head">`);
  }
  html = html.replace('<h1>Recommended kit concepts</h1>', '<h2>Recommended kit concepts</h2>');
  if (!html.includes('class="form-privacy"')) {
    html = html.replace(
      '<button class="quote-submit" type="submit">Submit kit inquiry</button>',
      '<button class="quote-submit" type="submit">Submit kit inquiry</button>      <p class="form-privacy">By submitting, you agree that FY PromoGifts may use these details to respond to your request. See our <a href="/privacy-policy/">Privacy Policy</a>.</p>',
    );
  }
  return html;
});

await updateFile('assets/kit-studio-luxe.css', (source) => {
  if (source.includes('.studio-intro{')) return source;
  return `${source}\n.studio-intro{padding:clamp(24px,4vw,54px) 0;border-bottom:1px solid var(--line)}.studio-intro .kicker{margin:0 0 10px}.studio-intro h1{max-width:820px;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(38px,5.4vw,72px);font-weight:500;line-height:1.02;letter-spacing:-.035em}.studio-intro>p:not(.kicker){max-width:760px;margin:18px 0 0;color:var(--soft);font-size:15px;line-height:1.7}.studio-links{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}.studio-links a{border:1px solid var(--line);background:rgba(255,253,248,.65);padding:10px 13px;font-size:11px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}.studio-links a:hover{background:var(--dark);border-color:var(--dark);color:#fff}.result-head{margin-top:22px}.result-head h2{max-width:620px;margin:5px 0 0;font-family:Inter,Arial,sans-serif;font-size:clamp(17px,1.05vw,19px);font-weight:780;line-height:1.3;letter-spacing:0;color:var(--ink)}.form-privacy{margin:10px 0 0;color:var(--soft);font-size:12px;line-height:1.5}.form-privacy a{text-decoration:underline}@media(max-width:640px){.studio-intro{padding-top:30px}.studio-intro h1{font-size:38px}.studio-links{display:grid}.result-head h2{font-size:18px}}\n`;
});

await updateFile('index.html', (source) => {
  let html = source;
  if (!html.includes('class="form-privacy"')) {
    html = html.replace(
      '<div class="form-status" id="formStatus" aria-live="polite"></div></form>',
      '<div class="form-status" id="formStatus" aria-live="polite"></div><p class="form-privacy">By submitting this form, you agree that FY PromoGifts may use the information to respond to your request. See our <a href="/privacy-policy/">Privacy Policy</a>.</p></form>',
    );
    html = html.replace('</style>', '.form-privacy{grid-column:1/-1;margin:2px 0 0;color:#68778a;font-size:12px;line-height:1.55}.form-privacy a{text-decoration:underline}</style>');
  }
  return html;
});

await updateFile('catalog/drinkware/mugs/index.html', (source) => {
  if (source.includes('id="mug-buying-guide"')) return source;
  const guide = `
      <section class="catalog-seo-intro" aria-labelledby="mug-buying-guide">
        <div class="catalog-seo-copy">
          <p class="catalog-kicker">Choose by use, material and decoration</p>
          <h2 id="mug-buying-guide">Custom Logo Mugs for Offices, Events and Gift Kits</h2>
          <p>Custom mugs are useful when the product needs to stay visible on a desk, in a break room or inside an employee or client gift kit. The right choice depends on how recipients will use it: ceramic styles suit everyday office drinks, travel-friendly formats prioritize lids and handling, and presentation sets can combine drinkware with stationery or other practical items.</p>
          <p>Before choosing a mug, compare the printable area, surface shape, capacity, packaging and delivery route. A logo method that works well on one material may not suit another, so final artwork, imprint size and color matching should be reviewed against the selected item rather than assumed from a catalog image.</p>
          <p>For a useful quotation, send the required quantity, delivery destination, need-by date, logo file and any packaging request. We can then confirm available colors, a suitable decoration method, MOQ guidance and the next mockup or sample step for the specific project.</p>
        </div>
        <nav class="catalog-seo-links" aria-label="Related mug and gift resources">
          <a href="/promotional-drinkware-for-corporate-gifts/"><strong>Drinkware Guide</strong><span>Compare use cases and sourcing decisions</span></a>
          <a href="/catalog/gift-sets/"><strong>Gift Sets</strong><span>Combine mugs with coordinated products</span></a>
          <a href="/client-appreciation-gifts/"><strong>Client Gifts</strong><span>Plan useful branded appreciation kits</span></a>
          <a href="/kit-studio/"><strong>Kit Studio</strong><span>Build a mixed-product kit direction</span></a>
        </nav>
      </section>
`;
  return source.replace(/(<\/section>)\s*(<section id="filterBar")/, `$1${guide}      $2`);
});

await updateFile('catalog/index.html', (source) => {
  if (source.includes('id="direct-product-index"')) return source;
  const groupDefinitions = [
    ['Caps, Hats & Visors', '/catalog/apparel-wearables/', (product) => product.category_slug === 'apparel-wearables'],
    ['Keychains & Small Accessories', '/catalog/keychains-accessories/', (product) => product.category_slug === 'keychains-accessories' && product.detail_url !== '/catalog/keychains-accessories/'],
    ['Featured Drinkware', '/catalog/drinkware/', (product) => product.detail_url === '/catalog/drinkware/bamboo-lid-glass-tumbler/'],
    ['Featured Stationery', '/catalog/stationery-office/', (product) => product.detail_url === '/catalog/stationery-office/custom-magnetic-bookmark/'],
  ];
  const groups = groupDefinitions.map(([label, categoryUrl, select]) => {
    const links = catalogProducts
      .filter((product) => product.publish_to_catalog !== false && product.detail_url && select(product))
      .map((product) => `<a href="${product.detail_url}">${escapeHtml(product.title_en)}</a>`)
      .join('<br>');
    return `<article><h3><a href="${categoryUrl}">${label}</a></h3><p>${links}</p></article>`;
  }).join('');
  const directIndex = `
      <section class="catalog-seo-intro" aria-labelledby="direct-product-index">
        <div class="catalog-seo-copy">
          <p class="catalog-kicker">Direct product index</p>
          <h2 id="direct-product-index">Browse Newly Added Promotional Products</h2>
          <p>Open a specific product page to review the available configuration and prepare an inquiry. Final MOQ, decoration, packaging and timing are confirmed against the selected item, artwork, quantity and destination.</p>
        </div>
        <div class="catalog-seo-notes">${groups}</div>
      </section>
`;
  return source.replace(/\n\s*(<section id="filterBar")/, `${directIndex}      $1`);
});

await updateFile('scripts/generate-gift-set-pages.mjs', (source) => {
  let script = source;
  script = script.replace(/(?:<link rel="icon" href="\/assets\/favicon\.svg" type="image\/svg\+xml">)+<meta property="og:type"/g, '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><meta property="og:type"');
  if (!script.includes('<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><meta property="og:type"')) {
    script = script.replaceAll(
      '<meta property="og:type"',
      '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><meta property="og:type"',
    );
  }
  script = script.replace("const assetVersion = '20260812-gift2';", "const assetVersion = '20260814-catalog7';");
  script = script.replace('| Custom Gift Set</title>', '| Custom Promotional Product</title>');
  script = script.replace("category: 'Custom Corporate Gift Sets'", "category: 'Gift Sets'");
  script = script.replace('class="product-detail-kicker">Custom Gift Set ·', 'class="product-detail-kicker">Custom Gift Sets ·');
  script = script.replace(
    '<a href="https://wa.me/8615869117529">WhatsApp +86 158 6911 7529</a></p></footer>',
    '<a href="https://wa.me/8615869117529">WhatsApp +86 158 6911 7529</a> · <a href="/privacy-policy/">Privacy Policy</a></p></footer>',
  );
  if (!script.includes('class="form-privacy"')) {
    script = script.replace(
      '<button class="pill-button primary" type="submit">Send Quote Request</button></form>',
      '<button class="pill-button primary" type="submit">Send Quote Request</button><p class="form-privacy">By submitting, you agree that FY PromoGifts may use these details to respond to your request. See our <a href="/privacy-policy/">Privacy Policy</a>.</p></form>',
    );
  }
  return script;
});

const sitemapPath = resolve(root, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
if (!sitemap.includes(`${site}/privacy-policy/`)) {
  sitemap = sitemap.replace(
    '</urlset>',
    `  <url><loc>${site}/privacy-policy/</loc><lastmod>2026-08-17</lastmod></url>\n</urlset>`,
  );
  await writeFile(sitemapPath, sitemap, 'utf8');
}

const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
let changed = 0;

for (const url of urls) {
  const relative = url.pathname === '/' ? 'index.html' : `${url.pathname.slice(1)}index.html`;
  const file = resolve(root, relative);
  if (!existsSync(file)) continue;

  let html = await readFile(file, 'utf8');
  const original = html;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim();
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1]
    || html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i)?.[1];
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]
    || html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i)?.[1]
    || url.href;
  const firstImage = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  const image = firstImage ? new URL(firstImage, canonical).href : fallbackImage;

  const tags = [];
  if (!/<link[^>]+rel=["']icon["']/i.test(html)) {
    tags.push('<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">');
  }
  if (!/<meta[^>]+property=["']og:title["']/i.test(html) && title && description) {
    tags.push('<meta property="og:type" content="website">');
    tags.push(`<meta property="og:title" content="${title}">`);
    tags.push(`<meta property="og:description" content="${description}">`);
    tags.push(`<meta property="og:url" content="${canonical}">`);
    tags.push(`<meta property="og:image" content="${image}">`);
  }
  if (!/<meta[^>]+name=["']twitter:card["']/i.test(html)) {
    tags.push('<meta name="twitter:card" content="summary_large_image">');
  }
  if (tags.length) {
    html = html.replace(/<\/head>/i, `${tags.join('\n')}\n</head>`);
  }

  html = html.replace(
    /(<nav\s+class=["'][^"']*footer-links[^"']*["'][^>]*>)([\s\S]*?)(<\/nav>)/i,
    (match, open, links, close) => links.includes('/privacy-policy/')
      ? match
      : `${open}${links}<a href="/privacy-policy/">Privacy Policy</a>${close}`,
  );

  if (html !== original) {
    await writeFile(file, html, 'utf8');
    changed += 1;
  }
}

console.log(`SEO foundation updated ${changed} HTML files across ${urls.length} sitemap URLs.`);
