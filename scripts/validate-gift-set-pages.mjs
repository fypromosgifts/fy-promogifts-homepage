import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const products = JSON.parse(await readFile(resolve(root, 'catalog/data/products.json'), 'utf8'));
const useCases = JSON.parse(await readFile(resolve(root, 'catalog/data/use-cases.json'), 'utf8'));
const allowedUseCases = new Set(useCases.map((item) => item.use_case_name));
const giftSets = products.filter((product) => product.product_id.startsWith('GF'));
const errors = [];

if (giftSets.length !== 4) errors.push(`Expected 4 gift sets, found ${giftSets.length}.`);
if (new Set(giftSets.map((product) => product.product_id)).size !== giftSets.length) errors.push('Duplicate gift set IDs.');
if (new Set(giftSets.map((product) => product.detail_url)).size !== giftSets.length) errors.push('Duplicate detail URLs.');

for (const product of giftSets) {
  if (product.parent_category_slug === product.category_slug) errors.push(`${product.product_id}: self-parent category.`);
  if (product.capacity) errors.push(`${product.product_id}: gift-set capacity must be empty.`);
  for (const useCase of product.use_case || []) {
    if (!allowedUseCases.has(useCase)) errors.push(`${product.product_id}: unknown use case "${useCase}".`);
  }
  for (const image of [product.image_main, ...(product.image_gallery || [])]) {
    try { await access(resolve(root, image.replace(/^\//, ''))); } catch { errors.push(`${product.product_id}: missing image ${image}.`); }
  }
  const pagePath = resolve(root, product.detail_url.replace(/^\//, ''), 'index.html');
  let html = '';
  try { html = await readFile(pagePath, 'utf8'); } catch { errors.push(`${product.product_id}: missing detail page.`); continue; }
  const checks = [
    ['canonical', `<link rel="canonical" href="https://www.fypromogifts.com${product.detail_url}">`],
    ['Product schema', '"@type":"Product"'],
    ['Breadcrumb schema', '"@type":"BreadcrumbList"'],
    ['visible FAQ', 'class="product-faq"'],
    ['Formspree form', 'https://formspree.io/f/xgoqqrno'],
    ['versioned CSS', 'catalog.css?v=20260812-gift2']
  ];
  checks.forEach(([label, needle]) => { if (!html.includes(needle)) errors.push(`${product.product_id}: missing ${label}.`); });
  if (/detail\.1688\.com|1688\.com|"brand":\{"@type":"Brand","name":"FY PromoGifts"/.test(html)) errors.push(`${product.product_id}: public source or false brand claim leaked.`);
}

const categoryHtml = await readFile(resolve(root, 'catalog/gift-sets/index.html'), 'utf8');
for (const product of giftSets) {
  if (!categoryHtml.includes(product.title_en) || !categoryHtml.includes(product.detail_url)) errors.push(`${product.product_id}: missing static category card.`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Gift set validation passed: 4 products, assets, pages, use cases, SEO data and inquiry forms are consistent.');
