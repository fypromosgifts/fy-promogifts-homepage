# FY PromoGifts 独立站增长总看板

最后刷新：2026-10-20T14:31:56.212Z
使用方式：每天只先看本页；AI 完成任何站点优化后必须写入改动日志。

## 当前健康度

| 指标 | 当前值 | 目标 |
|---|---:|---:|
| 可索引正式页面 | 139 | 持续增长但不造薄页 |
| Sitemap 覆盖率 | 100% | 100% |
| P0 / P1 / P2 | 0 / 0 / 0 | 0 / 0 / 持续评估 |
| 可执行任务 | 1 | 同时不超过 5 项 |
| 等待人工数据/登录 | 1 | 每周至少清理 1 项 |
| 已完成任务 | 10 | 留存证据，不删除历史 |

## 网站方向

**定位：**Custom Branded Gift Kits & Promotional Products  
**增长主线：**礼品套装负责品牌定位、高客单价方案展示和成交；核心单品负责 Google 搜索入口；每个单品都能单独询价，也能自然升级为套装，避免把网站做成纯套装站或杂乱的产品目录。

- 未来 4 周资源比例：核心单品 SEO 60%，套装/使用场景 25%，真实证据、技术与数据 15%。
- 首页与主导航先讲套装解决方案；产品目录保留单品入口，并只优先强化有采购意图的核心品类。
- 第一套装支柱为 Custom Mug Gift Sets；后续只保留 Employee Onboarding、Client Appreciation、Event & Campaign、Wedding & Party 等有独立场景意图的入口。
- 第一批单品页为 Custom Mugs、Ceramic Mugs、Heated Mugs、Tumblers、Notebooks、Towels、Gift Boxes & Packaging。
- 不再为近义词批量建薄页；重叠页进入保留、合并、301、noindex 四类清单后再处理。

**成交路径：**Google 搜索单品 → 进入可采购单品页 → 查看搭配套装与包装 → 提交报价或 WhatsApp

### LuxoPack 可吸收原则

- 视觉优先：用真实产品、包装、细节与场景图替代连续大段文字，让买家先看懂再阅读。
- 采购信息前置：在卡片和首屏直接展示真实 MOQ、打样、交期、材质、Logo 与包装选项；未知项明确标 unknown。
- 页面按产品类型和买家用途双向组织，但每页必须有独立意图、实物内容和清晰入口。
- 建立可核验的信任层：工艺、打样、质检、包装、生产过程、证书边界和真实案例各自有证据。
- 询盘路径具体化：表单收集数量、交期、Logo、目的地和产品方向，并明确提交后下一步。
- 用案例讲问题、方案、结果；无法核验的品牌名、节省比例、工厂数据和证书不使用。

边界：学习结构和采购思维，不复制其文字、设计或定位；FY 不是单一包装工厂，不虚构工厂规模、认证、交期、价格优惠或案例结果；避免为了页面数量制造重复行业页、近义词页和超长产品堆叠；所有商业数字和承诺必须可追溯；客户实拍采用最小必要范围的适度像素马赛克：保留定制颜色、位置和大致轮廓，但名称、字母细节、人物面部和独特 Logo 细节不得可靠识别；原图不得进入公开站点资产。

## 下一步任务

| 优先级 | 任务 | 负责人 | 下一动作 / 完成标准 |
|---|---|---|---|
| P1 | 核验 GSC/Bing 站点验证、Sitemap 与提交状态 | 用户 + AI | 2026-10-05 已验证线上 sitemap.xml 为 137 个 URL，5 个已更新页面均返回 HTTP 200 且自指 canonical；IndexNow 已接收 5 个 URL（HTTP 200）。GSC/Bing 当前 sitemap 最后读取日期仍需在平台界面确认；Chrome 只读页面响应超时，未将其误记为成功。 |

## 等待输入

| 优先级 | 任务 | 负责人 | 需要什么 |
|---|---|---|---|
| P1 | 核验询盘转化事件与表单送达 | 用户 + AI | DebugView/实时事件及测试询盘送达记录 |

## 最近改动

| 日期 | 类型 | 页面/对象 | 做了什么 | 验证 |
|---|---|---|---|---|
| 2026-10-20 | indexing_submission | sitewide | IndexNow accepted the published custom apparel category URL (HTTP 200); crawl notification only, not Google indexing confirmation. | not_recorded |
| 2026-10-20 | indexing_submission | sitewide | IndexNow received the updated custom promotional bags page after the October 20 title and copy refinement. | not_recorded |
| 2026-10-20 | indexing_submission | sitewide | IndexNow received the updated homepage after the October 20 search-summary refinement. | not_recorded |
| 2026-10-20 | indexing_submission | sitewide | IndexNow received the updated promotional products hub after the October 20 metadata and buyer-answer release. | not_recorded |
| 2026-10-20 | indexing_submission | sitewide | IndexNow received the updated custom packaging page after the October 20 SEO and answer-content release. | not_recorded |
| 2026-10-20 | indexing_submission | sitewide | IndexNow received the updated homepage and catalog URLs after the October 20 internal-link release. | not_recorded |
| 2026-10-05 | indexing_submission | / + /kit-studio/ + /trade-show-giveaway-kits/ + /brand-campaign-giveaways/ + /promotional-products-supplier-for-marketing-agencies/ | Verified the five Search Console opportunity-page updates live, then submitted only those five changed canonical URLs to IndexNow. | Local release validation passed with 164 pages, 137 canonical URLs, 0 missing assets and 0 unresolved internal links. Each target returned HTTP 200 with its self-canonical URL; public sitemap.xml returned HTTP 200 with 137 URLs; IndexNow returned HTTP 200 at 2026-10-05T12:53:28.8712930Z. |
| 2026-09-30 | security_and_content | /api/inquiry + /promotional-products/drinkware/ | Secured all inquiry forms and published a three-article Reddit-informed Drinkware content cluster. | 109/109 forms use the protected endpoint; 161-page audit has P0/P1/P2=0; four priority URLs return 200 with valid canonical and JSON-LD; IndexNow accepted eight URLs; Google confirms the Drinkware page is indexed. |

## 固定入口

- 今日任务：`data/seo-ops/TODAY.md`
- 90 天路线图：`data/seo-ops/ROADMAP.md`
- 任务真相源：`data/seo-ops/tasks.json`
- 追加式改动日志：`data/seo-ops/changes.jsonl`
- 内容管线：`data/seo-ops/content-pipeline.csv`
- 搜索与询盘 KPI：`data/seo-ops/kpi-log.csv`
- 真实证据台账：`data/seo-ops/evidence-ledger.csv`
- 最新技术审计：`data/seo-ops/latest-audit.md`

## AI 记录规则

完成修改后运行：

`node scripts/seo-operations.mjs record --type page_update --target /目标路径/ --summary "实际做了什么" --reason "为什么做" --verification "如何验证" --task TASK-ID --next-review YYYY-MM-DD`

不允许把“计划做”记成“已完成”；没有数据时写 `unknown`，不得编造排名、流量或询盘。
