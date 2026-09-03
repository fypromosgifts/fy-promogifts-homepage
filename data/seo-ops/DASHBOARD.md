# FY PromoGifts 独立站增长总看板

最后刷新：2026-09-03T14:20:40.441Z
使用方式：每天只先看本页；AI 完成任何站点优化后必须写入改动日志。

## 当前健康度

| 指标 | 当前值 | 目标 |
|---|---:|---:|
| 可索引正式页面 | 122 | 持续增长但不造薄页 |
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
| P1 | 核验 GSC/Bing 站点验证、Sitemap 与提交状态 | 用户 + AI | 2026-08-29 公开 sitemap.xml 已验证为 122 个 URL，本轮 6 个更新 URL 已被 IndexNow 接收（HTTP 200）。当前浏览器未登录 GSC/Bing；需用户登录后确认两个平台的 sitemap 最后读取日期，并在 GSC 对优先 URL 执行 URL Inspection。 |

## 等待输入

| 优先级 | 任务 | 负责人 | 需要什么 |
|---|---|---|---|
| P1 | 核验询盘转化事件与表单送达 | 用户 + AI | DebugView/实时事件及测试询盘送达记录 |

## 最近改动

| 日期 | 类型 | 页面/对象 | 做了什么 | 验证 |
|---|---|---|---|---|
| 2026-09-03 | homepage_conversion_consolidation | /#popular-products | 将原独立 Top 10 薄页整合进首页，发布 7 个无 Logo 概念款和 3 个已核实 SKU，并保留询盘预填与产品详情入口。 | commit a038386；发布校验 151 页、122 个唯一 canonical、0 缺图、0 断链、0 错误；浏览器桌面 5 栏/手机 2 栏、10/7/3 计数正确、询盘预填成功；线上首页及 10 图均 200，旧页 301 到首页锚点且已移出 sitemap；IndexNow 200。 |
| 2026-09-03 | conversion_cluster_upgrade | Mugs + Gift Sets + MU024/MU023/DR004 + Packaging | 按三天量完成核心单品成交集群：杯具页增加加热杯/毛巾套装真实SKU决策区，Gift Sets新增独立防刷询盘，包装页新增三条已验证产品路由和包装专用询盘，并闭合6个页面的上下文内链 | commit ae7ae38已推送main；151页发布校验通过、123个唯一可索引canonical、0缺失资源、0断链；102个/api/inquiry表单与102处防刷脚本覆盖、旧Formspree直连0；Inquiry Function测试与Worker编译通过；桌面/手机横向溢出0；6个目标线上URL均HTTP 200且新标记匹配；无来源POST被403拒绝；IndexNow 6 URL返回HTTP 200 |
| 2026-09-03 | form_security | sitewide | 全站100个询盘表单迁移到Cloudflare Pages防刷入口，启用Turnstile、蜜罐和填写时长校验，并停用旧Formspree表单 | 函数单测通过；151页发布校验0错误；100/100表单覆盖；线上GET返回405且无验证码POST返回400；旧表单关闭后刷新仍为Disabled |
| 2026-09-02 | incident_review | sitewide | 复核垃圾询盘与Formspree超额：确认100个HTML页面公开同一表单端点，现有_gotcha只能拦截简单机器人，旧端点一旦被记录可绕过网页直接POST | 代码扫描确认100个HTML文件含同一Formspree端点；仓库当前无Pages Functions、Turnstile服务端验证或独立限速层；无证据支持Formspree主动制造垃圾提交 |
| 2026-09-02 | page_update | /popular-promotional-products/ | 重做热门促销产品页排版：桌面四列、手机两列，首屏改为三图组合；修复图片高度属性导致卡片被拉到1200px及询价区WhatsApp按钮文字不可见 | 本地浏览器1440x1000与390x844验收；桌面卡片618.8px高/图片286px，手机卡片308.7px高/图片168.5px；横向溢出为0；产品选择可预填并定位询价表单；SEO审计P0/P1/P2均为0 |
| 2026-09-01 | post_deployment_qa_fix | /popular-promotional-products/ | Re-audited all 10 logo-free visuals and removed the mobile floating CTA overlap | All 10 source images visually inspected with no logo or watermark; all 10 live WebP URLs return HTTP 200; production at 390x844 has 10 cards, zero floating widgets, zero horizontal overflow, local quote link and correct Formspree action; SEO and release audits report zero errors |
| 2026-09-01 | product_visual_deployment | /popular-promotional-products/ + homepage + catalog | Published 10 original logo-free promotional product concept visuals and a dedicated inquiry landing page | Commit 454aba4 pushed to main; production page HTTP 200; 10 cards; hero image 1200px; Formspree endpoint correct; desktop and 390px mobile QA passed; SEO audit P0/P1/P2 all zero |
| 2026-09-01 | product_image_research | data/seo-ops/promo-product-image-shortlist-2026-09-01.html | 完成 10 个非 IP 具体促销礼品款式的图片选款板 | 10 张图片全部通过可访问性检查；3 张使用 FY 本地素材，7 张外部参考图返回 HTTP 200；逐款标注筛选参数与图片使用边界 |

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
