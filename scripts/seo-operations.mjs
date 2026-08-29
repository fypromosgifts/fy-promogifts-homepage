import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SITE = "https://www.fypromogifts.com";
const OPS_DIR = join(ROOT, "data", "seo-ops");
const LOCAL_DASHBOARD = resolve(ROOT, "..", "FY独立站增长总看板.html");
const SEARCH_ANALYSIS_FILE = resolve(ROOT, "..", "FY-SEO-Data", "latest-search-analysis.json");
const EXCLUDED_TOP_LEVEL = new Set([
  ".codex-backups",
  ".codex-deploy",
  ".codex-xlsx-audit",
  ".git",
  ".github",
  "artifacts",
  "assets",
  "data",
  "fy-erp-desktop",
  "output",
  "scripts",
  "_image-review-20260724",
  "_image-review-current-batch",
  "_image-review-supp-20260724",
  "_image-review-supp2-20260724",
  "_retouched-product-assets-20260724"
]);

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function read(path, fallback = "") {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : fallback;
}

function write(path, value) {
  ensureDir(dirname(path));
  writeFileSync(path, value, "utf8");
}

function append(path, value) {
  ensureDir(dirname(path));
  appendFileSync(path, value, "utf8");
}

function readJson(path, fallback) {
  try {
    return JSON.parse(read(path));
  } catch {
    return fallback;
  }
}

function shanghaiDate(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function cliArgs(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const item = values[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = values[index + 1];
    result[key] = next && !next.startsWith("--") ? values[++index] : true;
  }
  return result;
}

function escapeXml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(value) {
  return decodeHtml(String(value).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function attrs(tag) {
  const result = {};
  const pattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = pattern.exec(tag))) {
    const name = match[1].toLowerCase();
    if (name === "meta" || name === "link" || name === "img" || name === "a") continue;
    result[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return result;
}

function allTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
}

function pagePath(file) {
  const rel = relative(ROOT, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

function findIndexFiles(dir = ROOT, depth = 0) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (depth === 0 && EXCLUDED_TOP_LEVEL.has(entry.name)) continue;
      files.push(...findIndexFiles(join(dir, entry.name), depth + 1));
    } else if (entry.isFile() && entry.name === "index.html") {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

function parsePage(file) {
  const html = read(file);
  const markup = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ");
  const titleMatch = markup.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const h1Matches = [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1])).filter(Boolean);
  const meta = {};
  for (const tag of allTags(markup, "meta")) {
    const data = attrs(tag);
    const key = (data.name || data.property || "").toLowerCase();
    if (key) meta[key] = data.content || "";
  }
  let canonical = "";
  for (const tag of allTags(markup, "link")) {
    const data = attrs(tag);
    if ((data.rel || "").toLowerCase().split(/\s+/).includes("canonical")) canonical = data.href || "";
  }
  const images = allTags(markup, "img").map(attrs);
  const links = allTags(markup, "a").map(attrs).map((item) => item.href).filter((item) => item !== undefined);
  const jsonLd = [...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
  let invalidJsonLd = 0;
  for (const block of jsonLd) {
    try { JSON.parse(block); } catch { invalidJsonLd += 1; }
  }
  const words = stripTags(markup).match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g)?.length || 0;
  return {
    file,
    path: pagePath(file),
    title: titleMatch ? stripTags(titleMatch[1]) : "",
    description: meta.description || "",
    robots: (meta.robots || "").toLowerCase(),
    canonical,
    canonicalPath: canonical ? new URL(canonical, SITE).pathname : "",
    h1: h1Matches,
    words,
    images,
    links,
    jsonLdCount: jsonLd.length,
    invalidJsonLd
  };
}

function normalizePath(value) {
  if (!value) return "/";
  const path = value.split(/[?#]/)[0] || "/";
  if (path === "/") return path;
  return path.endsWith("/") ? path : `${path}/`;
}

function redirectRules() {
  return read(join(ROOT, "_redirects"))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts.length >= 2)
    .map(([source, target, status = "302"]) => ({ source, target, status }));
}

function redirectFor(path, rules) {
  const normalized = normalizePath(path);
  for (const rule of rules) {
    if (!rule.source.startsWith("/")) continue;
    if (rule.source.includes("*")) {
      const escaped = rule.source.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      if (new RegExp(`^${escaped}$`).test(path) || new RegExp(`^${escaped}$`).test(normalized)) return rule;
    } else if (normalizePath(rule.source) === normalized) {
      return rule;
    }
  }
  return null;
}

function sitemapEntries() {
  const xml = read(join(ROOT, "sitemap.xml"));
  const entries = new Map();
  for (const match of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?[\s\S]*?<\/url>/gi)) {
    const url = decodeHtml(match[1]);
    entries.set(new URL(url).pathname, { url, lastmod: match[2] || "" });
  }
  return entries;
}

function pathTargetExists(path, rules) {
  if (redirectFor(path, rules)) return true;
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  if (clean === "/") return existsSync(join(ROOT, "index.html"));
  const direct = join(ROOT, clean.replace(/^\/+/, "").split("/").join(sep));
  if (existsSync(direct) && statSync(direct).isFile()) return true;
  return existsSync(join(direct, "index.html"));
}

function isIndexable(page, rules) {
  return page.path !== "/404.html"
    && !page.robots.includes("noindex")
    && Boolean(page.canonical)
    && page.canonicalPath === page.path
    && !redirectFor(page.path, rules);
}

function audit() {
  const pages = findIndexFiles().map(parsePage).sort((a, b) => a.path.localeCompare(b.path));
  const rules = redirectRules();
  const sitemap = sitemapEntries();
  const issues = [];
  const add = (severity, code, path, detail) => issues.push({ severity, code, path, detail });
  const byTitle = new Map();

  for (const page of pages) {
    if (page.path === "/404.html") continue;
    if (!page.title) add("P0", "missing_title", page.path, "Add a unique title.");
    if (!page.description) add("P1", "missing_description", page.path, "Add a buyer-focused meta description.");
    if (!page.canonical) add("P0", "missing_canonical", page.path, "Add a canonical URL.");
    if (page.h1.length !== 1) add("P0", "h1_count", page.path, `Expected 1 visible H1; found ${page.h1.length}.`);
    if (page.invalidJsonLd) add("P0", "invalid_jsonld", page.path, `${page.invalidJsonLd} invalid JSON-LD block(s).`);
    if (page.canonical && page.canonicalPath !== page.path && !redirectFor(page.path, rules)) {
      add("P1", "canonical_mismatch", page.path, `Canonical points to ${page.canonicalPath}; add a redirect if this is a duplicate.`);
    }
    if (isIndexable(page, rules) && !sitemap.has(page.path)) add("P1", "missing_from_sitemap", page.path, "Indexable self-canonical page is absent from sitemap.xml.");
    if (isIndexable(page, rules) && page.words < 250) add("P2", "thin_visible_copy", page.path, `${page.words} visible English words; confirm this page has unique buyer value.`);
    const missingAlt = page.images.filter((image) => !(image.alt || "").trim()).length;
    if (isIndexable(page, rules) && missingAlt) add("P2", "missing_image_alt", page.path, `${missingAlt} image(s) have no alt text.`);
    if (page.title) {
      if (!byTitle.has(page.title)) byTitle.set(page.title, []);
      byTitle.get(page.title).push(page.path);
    }
    for (const href of page.links) {
      if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href) || href.includes("wa.me/")) continue;
      let parsed;
      try { parsed = new URL(href, SITE); } catch { continue; }
      if (!(["fypromogifts.com", "www.fypromogifts.com"].includes(parsed.hostname))) continue;
      if (!pathTargetExists(parsed.pathname, rules)) add("P0", "broken_internal_link", page.path, `${href} does not resolve to a local file or redirect.`);
    }
  }

  for (const [title, paths] of byTitle) {
    const indexablePaths = paths.filter((path) => {
      const page = pages.find((item) => item.path === path);
      return page && isIndexable(page, rules);
    });
    if (indexablePaths.length > 1) add("P1", "duplicate_title", indexablePaths.join(", "), title);
  }

  for (const [path] of sitemap) {
    const page = pages.find((item) => item.path === path);
    if (!page) add("P0", "sitemap_missing_file", path, "Sitemap URL has no matching public index.html.");
    else if (redirectFor(path, rules)) add("P0", "redirect_in_sitemap", path, "Remove redirected URL from sitemap.");
    else if (!isIndexable(page, rules)) add("P1", "non_indexable_in_sitemap", path, "Sitemap should contain only indexable canonical URLs.");
  }

  const indexablePages = pages.filter((page) => isIndexable(page, rules));
  const summary = {
    generatedAt: new Date().toISOString(),
    publicPages: pages.length,
    indexablePages: indexablePages.length,
    sitemapUrls: sitemap.size,
    sitemapCoveragePercent: indexablePages.length ? Number(((indexablePages.filter((page) => sitemap.has(page.path)).length / indexablePages.length) * 100).toFixed(1)) : 0,
    P0: issues.filter((issue) => issue.severity === "P0").length,
    P1: issues.filter((issue) => issue.severity === "P1").length,
    P2: issues.filter((issue) => issue.severity === "P2").length
  };
  return { summary, issues, pages: pages.map(({ file, links, images, ...page }) => ({ ...page, file: relative(ROOT, file).split(sep).join("/"), imageCount: images.length })) };
}

function saveAudit(result) {
  ensureDir(OPS_DIR);
  write(join(OPS_DIR, "latest-audit.json"), `${JSON.stringify(result, null, 2)}\n`);
  const rows = result.issues.length
    ? result.issues.map((item) => `| ${item.severity} | ${item.code} | \`${item.path}\` | ${item.detail.replace(/\|/g, "\\|")} |`).join("\n")
    : "| - | clean | - | No local SEO issues found. |";
  const markdown = `# FY PromoGifts SEO Audit\n\nGenerated: ${result.summary.generatedAt}\n\n## Scorecard\n\n| Metric | Value |\n|---|---:|\n| Public HTML pages | ${result.summary.publicPages} |\n| Indexable canonical pages | ${result.summary.indexablePages} |\n| Sitemap URLs | ${result.summary.sitemapUrls} |\n| Sitemap coverage | ${result.summary.sitemapCoveragePercent}% |\n| P0 issues | ${result.summary.P0} |\n| P1 issues | ${result.summary.P1} |\n| P2 issues | ${result.summary.P2} |\n\n## Findings\n\n| Priority | Code | URL | Detail |\n|---|---|---|---|\n${rows}\n`;
  write(join(OPS_DIR, "latest-audit.md"), markdown);
}

function taskStore() {
  return readJson(join(OPS_DIR, "tasks.json"), { version: 1, updatedAt: "", tasks: [] });
}

function weekPlanStore() {
  return readJson(join(OPS_DIR, "week-plan.json"), { title: "本周任务", days: [], outcomeTargets: [] });
}

function searchAnalysisStore() {
  return readJson(SEARCH_ANALYSIS_FILE, null);
}

function recentChanges(limit = 8) {
  return read(join(OPS_DIR, "changes.jsonl"))
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      try { return [JSON.parse(line)]; } catch { return []; }
    })
    .slice(-limit)
    .reverse();
}

function saveDashboard(result) {
  const store = taskStore();
  const weekPlan = weekPlanStore();
  const direction = weekPlan.siteDirection || {};
  const tasks = store.tasks || [];
  const active = tasks.filter((task) => ["next", "in_progress"].includes(task.status));
  const waiting = tasks.filter((task) => task.status === "waiting");
  const done = tasks.filter((task) => task.status === "done");
  const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const topTasks = [...active].sort((a, b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9)).slice(0, 5);
  const taskRows = topTasks.length
    ? topTasks.map((task) => `| ${task.priority} | ${task.title} | ${task.owner} | ${task.nextAction || task.successCriteria || "-"} |`).join("\n")
    : "| - | 当前没有可执行任务 | - | 从 ROADMAP 或数据复盘中建立下一项 |";
  const waitingRows = waiting.length
    ? waiting.slice(0, 5).map((task) => `| ${task.priority} | ${task.title} | ${task.owner} | ${task.evidenceNeeded || task.nextAction || "等待输入"} |`).join("\n")
    : "| - | 无 | - | - |";
  const changeRows = recentChanges().length
    ? recentChanges().map((item) => `| ${item.date || "-"} | ${item.type || "change"} | ${item.target || "-"} | ${(item.summary || "-").replace(/\|/g, "\\|")} | ${item.verification || "-"} |`).join("\n")
    : "| - | - | - | 尚无改动记录 | - |";
  const markdown = `# FY PromoGifts 独立站增长总看板

最后刷新：${new Date().toISOString()}  
使用方式：每天只先看本页；AI 完成任何站点优化后必须写入改动日志。

## 当前健康度

| 指标 | 当前值 | 目标 |
|---|---:|---:|
| 可索引正式页面 | ${result.summary.indexablePages} | 持续增长但不造薄页 |
| Sitemap 覆盖率 | ${result.summary.sitemapCoveragePercent}% | 100% |
| P0 / P1 / P2 | ${result.summary.P0} / ${result.summary.P1} / ${result.summary.P2} | 0 / 0 / 持续评估 |
| 可执行任务 | ${active.length} | 同时不超过 5 项 |
| 等待人工数据/登录 | ${waiting.length} | 每周至少清理 1 项 |
| 已完成任务 | ${done.length} | 留存证据，不删除历史 |

## 网站方向

**定位：**${direction.positioning || "待确定"}  
**增长主线：**${direction.northStar || "待确定"}

${(direction.trafficStrategy || []).map((item) => `- ${item}`).join("\n")}

**成交路径：**${(direction.funnel || []).join(" → ") || "待确定"}

### LuxoPack 可吸收原则

${(direction.luxopack?.adopt || []).map((item) => `- ${item}`).join("\n")}

边界：${(direction.luxopack?.guardrails || []).join("；") || "不照搬，不编造"}。

## 下一步任务

| 优先级 | 任务 | 负责人 | 下一动作 / 完成标准 |
|---|---|---|---|
${taskRows}

## 等待输入

| 优先级 | 任务 | 负责人 | 需要什么 |
|---|---|---|---|
${waitingRows}

## 最近改动

| 日期 | 类型 | 页面/对象 | 做了什么 | 验证 |
|---|---|---|---|---|
${changeRows}

## 固定入口

- 今日任务：\`data/seo-ops/TODAY.md\`
- 90 天路线图：\`data/seo-ops/ROADMAP.md\`
- 任务真相源：\`data/seo-ops/tasks.json\`
- 追加式改动日志：\`data/seo-ops/changes.jsonl\`
- 内容管线：\`data/seo-ops/content-pipeline.csv\`
- 搜索与询盘 KPI：\`data/seo-ops/kpi-log.csv\`
- 真实证据台账：\`data/seo-ops/evidence-ledger.csv\`
- 最新技术审计：\`data/seo-ops/latest-audit.md\`

## AI 记录规则

完成修改后运行：

\`node scripts/seo-operations.mjs record --type page_update --target /目标路径/ --summary "实际做了什么" --reason "为什么做" --verification "如何验证" --task TASK-ID --next-review YYYY-MM-DD\`

不允许把“计划做”记成“已完成”；没有数据时写 \`unknown\`，不得编造排名、流量或询盘。
`;
  write(join(OPS_DIR, "DASHBOARD.md"), markdown);
  saveHtmlDashboard(result);
}

function saveHtmlDashboard(result) {
  const tasks = taskStore().tasks || [];
  const weekPlan = weekPlanStore();
  const direction = weekPlan.siteDirection || {};
  const search = searchAnalysisStore();
  const todayDate = shanghaiDate();
  const todayPlan = (weekPlan.days || []).find((day) => day.date === todayDate);
  const active = tasks.filter((task) => ["next", "in_progress"].includes(task.status));
  const waiting = tasks.filter((task) => task.status === "waiting");
  const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const topTasks = [...active].sort((a, b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9)).slice(0, 5);
  const targetLabel = (target) => {
    if (!target) return "全站";
    if (target.startsWith("/")) return `<a href="${SITE}${escapeHtml(target)}" target="_blank" rel="noopener">${escapeHtml(target)}</a>`;
    return escapeHtml(target);
  };
  const taskCards = (items, emptyText) => items.length
    ? items.map((task) => `<article class="task-card">
        <div class="task-head"><span class="priority ${escapeHtml(task.priority).toLowerCase()}">${escapeHtml(task.priority)}</span><span class="status">${escapeHtml(task.status)}</span></div>
        <h3>${escapeHtml(task.title)}</h3>
        <p class="meta">负责人：${escapeHtml(task.owner)} · 目标：${targetLabel(task.target)}</p>
        <p>${escapeHtml(task.nextAction || task.successCriteria || "")}</p>
        ${task.evidenceNeeded ? `<div class="evidence"><strong>需要：</strong>${escapeHtml(task.evidenceNeeded)}</div>` : ""}
        <code>${escapeHtml(task.id)}</code>
      </article>`).join("\n")
    : `<div class="empty">${escapeHtml(emptyText)}</div>`;
  const changes = recentChanges(10);
  const changeCards = changes.length
    ? changes.map((item) => `<article class="change-row">
        <time>${escapeHtml(item.date || "-")}</time>
        <div><strong>${escapeHtml(item.summary || "-")}</strong><span>${targetLabel(item.target)} · ${escapeHtml(item.type || "change")}</span></div>
        <span class="verification">${escapeHtml(item.verification || "未记录验证")}</span>
      </article>`).join("\n")
    : '<div class="empty">尚无改动记录</div>';
  const mainTask = topTasks[0];
  const listItems = (items) => (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const userActions = todayPlan?.userTasks?.length
    ? todayPlan.userTasks.map((item, index) => `<article class="user-action"><span>${index + 1}</span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p><small>交付：${escapeHtml(item.deliverable)}</small></div></article>`).join("\n")
    : '<div class="empty">今天没有等待你处理的事项。</div>';
  const weekCards = (weekPlan.days || []).map((day) => `<article class="day-card ${day.date === todayDate ? "today" : ""}">
      <div class="day-date"><strong>${escapeHtml(day.label)}</strong><span>${escapeHtml(day.date)}</span></div>
      <h3>${escapeHtml(day.focus)}</h3>
      <div class="day-owner">AI 执行</div><ul>${listItems(day.aiTasks)}</ul>
      <div class="day-owner user">你配合</div><ul>${listItems((day.userTasks || []).map((item) => item.title))}</ul>
      <p class="done"><strong>完成标准：</strong>${escapeHtml(day.doneCriteria)}</p>
    </article>`).join("\n");
  const outcomeTags = (weekPlan.outcomeTargets || []).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const opportunityRows = search?.opportunities?.length
    ? search.opportunities.map((item) => `<tr>
        <td><span class="rank-badge">${escapeHtml(item.priority)}</span></td>
        <td><a href="${SITE}${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.url)}</a></td>
        <td>${escapeHtml(item.impressions)}</td><td>${escapeHtml(item.clicks)}</td><td>${escapeHtml(item.position)}</td>
        <td><strong>${escapeHtml(item.signal)}</strong><small>${escapeHtml(item.action)}</small></td>
      </tr>`).join("\n")
    : '<tr><td colspan="6">尚未导入 GSC/Bing 数据。</td></tr>';
  const diagnosisCards = (search?.diagnosis || []).map((item) => `<article class="diagnosis-card"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></article>`).join("");
  const confidenceRules = (search?.confidence?.rules || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const strategyPoints = (direction.trafficStrategy || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const funnelSteps = (direction.funnel || []).map((item, index) => `<div class="funnel-step"><span>${index + 1}</span><strong>${escapeHtml(item)}</strong></div>`).join("");
  const benchmarkPoints = (direction.luxopack?.adopt || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const strategyGuardrails = (direction.luxopack?.guardrails || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,nosnippet">
  <title>FY PromoGifts 独立站增长总看板</title>
  <style>
    :root{--navy:#071724;--navy2:#0d2b43;--cream:#f6efe6;--paper:#fffdf9;--gold:#d99b38;--gold2:#f0bf68;--ink:#0b2034;--muted:#68778a;--green:#16794d;--red:#bb3d3d;--line:#dfd7cc;--radius:22px}
    *{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--ink);font:15px/1.65 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}a{color:#14649a;text-decoration:none}a:hover{text-decoration:underline}
    header{background:linear-gradient(135deg,var(--navy),var(--navy2));color:white;padding:42px 24px 76px}.wrap{width:min(1180px,calc(100% - 32px));margin:auto}.eyebrow{color:var(--gold2);font-weight:800;letter-spacing:.12em;text-transform:uppercase}.title-row{display:flex;justify-content:space-between;gap:24px;align-items:end}h1{font:700 clamp(30px,5vw,52px)/1.08 Georgia,serif;margin:10px 0}.updated{color:#bed0dc}.actions{display:flex;gap:10px;flex-wrap:wrap}.btn{border:1px solid #ffffff44;border-radius:999px;padding:10px 15px;background:#ffffff12;color:white;cursor:pointer}.btn:hover{background:#ffffff22}.dashboard{margin-top:-44px;padding-bottom:48px}.score-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:12px}.score{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 12px 30px #1326380d}.score span{display:block;color:var(--muted);font-size:13px}.score strong{display:block;font:700 29px/1.2 Georgia,serif;margin-top:5px}.good{color:var(--green)}.warn{color:#a66a00}.panel{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:24px;margin-top:18px;box-shadow:0 12px 30px #1326380d}.panel h2{font:700 25px/1.2 Georgia,serif;margin:0 0 16px}.focus{display:grid;grid-template-columns:100px 1fr;gap:20px;align-items:center;background:linear-gradient(135deg,#fff6e4,#fffdf9);border-color:#e7c887}.focus .number{font:700 50px/1 Georgia,serif;color:var(--gold);text-align:center}.focus h2{margin:0 0 6px}.focus p{margin:0;color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.task-card{border:1px solid var(--line);border-radius:17px;padding:18px;background:#fff}.task-head{display:flex;justify-content:space-between}.priority,.status{font-size:12px;font-weight:800;border-radius:999px;padding:3px 9px;background:#edf2f5}.priority.p0{background:#fee8e8;color:var(--red)}.priority.p1{background:#fff0cf;color:#8a5a00}.priority.p2{background:#e8f1f7;color:#35617c}.task-card h3{margin:13px 0 5px;font-size:18px}.task-card p{margin:6px 0}.meta{font-size:13px;color:var(--muted)}.evidence{margin:12px 0;padding:10px 12px;background:#f4f1ec;border-radius:10px;font-size:13px}.task-card code{font-size:12px;color:var(--muted)}.change-row{display:grid;grid-template-columns:100px minmax(0,1fr) minmax(220px,.8fr);gap:18px;padding:14px 0;border-bottom:1px solid var(--line)}.change-row:last-child{border-bottom:0}.change-row time{color:var(--muted)}.change-row strong,.change-row span{display:block}.change-row div span,.verification{font-size:13px;color:var(--muted)}.empty{padding:20px;background:#f4f1ec;border-radius:14px;color:var(--muted)}.notice{margin-top:18px;padding:16px 20px;border:1px dashed #c9b99f;border-radius:16px;color:var(--muted)}
    .search-head{display:flex;justify-content:space-between;gap:16px;align-items:start}.confidence{background:#fff0cf;color:#7d5300;border-radius:999px;padding:6px 11px;font-size:12px;font-weight:800;white-space:nowrap}.diagnosis-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:14px 0}.diagnosis-card{border:1px solid var(--line);border-radius:15px;padding:15px;background:#fff}.diagnosis-card p{margin:6px 0 0;color:var(--muted);font-size:13px}.data-note{background:#f2f6f8;border-left:4px solid #4e809f;border-radius:12px;padding:14px 16px}.data-note p{margin:0}.data-note ul{margin:8px 0 0;padding-left:19px}.table-wrap{overflow:auto;margin-top:16px}table{border-collapse:collapse;width:100%;min-width:820px}th,td{padding:11px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{font-size:12px;color:var(--muted);background:#f7f4ef}td small{display:block;color:var(--muted);margin-top:4px}.rank-badge{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--navy);color:white;font-weight:800}
    .user-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.user-action{display:grid;grid-template-columns:46px 1fr;gap:14px;border:1px solid #e7c887;background:#fff9ed;border-radius:17px;padding:18px}.user-action>span{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:var(--gold);color:white;font:700 21px Georgia,serif}.user-action strong{font-size:17px}.user-action p{margin:5px 0}.user-action small{color:var(--muted)}.week-intro{display:flex;justify-content:space-between;gap:20px;align-items:start}.week-intro p{margin:6px 0;color:var(--muted)}.outcomes{display:flex;flex-wrap:wrap;gap:7px;justify-content:flex-end}.outcomes span{background:#edf4ef;color:#276446;border-radius:999px;padding:5px 10px;font-size:12px}.week-grid{display:grid;grid-template-columns:repeat(7,minmax(210px,1fr));gap:12px;overflow-x:auto;padding:4px 2px 12px}.day-card{border:1px solid var(--line);border-radius:16px;padding:16px;background:white;min-height:360px}.day-card.today{border:2px solid var(--gold);background:#fffaf0}.day-date{display:flex;justify-content:space-between;color:var(--muted)}.day-date strong{color:var(--ink)}.day-card h3{margin:12px 0;font-size:18px}.day-card ul{margin:4px 0 13px;padding-left:19px}.day-card li{margin:3px 0}.day-owner{font-size:12px;font-weight:800;color:#35617c;text-transform:uppercase}.day-owner.user{color:#8a5a00}.done{margin-top:14px;padding-top:12px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
    .strategy{background:linear-gradient(145deg,#0b2133,#123b59);color:white;border:0}.strategy h2{font-size:30px;margin-bottom:8px}.strategy .lead{color:#d8e4ec;font-size:17px;max-width:920px}.strategy-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}.strategy-card{border:1px solid #ffffff2c;border-radius:17px;padding:18px;background:#ffffff0d}.strategy-card h3{margin:0 0 10px;color:var(--gold2)}.strategy-card ul{margin:0;padding-left:19px}.strategy-card li{margin:6px 0}.funnel{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:14px}.funnel-step{display:flex;align-items:center;gap:9px;border-radius:13px;padding:12px;background:#ffffff12}.funnel-step span{display:grid;place-items:center;flex:0 0 28px;height:28px;border-radius:50%;background:var(--gold);color:#071724}.guardrail{margin-top:12px;padding-top:12px;border-top:1px solid #ffffff25;color:#d8e4ec}.guardrail strong{color:white}
    @media(max-width:900px){.score-grid{grid-template-columns:repeat(3,1fr)}.diagnosis-grid{grid-template-columns:1fr}.change-row{grid-template-columns:82px 1fr}.verification{grid-column:2}.title-row{align-items:start;flex-direction:column}.week-intro{display:block}.outcomes{justify-content:flex-start}.user-actions{grid-template-columns:1fr}.strategy-grid{grid-template-columns:1fr}.funnel{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:620px){header{padding:30px 16px 68px}.wrap{width:min(100% - 20px,1180px)}.score-grid{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.focus{grid-template-columns:1fr}.focus .number{text-align:left}.panel{padding:18px}.change-row{grid-template-columns:1fr}.verification{grid-column:1}.funnel{grid-template-columns:1fr}.strategy h2{font-size:25px}}
    @media print{header{padding:20px;background:white;color:var(--ink)}.dashboard{margin:0}.actions,.notice{display:none}.panel,.score{box-shadow:none}}
  </style>
</head>
<body>
  <header><div class="wrap">
    <div class="eyebrow">FY PromoGifts · Growth Control</div>
    <div class="title-row"><div><h1>独立站增长总看板</h1><div class="updated">最近刷新：${escapeHtml(new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false }))}</div></div>
    <div class="actions"><button class="btn" onclick="location.reload()">重新载入</button><button class="btn" onclick="window.print()">打印 / 保存 PDF</button></div></div>
  </div></header>
  <main class="wrap dashboard">
    <section class="score-grid">
      <div class="score"><span>正式页面</span><strong>${result.summary.indexablePages}</strong></div>
      <div class="score"><span>Sitemap 覆盖</span><strong class="good">${result.summary.sitemapCoveragePercent}%</strong></div>
      <div class="score"><span>P0 问题</span><strong class="${result.summary.P0 ? "warn" : "good"}">${result.summary.P0}</strong></div>
      <div class="score"><span>P1 问题</span><strong class="${result.summary.P1 ? "warn" : "good"}">${result.summary.P1}</strong></div>
      <div class="score"><span>GSC 28 天展示</span><strong>${search?.gsc?.impressions ?? "—"}</strong></div>
      <div class="score"><span>GSC 28 天点击</span><strong>${search?.gsc?.clicks ?? "—"}</strong></div>
      <div class="score"><span>GSC CTR</span><strong>${search?.gsc ? `${escapeHtml(search.gsc.ctrPercent)}%` : "—"}</strong></div>
      <div class="score"><span>Bing 展示</span><strong>${search?.bing?.impressions ?? "—"}</strong></div>
      <div class="score"><span>可执行任务</span><strong>${active.length}</strong></div>
      <div class="score"><span>等待你的输入</span><strong>${waiting.length}</strong></div>
    </section>
    <section class="panel focus"><div class="number">01</div><div><div class="eyebrow">今天最重要</div><h2>${escapeHtml(todayPlan?.focus || mainTask?.title || "建立下一项高价值任务")}</h2><p>${escapeHtml(todayPlan?.aiTasks?.[0] || mainTask?.nextAction || mainTask?.successCriteria || "当前任务已清空，可进行周复盘。")}</p></div></section>
    <section class="panel strategy">
      <div class="eyebrow">Website Direction</div>
      <h2>${escapeHtml(direction.positioning || "网站方向待确定")}</h2>
      <p class="lead">${escapeHtml(direction.northStar || "")}</p>
      <div class="funnel">${funnelSteps}</div>
      <div class="strategy-grid">
        <article class="strategy-card"><h3>流量与页面分工</h3><ul>${strategyPoints}</ul></article>
        <article class="strategy-card"><h3>吸收 LuxoPack 的做法</h3><ul>${benchmarkPoints}</ul><div class="guardrail"><strong>边界：</strong><ul>${strategyGuardrails}</ul></div></article>
      </div>
    </section>
    <section class="panel">
      <div class="search-head"><div><div class="eyebrow">Search Reality Check</div><h2>搜索真实基线与机会页</h2></div><span class="confidence">${escapeHtml(search?.confidence?.label || "等待数据")}</span></div>
      ${search ? `<div class="diagnosis-grid">${diagnosisCards}</div><div class="data-note"><p><strong>甄别结论：</strong>${escapeHtml(search.confidence.summary)}</p><ul>${confidenceRules}</ul></div>` : '<div class="empty">尚未找到本地搜索分析文件。</div>'}
      <div class="table-wrap"><table><thead><tr><th>优先</th><th>页面</th><th>展示</th><th>点击</th><th>排名</th><th>判断与下一步</th></tr></thead><tbody>${opportunityRows}</tbody></table></div>
    </section>
    <section class="panel"><h2>今天需要你配合（最多 2 项）</h2><div class="user-actions">${userActions}</div></section>
    <section class="panel"><div class="week-intro"><div><div class="eyebrow">${escapeHtml(weekPlan.startDate)} — ${escapeHtml(weekPlan.endDate)}</div><h2>${escapeHtml(weekPlan.title)}</h2><p>${escapeHtml(weekPlan.objective)}</p></div><div class="outcomes">${outcomeTags}</div></div><div class="week-grid">${weekCards}</div></section>
    <section class="panel"><h2>可以立即推进</h2><div class="grid">${taskCards(topTasks, "当前没有可立即执行的任务")}</div></section>
    <section class="panel"><h2>等待登录、数据或真实证据</h2><div class="grid">${taskCards(waiting.slice(0, 6), "目前没有等待项")}</div></section>
    <section class="panel"><h2>最近实际完成</h2>${changeCards}</section>
    <div class="notice"><strong>刷新机制：</strong>每天 10:00 的自动任务会重新生成本文件；AI 每次完成并验证网站修改后也会自动刷新。浏览器中的“重新载入”只读取已生成的最新版本。此文件位于网站目录之外，不参与 Cloudflare 部署。</div>
  </main>
</body>
</html>`;
  write(LOCAL_DASHBOARD, html);
}

function recordChange(args, result) {
  if (!args.summary) throw new Error("record requires --summary \"实际完成的改动\"");
  let store;
  let task;
  if (args.task) {
    store = taskStore();
    task = (store.tasks || []).find((item) => item.id === args.task);
    if (!task) throw new Error(`Task ${args.task} was not found in data/seo-ops/tasks.json`);
  }
  const entry = {
    id: `chg-${Date.now()}`,
    date: shanghaiDate(),
    recordedAt: new Date().toISOString(),
    actor: args.actor || "AI",
    type: args.type || "site_update",
    target: args.target || "sitewide",
    summary: args.summary,
    reason: args.reason || "not_recorded",
    baseline: args.baseline || "unknown",
    verification: args.verification || "not_recorded",
    outcome: args.outcome || "pending_retest",
    nextReview: args["next-review"] || "unscheduled",
    taskId: args.task || null
  };
  append(join(OPS_DIR, "changes.jsonl"), `${JSON.stringify(entry)}\n`);

  if (task) {
    task.status = args.status || "done";
    task.updatedAt = entry.recordedAt;
    task.completedAt = task.status === "done" ? entry.recordedAt : task.completedAt;
    task.changeId = entry.id;
    store.updatedAt = entry.recordedAt;
    write(join(OPS_DIR, "tasks.json"), `${JSON.stringify(store, null, 2)}\n`);
  }
  saveDashboard(result);
  return entry;
}

function buildSitemap() {
  const pages = findIndexFiles().map(parsePage);
  const rules = redirectRules();
  const existing = sitemapEntries();
  const entries = pages
    .filter((page) => isIndexable(page, rules))
    .sort((a, b) => a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path))
    .map((page) => {
      const mtime = statSync(page.file).mtime.toISOString().slice(0, 10);
      const lastmod = [existing.get(page.path)?.lastmod || "", mtime].sort().at(-1) || mtime;
      return `  <url><loc>${escapeXml(`${SITE}${page.path}`)}</loc><lastmod>${lastmod}</lastmod></url>`;
    });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
  write(join(ROOT, "sitemap.xml"), xml);
  return entries.length;
}

const weeklyFocus = {
  0: ["周复盘", "复核本周完成项、GSC/Bing 7 天趋势和询盘来源，只保留下周最重要的 3 件事。"],
  1: ["机会词日", "导出 GSC 最近 28 天 position 8–20 且有曝光的查询，选 1 个页面做 title、直答块和 3 条内链升级。"],
  2: ["交易页日", "升级 1 个品类/成交页：补真实 MOQ、材质、工艺、样品、交期或包装信息；没有证据的数据不写。"],
  3: ["买家问题日", "把 1 个真实询盘问题写成页面问答或内容段落，并链接到对应成交页。"],
  4: ["技术与内链日", "修复审计最高优先级问题，并为 1 个重点页增加 3–5 条上下文内链。"],
  5: ["证据资产日", "整理 1 个可举证的数据点、样品记录、质检细节或匿名案例，加入证据台账并准备上站。"],
  6: ["分发日", "把本周最有价值的站内内容改写成 1 条 LinkedIn/行业社区内容，使用带 UTM 的具体落地页。"]
};

function dailyPlan(result) {
  const now = new Date();
  const date = shanghaiDate(now);
  const weekday = new Intl.DateTimeFormat("en", { timeZone: "Asia/Shanghai", weekday: "short" }).format(now);
  const weekdayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[weekday];
  const [focus, description] = weeklyFocus[weekdayIndex];
  const sprintDay = (weekPlanStore().days || []).find((day) => day.date === date);
  const dailyFocus = sprintDay?.focus || focus;
  const firstIssue = result.issues.find((item) => item.severity === "P0") || result.issues.find((item) => item.severity === "P1");
  const technicalTask = firstIssue
    ? `处理 \`${firstIssue.path}\` 的 ${firstIssue.code}：${firstIssue.detail}`
    : "保持 P0/P1 为 0；抽查 5 个重点 URL 的 200、canonical、表单和移动端显示。";
  const store = taskStore();
  const nextTask = (store.tasks || []).find((task) => task.status === "in_progress")
    || (store.tasks || []).find((task) => task.status === "next");
  const plannedTask = sprintDay?.aiTasks?.[0]
    || (nextTask ? `执行任务 \`${nextTask.id}\`：${nextTask.title}。${nextTask.nextAction || nextTask.successCriteria || ""}` : description);
  const aiRows = sprintDay?.aiTasks?.length
    ? sprintDay.aiTasks.map((item, index) => `${index + 1}. ${item}`).join("\n")
    : `1. ${technicalTask}\n2. ${plannedTask}`;
  const userRows = sprintDay?.userTasks?.length
    ? sprintDay.userTasks.map((item, index) => `${index + 1}. **${item.title}**：${item.detail}\n   - 交付：${item.deliverable}`).join("\n")
    : "1. 今天没有必须的人工输入。";
  const doneCriteria = sprintDay?.doneCriteria || "没有新增 P0/P1，并完成一个有真实买家价值的页面或数据动作。";
  const markdown = `# FY PromoGifts 今日 SEO 增长任务\n\n日期：${date}  \n今日主题：${dailyFocus}  \n本地 HTML 看板：\`D:\\Documents\\FY独立站增长总看板.html\`\n\n## 今日最重要的一件事\n\n${plannedTask}\n\n## AI 今天执行\n\n${aiRows}\n\n技术底线：${technicalTask}\n\n## 今天需要用户配合（最多 2 项）\n\n${userRows}\n\n## 今日完成标准\n\n${doneCriteria}\n\n## 当前基线\n\n| 指标 | 当前值 | 目标 |\n|---|---:|---:|\n| P0 技术问题 | ${result.summary.P0} | 0 |\n| P1 技术问题 | ${result.summary.P1} | 0 |\n| Sitemap 覆盖率 | ${result.summary.sitemapCoveragePercent}% | 100% |\n| 可索引正式页面 | ${result.summary.indexablePages} | 质量优先 |\n\n实际完成后使用 \`record\` 命令写入追加式日志；没有数据写 unknown，不得编造排名、流量或询盘。\n`;
  const dated = join(OPS_DIR, "daily", `${date}.md`);
  write(dated, markdown);
  write(join(OPS_DIR, "TODAY.md"), markdown);
  return dated;
}

const command = process.argv[2] || "audit";
if (command === "sitemap") {
  const count = buildSitemap();
  const result = audit();
  saveAudit(result);
  saveDashboard(result);
  console.log(JSON.stringify({ sitemapUrls: count, ...result.summary }, null, 2));
} else if (command === "daily") {
  const result = audit();
  saveAudit(result);
  const output = dailyPlan(result);
  append(join(OPS_DIR, "runs.jsonl"), `${JSON.stringify({ date: shanghaiDate(), generatedAt: result.summary.generatedAt, command: "daily", summary: result.summary })}\n`);
  saveDashboard(result);
  console.log(JSON.stringify({ output: relative(ROOT, output).split(sep).join("/"), ...result.summary }, null, 2));
} else if (command === "audit") {
  const result = audit();
  saveAudit(result);
  saveDashboard(result);
  console.log(JSON.stringify(result.summary, null, 2));
  if (result.summary.P0 > 0) process.exitCode = 1;
} else if (command === "record") {
  const result = audit();
  saveAudit(result);
  try {
    const entry = recordChange(cliArgs(process.argv.slice(3)), result);
    console.log(JSON.stringify(entry, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
} else {
  console.error("Usage: node scripts/seo-operations.mjs [audit|sitemap|daily|record]");
  process.exitCode = 2;
}
