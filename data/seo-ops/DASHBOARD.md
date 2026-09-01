# FY PromoGifts 独立站增长总看板

最后刷新：2026-09-01T04:52:13.289Z
使用方式：每天只先看本页；AI 完成任何站点优化后必须写入改动日志。

## 当前健康度

| 指标 | 当前值 | 目标 |
|---|---:|---:|
| 可索引正式页面 | 123 | 持续增长但不造薄页 |
| Sitemap 覆盖率 | 100% | 100% |
| P0 / P1 / P2 | 0 / 0 / 0 | 0 / 0 / 持续评估 |
| 可执行任务 | 2 | 同时不超过 5 项 |
| 等待人工数据/登录 | 1 | 每周至少清理 1 项 |
| 已完成任务 | 9 | 留存证据，不删除历史 |

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
| P1 | 核验 GSC/Bing 站点验证、Sitemap 与提交状态 | 用户 + AI | 2026-08-29 公开 sitemap.xml 已验证为 122 个 URL，本轮 6 个更新 URL 已被 IndexNow 接收（HTTP 200）。当前浏览器未登录 GSC/Bing；需用户登录后确认两个平台的 sitemap 最后读取日期，并在 GSC 对优先 URL 执行 URL Inspection。 |
| P1 | 建立 7 个核心单品获客页的统一成交模板 | AI + 用户事实核验 | Mugs、Tumblers、Notebooks 已补齐页内 Formspree 询盘、来源归因和 4–5 个相关站内入口；下一步补齐独立 Heated Mug 与 Towel 的真实 SKU、规格、MOQ、工艺、样品/交期和包装证据，再决定是否建立独立可索引页。 |

## 等待输入

| 优先级 | 任务 | 负责人 | 需要什么 |
|---|---|---|---|
| P1 | 核验询盘转化事件与表单送达 | 用户 + AI | DebugView/实时事件及测试询盘送达记录 |

## 最近改动

| 日期 | 类型 | 页面/对象 | 做了什么 | 验证 |
|---|---|---|---|---|
| 2026-09-01 | product_visual_deployment | /popular-promotional-products/ + homepage + catalog | Published 10 original logo-free promotional product concept visuals and a dedicated inquiry landing page | Commit 454aba4 pushed to main; production page HTTP 200; 10 cards; hero image 1200px; Formspree endpoint correct; desktop and 390px mobile QA passed; SEO audit P0/P1/P2 all zero |
| 2026-09-01 | product_image_research | data/seo-ops/promo-product-image-shortlist-2026-09-01.html | 完成 10 个非 IP 具体促销礼品款式的图片选款板 | 10 张图片全部通过可访问性检查；3 张使用 FY 本地素材，7 张外部参考图返回 HTTP 200；逐款标注筛选参数与图片使用边界 |
| 2026-09-01 | market_research | data/seo-ops/google-promo-demand-top10-2026-09-01.md | 完成 Google 可检索权威来源的非 IP 促销礼品 Top 10 与 FY 上架优先级研究 | 交叉核对 ASI 2026 国际偏好、PPAI 2024-2026 销量/留存研究和 Custom Ink 300+ 员工套装调查；所有推荐排除授权 IP |
| 2026-09-01 | deployment | main / Cloudflare Pages | 发布核心品类转化升级并完成线上逐页复核与 IndexNow 提交 | commit 3c91b19 已推送；8 个变更 URL 均 HTTP 200 且发布标记匹配；生产 sitemap 122；IndexNow 8 URL HTTP 200 |
| 2026-08-31 | conversion_upgrade | /catalog/drinkware/mugs/ + /catalog/drinkware/tumblers/ + /catalog/stationery-office/ | 为 Mugs、Tumblers、Stationery 三个核心品类页补齐直接询盘表单、来源归因与相关上下文内链 | 本地 validator 0 errors；审计 P0/P1/P2=0/0/0；桌面 1440x900 与手机 390x844 无溢出和破图；归因字段正确 |
| 2026-08-29 | indexing_submission | IndexNow + GSC/Bing verification | Submitted six updated commercial URLs to IndexNow and verified the live 122-URL sitemap; documented the remaining authenticated console check without claiming GSC or Bing platform success. | IndexNow API returned HTTP 200 at Sat, 29 Aug 2026 12:56:36 GMT; live sitemap returns 200 with 122 URLs; GSC/Bing authenticated sitemap read remains unverified. |
| 2026-08-29 | deployment | main / production | Published the complete release from a clean worktree and restored the corporate gift-kit and three verified mug gift-set routes that had been overwritten by an incomplete production deploy. | GitHub main advanced to 05acb83; homepage, sitemap, corporate gift kits, packaging pillar, mugs, tumblers, notebooks and MU024/MU023/DR004 returned HTTP 200; all expected page markers were present; sitemap contains 122 URLs. |
| 2026-08-29 | form_and_contact_fix | sitewide forms and public contact footers | Moved the final two legacy inquiry forms to Formspree, added source attribution to the single-product form, and standardized 13 public footer email references to info@fypromogifts.com. | 96 forms checked; 96 use the expected Formspree endpoint; legacy Worker references 0; obsolete email references 0; attribution script syntax passes and local forms contain source_page and requested_product_type. |

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
