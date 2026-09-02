import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const excluded = new Set(['.codex-backups', '.codex-deploy', '.git', 'data', 'fy-erp-desktop', 'node_modules']);

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else if (entry.name === 'index.html') result.push(full);
  }
  return result;
}

function parseRedirects() {
  const rules = [];
  for (const raw of fs.readFileSync(path.join(root, '_redirects'), 'utf8').split(/\r?\n/)) {
    const parts = raw.trim().split(/\s+/);
    if (parts.length >= 3 && /^30[178]$/.test(parts[2])) rules.push({ source: parts[0], target: parts[1] });
  }
  return rules;
}

const redirects = parseRedirects();
function isRedirected(url) {
  const clean = url.split(/[?#]/)[0];
  return redirects.some(({ source }) => {
    if (source.endsWith('*')) return clean.startsWith(source.slice(0, -1));
    return clean === source || clean.replace(/\/$/, '') === source.replace(/\/$/, '');
  });
}

function routeExists(url) {
  const clean = decodeURI(url.split(/[?#]/)[0]);
  if (!clean.startsWith('/')) return true;
  if (isRedirected(clean)) return true;
  const relative = clean.replace(/^\//, '');
  const candidates = clean === '/'
    ? [path.join(root, 'index.html')]
    : clean.endsWith('/')
      ? [path.join(root, relative, 'index.html')]
      : [path.join(root, relative), path.join(root, `${relative}.html`), path.join(root, relative, 'index.html')];
  return candidates.some((file) => fs.existsSync(file));
}

function localAssetExists(value, htmlFile) {
  const clean = value.split(/[?#]/)[0];
  if (!clean || clean.includes('${') || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(clean)) return true;
  const file = clean.startsWith('/')
    ? path.join(root, decodeURI(clean.slice(1)))
    : path.resolve(path.dirname(htmlFile), decodeURI(clean));
  return fs.existsSync(file);
}

const pages = walk(root);
const errors = [];
const warnings = [];
const canonicalOwners = new Map();

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const route = relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;
  const noindex = /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const redirected = isRedirected(route);

  for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }

  for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)) {
    if (!localAssetExists(match[1], file)) errors.push(`${relative}: missing local asset ${match[1]}`);
  }

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1];
    if (href.startsWith('/') && !routeExists(href)) warnings.push(`${relative}: unresolved internal link ${href}`);
  }

  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  if (!noindex && !redirected) {
    if (!canonical) errors.push(`${relative}: indexable page missing canonical`);
    else {
      const owner = canonicalOwners.get(canonical);
      if (owner) errors.push(`${relative}: duplicate indexable canonical also used by ${owner}`);
      else canonicalOwners.set(canonical, relative);
    }
  }
}

const targeted = [
  ['catalog/gift-sets/index.html', ['id="real-samples"', '3–5 days', '5–7 days', '500+ pieces', 'real-sample-grid']],
  ['catalog/gift-sets/smart-heated-ceramic-mug-gift-set/index.html', ['100 sets', '3–5 days', '5–7 days', '500 pieces', '/api/inquiry']],
  ['catalog/gift-sets/premium-ceramic-mug-towel-gift-box/index.html', ['40 sets', '3–5 days', '5–7 days', '500 pieces', '/api/inquiry']],
  ['catalog/gift-sets/ceramic-mug-towel-gift-set/index.html', ['60 sets', '3–5 days', '5–7 days', '500 pieces', '/api/inquiry']],
  ['kit-studio/index.html', ['studio-guide', 'employee-onboarding-kits', 'client-appreciation-gifts', 'trade-show-giveaway-kits', '/api/inquiry']],
];
for (const [relative, needles] of targeted) {
  const html = fs.readFileSync(path.join(root, relative), 'utf8');
  for (const needle of needles) if (!html.includes(needle)) errors.push(`${relative}: missing required release content ${needle}`);
}

for (const name of ['ChowNow', 'SWEET LIFE', 'Sweet Life']) {
  for (const [relative] of targeted) {
    const html = fs.readFileSync(path.join(root, relative), 'utf8');
    if (html.includes(name)) errors.push(`${relative}: customer identifier leaked in page text (${name})`);
  }
}

const summary = {
  pages: pages.length,
  validJsonLd: errors.filter((item) => item.includes('JSON-LD')).length === 0,
  uniqueIndexableCanonicals: canonicalOwners.size,
  missingAssets: errors.filter((item) => item.includes('missing local asset')).length,
  unresolvedInternalLinks: warnings.length,
  errors: errors.length,
};
console.log(JSON.stringify(summary, null, 2));
if (warnings.length) console.warn(warnings.slice(0, 30).join('\n'));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
