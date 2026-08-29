# FY PromoGifts 独立站增长总看板

最后刷新：2026-08-29T12:50:53.821Z  
使用方式：每天只先看本页；AI 完成任何站点优化后必须写入改动日志。

## 当前健康度

| 指标 | 当前值 | 目标 |
|---|---:|---:|
| 可索引正式页面 | 122 | 持续增长但不造薄页 |
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
| P1 | 核验 GSC/Bing 站点验证、Sitemap 与提交状态 | 用户 + AI | Bing/参与搜索引擎已通过 IndexNow 接收本轮3个更新URL（HTTP 200）；GSC已登录到 sc-domain:fypromogifts.com，但自动读取界面持续超时，需在已保留的GSC页面手动检查sitemap并对优先URL执行URL Inspection。 |
| P1 | 建立 7 个核心单品获客页的统一成交模板 | AI + 用户事实核验 | 先完成页面优先级、现状差距和模板字段，再从 Custom Mugs 与 Custom Ceramic Mugs 开始逐页升级。 |

## 等待输入

| 优先级 | 任务 | 负责人 | 需要什么 |
|---|---|---|---|
| P1 | 核验询盘转化事件与表单送达 | 用户 + AI | DebugView/实时事件及测试询盘送达记录 |

## 最近改动

| 日期 | 类型 | 页面/对象 | 做了什么 | 验证 |
|---|---|---|---|---|
| 2026-08-29 | form_and_contact_fix | sitewide forms and public contact footers | Moved the final two legacy inquiry forms to Formspree, added source attribution to the single-product form, and standardized 13 public footer email references to info@fypromogifts.com. | 96 forms checked; 96 use the expected Formspree endpoint; legacy Worker references 0; obsolete email references 0; attribution script syntax passes and local forms contain source_page and requested_product_type. |
| 2026-08-29 | core_product_upgrade | /catalog/drinkware/mugs/, /catalog/drinkware/tumblers/, /catalog/stationery-office/ | Defined the seven-core-product canonical map, strengthened the mug page, fixed three tumbler product classifications, and upgraded tumbler and notebook category pages into buyer-ready acquisition pages. | Tumblers now resolves 3 real products; Stationery resolves 5 products; both pages have index/follow, buyer guidance and FAQ schema; release audit is 150 pages, 122 indexable, sitemap 122/122, P0/P1/P2 0/0/0. |
| 2026-08-29 | architecture_closeout | sitewide | Closed the 150-page architecture decision audit with explicit page roles and keep, merge, redirect or noindex outcomes. | 150 release pages; 122 indexable canonicals; sitemap coverage 100%; P0/P1/P2 0/0/0; architecture table has zero missing roles, decisions or ambiguous merge rows. |
| 2026-08-28 | conversion_standard | homepage + product pages + kit pages + inquiry flow | 固化 FY 页面与询盘六项验收清单：视觉、采购信息、证据、案例、报价路径、提交后下一步，并写明隐私与事实边界。 | 清单覆盖六项成功标准、Formspree 与联系信息、source_page/requested_product_type、桌面/手机断点、发布校验及 14/28 天复查规则。 |
| 2026-08-28 | conversion_tracking | /catalog/gift-sets/ + sitewide inquiry forms | 完成 Custom Mug Gift Sets 支柱验收，并为全站 Formspree 表单与关键 CTA 统一补充 source_page、requested_product_type 记录；更新 118 个页面的追踪脚本缓存版本。 | 真实浏览器桌面 1440x900 与手机 390x844 验收无横向溢出；MU024 商品页隐藏字段正确；首页产品字段动态同步；Gift Set 42 款专项校验通过；全站 149 页发布校验 0 错误；Sitemap 119/119；P0/P1/P2=0/0/0。14 天复查询盘归因与 GSC 页面信号，28 天复查套装到单品路径表现。 |
| 2026-08-25 | deployment | /catalog/gift-sets/, MU024, MU023, DR004, /kit-studio/, /trade-show-giveaways/ | Gift set evidence, verified lead times and site-path simplification deployed and verified live | GitHub main commit 8516940; live pages returned 200; three anonymized proof images loaded; MOQ 100/40/60 retained; 3–5 day samples, 5–7 day production and 500-piece custom-box threshold present; legacy trade-show URL returns 301 to /trade-show-giveaway-kits/; release validation errors 0 |
| 2026-08-25 | thin_page_upgrade | /kit-studio/ | 补强Kit Studio静态可抓取说明、三类使用场景图片和四步报价流程，保留现有交互工具与Formspree询盘。 | 全站审计P0=0、P1=0、P2=0；Formspree端点和内部链接有效 |
| 2026-08-25 | conversion_seo | /catalog/gift-sets/ + 3 top sellers | 升级Gift Sets主页面及MU024、MU023、DR004：加入三张轻度马赛克实拍、真实MOQ、3-5天打样、5-7天量产、固定礼盒与500件起包装图案定制。 | 42款礼品套装校验通过；JSON-LD有效；0缺图；客户识别信息未写入页面 |

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
