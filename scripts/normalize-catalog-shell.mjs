import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../catalog');
const version = '20260812-gift2';

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

let changed = 0;
for (const file of await htmlFiles(root)) {
  const before = await readFile(file, 'utf8');
  const after = before
    .replaceAll('href="/catalog/">Custom Gifts</a>', 'href="/#customization">Customization</a>')
    .replaceAll('href="/catalog/">Lookbook</a>', 'href="/#projects">Projects</a>')
    .replaceAll('href="mailto:info@fypromogifts.com">Contact</a>', 'href="/#contact">Contact</a>')
    .replace(/(<link\s+rel="stylesheet"\s+href="[^"]*catalog\.css)(?:\?[^"#]*)?("[^>]*>)/g, `$1?v=${version}$2`)
    .replace(/(<script\s+src="[^"]*catalog\.js)(?:\?[^"#]*)?("[^>]*>)/g, `$1?v=${version}$2`)
    .replace(/(data-products-url="\/catalog\/data\/products\.json)(?:\?[^"#]*)?"/g, `$1?v=${version}"`)
    .replace(/(data-categories-url="\/catalog\/data\/categories\.json)(?:\?[^"#]*)?"/g, `$1?v=${version}"`)
    .replace(/(data-use-cases-url="\/catalog\/data\/use-cases\.json)(?:\?[^"#]*)?"/g, `$1?v=${version}"`)
    .replace(/\s*<button\b[^>]*data-pdf-placeholder[^>]*>[\s\S]*?<\/button>/g, '');
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
}

console.log(`Normalized ${changed} catalog HTML files.`);
