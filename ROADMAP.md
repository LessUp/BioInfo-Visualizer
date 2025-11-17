# Bioinfo Visualizer Roadmap

> 本文档基于当前代码与 README 现状，为 Bioinfo Visualizer 仓库补充一份中长期规划，方便后续按阶段推进与对外说明。

---

## 0. 背景与总体目标

Bioinfo Visualizer 是一个面向生物信息学教学与演示的可视化项目集合，包含多种前端应用与讲稿：

- Picard 分析流程可视化（`apps/picard-workflow-spa`）
- 基因分析全流程示例（`apps/bioinfo-pipeline-web`）
- BWA 算法教学可视化（`apps/bwa-algorithm-viz`）
- GATK/Cromwell 运行监控仪表板（`apps/gatk-run-dashboard`）
- 基因比对动态可视化（`apps/genome-align-viz`）
- 算术编码演示（`apps/arith-compress-viz`）
- NGS vs TGS 讲稿（`slides/ngs-vs-tgs`）

当前这些子项目**都已可运行并具备核心功能**，但在以下方面仍有较大提升空间：

- 质量保障：测试、Lint、CI 流程统一。
- 教学体验：跨项目的导航、学习路径、示例数据、讲稿联动。
- 实战体验：接真实后端 / 流式数据、更多算法细节、性能与可观测性优化。
- 文档与发布：统一文档站、版本管理、打包与部署流程优化。

本 Roadmap 将这些工作拆成若干阶段和模块任务，建议按 **「先基础设施 → 再教学体验 → 再真实数据 → 持续测试与文档」** 的顺序推进。

---

## 1. 阶段划分总览

### 阶段 1：基础设施与质量保障（建议优先，1–2 周）

- 统一 Node 版本与开发脚本。
- 在根目录增加统一的 lint/test 脚本。
- 完善 CI 流程（区分质量检查和 GitHub Pages 发布）。
- 强化根入口页，作为所有子应用的导航中枢。

### 阶段 2：教学体验强化（2–4 周，可穿插进行）

- 将 `bioinfo-pipeline-web` 的学习路径与所有可视化应用/Slides 串联起来。
- 加强 BWA / Picard / Arithmetic 等算法演示的交互与教学细节。
- 让 NGS vs TGS 讲稿与对应 Demo 一键联动。

### 阶段 3：真实数据与后端集成（按需推进，2–4 周）

- `genome-align-viz` 接入真实后端流式数据（WebSocket/SSE/轮询）。
- `gatk-run-dashboard` 强化 Cromwell/Nextflow/Snakemake 解析与性能。
- `bioinfo-pipeline-web` 从 Mock API 过渡到可配置的数据源适配层。

### 阶段 4：测试覆盖与长线维护（持续进行）

- 为核心算法与数据适配逻辑补单元测试。
- 为关键用户路径增加 E2E 测试。
- 完善教师/学习者文档与版本记录。

---

## 2. 按模块的详细任务清单

### 2.1 仓库整体（根目录）

**定位：** 提供统一脚本、统一入口和统一 CI/发布流程。

#### 2.1.1 开发与脚本统一

- [ ] 在 README 中明确：
  - 推荐 Node 版本（例如 `>= 18`，可选 `.nvmrc` 或文档说明）。
  - 推荐包管理器（npm/yarn/pnpm 中选择其一，或说明仅保证 npm）。
- [ ] 在根 `package.json` 中增加：
  - `"lint:all"`：调用各 workspace 的 Lint（例如 `npm run -w gatk-run-dashboard test` / `lint` 等组合）。
  - `"test:all"`：聚合 Vite/Vitest 和其它测试脚本。
  - 如有需要，增加 `"ci"`：`format:check` + `lint:all` + `test:all` 的组合。

#### 2.1.2 CI / 工作流

- [ ] 新增 CI Workflow（例如 `.github/workflows/ci.yml`）：
  - 触发：PR、push 到主分支。
  - 步骤：安装依赖 → `npm run format:check` → `npm run lint:all` → `npm run test:all`。
- [ ] 保持现有 `pages.yml` 专注于 GitHub Pages 发布：
  - 两者职责分离：CI 负责质量；Pages 负责打包与发布静态产物。

#### 2.1.3 根入口与导航

- [ ] 优化 `pages/index.html`：
  - 为每个 app 显示：名称、简介、标签（算法 / 流程 / 仪表板 / Slides / 工具）。
  - 链接到 `apps/bioinfo-pipeline-web` 中的学习路径页。
- [ ] 如有需要，在根 README 中补充「整体导览」：
  - 面向不同角色（学生 / 教师 / 工程师）的推荐访问路径。

---

### 2.2 picard-workflow-spa（Picard 流程可视化）

**定位：** 零依赖、可直接打开的单页，用于配置 Picard/GATK 流程并导出脚本。

#### 2.2.1 可用性与交互增强

- [ ] 导出脚本模板扩展：
  - 按平台/场景提供几类模板（HPC 集群 / 本地 / 云环境）。
  - 在 UI 中提供模板选择，并在导出时自动插入相应的头部/资源请求命令。
- [ ] 参数校验反馈优化：
  - 在导出按钮附近集中显示缺失参数列表。
  - 未填写的必填占位符在右侧面板高亮提示。

#### 2.2.2 教学向内容补充

- [ ] 在步骤详情中增加：
  - 调用顺序依赖说明（例如 MarkDuplicates 前后的注意事项）。
  - 常见错误示例（index 不匹配、内存不足等）及排查建议。
- [ ] 提供一份示例配置（除 `examples/picard-config.json` 外，可以增加一个「教学示例」配置）。

#### 2.2.3 测试与保障

- [ ] 针对关键交互添加简单 E2E 测试：
  - 切换 WGS/WES/RNA 流程。
  - 配置参数 → 导出脚本（校验脚本格式与参数替换结果）。

---

### 2.3 bwa-algorithm-viz（BWA 算法可视化）

**定位：** 通过可视化展示 BWA 系列算法关键步骤（FM-index、SMEM、Chaining、SW+Z-drop、MAPQ 等）。

README 已列出若干改进方向，可视作第一批待办：

#### 2.3.1 算法可视化深化

- [ ] Chaining 评分展示细化：
  - 对每条链的得分进行分项拆解：窗口、对角松弛、重叠惩罚、gap 开销等。
  - 增加「评分分解」视图，帮助理解 BWA 的打分机制。
- [ ] SMEM 动画与 RC 标识细化：
  - 更直观地区分正向种子与反向互补（RC）种子。
  - 展示再播种（Reseed）策略对种子划分的影响。
- [ ] MAPQ 示意扩展：
  - 提供多条曲线/柱状图对比不同参数设置下的 MAPQ 分布。

#### 2.3.2 性能与大数据演示

- [ ] 对大规模序列引入：
  - 虚拟滚动或抽样展示，避免一次性渲染过多元素导致卡顿。
  - 提供「数据量预设」：小样本/中等/大样本三档，演示性能与可视化差异。

#### 2.3.3 教学脚本与文档

- [ ] 编写一份 BWA 教学脚本（可以放在 `docs/` 或根 `docs/` 中）：
  - 每个可视化页面的解说重点。
  - 推荐输入例子与配套讲稿页面。

---

### 2.4 arith-compress-viz（算术编码可视化）

**定位：** 用交互式静态页面展示算术编码的区间缩放与编码/解码过程。

#### 2.4.1 交互与参数配置

- [ ] 支持自定义输入：
  - 用户输入文本或符号序列，自动统计频率并生成概率分布。
- [ ] 支持自定义概率分布：
  - 用户可直接编辑每个符号的概率，以匹配教学或特定教材中的例子。

#### 2.4.2 错误案例与边界场景

- [ ] 增加「错误示例模式」：
  - 展示在精度不足或区间收缩过度时可能出现的解码失败情形。
  - 用可视化方式展示错误码值落在错误区间的情况。

#### 2.4.3 教学模式

- [ ] 添加「讲稿模式」或步骤引导：
  - 分步展示关键概念和操作，引导学生逐步完成一次编码/解码。
  - 可以在界面上提示教师每一步要强调的内容。

---

### 2.5 genome-align-viz（基因比对动态可视化）

**定位：** 以时间线、对齐画布、覆盖度轨、变异面板与日志面板展示一个基因比对流水线的动态过程。

#### 2.5.1 后端数据接入（重要）

- [ ] 抽象 `src/streams/` 为可配置的数据源：
  - 支持 WebSocket / SSE / HTTP 轮询三种模式。
  - 通过环境变量或 UI 配置后端地址和鉴权信息。
- [ ] 增加断线重连与错误提示：
  - 网络错误、解析错误时在 UI 中友好展示状态。

#### 2.5.2 教学与视图联动

- [ ] TeachingPanel 加强：
  - 针对每个阶段（`qc → index → align → sort → dedup → variant → annotate`）显示讲解要点。
  - 提供跳转链接到相关 Slides 或文档（例如 NGS vs TGS 讲稿中的对应章节）。

#### 2.5.3 性能与测试

- [ ] 覆盖度轨道 Web Worker：
  - 为聚合逻辑（分箱、边界条件）添加单元测试。
- [ ] 对齐画布性能：
  - 控制最大绘制 read 数量（当前约 800，可根据体验进行调优）。

---

### 2.6 gatk-run-dashboard（GATK Workflow Dashboard）

**定位：** 基于 React Flow + ECharts + Zustand 的工作流可视化与运行监控面板，支持 Cromwell、Nextflow、Snakemake 数据源。

#### 2.6.1 引擎适配与数据模型

- [ ] 持续完善 `Run/Step/Edge` 模型与 `normalizeCromwell` 等适配器：
  - 覆盖更多 Cromwell 字段，例如 `runtimeAttributes`、`scatterIndex`、`attempt` 等边界情况。
  - 确保对 Nextflow trace.tsv 和 Snakemake JSON 的解析足够健壮。
- [ ] 如有新的执行引擎（WDL/CWL 运行时），可以新增 adapter：
  - 将其元数据映射到统一的 `Run/Step/Edge` 模型。

#### 2.6.2 大规模运行的性能优化

- [ ] 针对节点数/边数较大的 DAG：
  - 引入分层加载或按分组折叠策略，提高初始渲染速度。
- [ ] 时间轴性能优化：
  - 调整窗口化参数，确保在几千个 step 时仍可顺畅缩放与拖动。

#### 2.6.3 可观测性与交互增强

- [ ] 过滤条件扩展：
  - 按状态、标签、机器节点、错误类型等维度进行组合筛选。
- [ ] 运行对比视图：
  - 支持选择两个 run 并对比其整体耗时、关键步骤耗时分布。

#### 2.6.4 自动化测试

- [ ] 利用现有 Vitest 配置，补充：
  - 对 adapter（Cromwell/Nextflow/Snakemake）进行单元测试。
  - 对 store 中的核心状态迁移逻辑进行测试。

---

### 2.7 bioinfo-pipeline-web（Next.js 全流程示例）

**定位：** 生物信息“基因分析全流程”的前端示例，包含各阶段模块与可视化图表，以及学习路径规划组件。

#### 2.7.1 Mock → 可配置数据源

- [ ] 完善 `src/types/pipeline.ts` 中的 `Pipeline` 类型：
  - 明确运行状态、错误字段、版本号等字段。
- [ ] 抽象数据适配层（例如 `lib/data-source`）：
  - Mock API（现有 `/api/pipelines/[id]`）。
  - 实际后端 REST/GraphQL。
  - 本地 JSON 示例文件。
- [ ] 提供配置方式（环境变量或 UI）选择数据来源。

#### 2.7.2 学习路径与其它模块联动

- [ ] 扩展 `LearningPathPlanner`：
  - 确保每个 step 具有对应的 `target` 链接，可以打开：
    - Picard SPA / BWA 可视化 / GATK Dashboard / genome-align-viz / Slides 等。
  - 将这些 `learningPaths` 与根入口页的导航保持一致。

#### 2.7.3 产品化与可视化增强

- [ ] 多样本对比：
  - 支持在同一视图中对比多个 pipeline 的指标（如 GC 含量、Ti/Tv、覆盖度）。
- [ ] 报告导出：
  - 集成图表截图与文本说明，生成 PDF/HTML 报告。

#### 2.7.4 工程质量

- [ ] 利用现有 `lint` / `typecheck` / `ci` 脚本：
  - 补充组件级单元测试（特别是图表组件与阶段卡片）。
  - 增加 E2E 测试：
    - 从首页 → 进入某 pipeline → 浏览完整流程。

---

### 2.8 slides/ngs-vs-tgs（讲稿）

**定位：** 一套支持自动播放、批注、激光笔、计时器和讲稿视图的 NGS vs TGS 讲稿。

#### 2.8.1 内容与应用联动

- [ ] 在对应 slide 页面加入按钮或链接：
  - 一键打开相关 Demo：例如 BWA 可视化、genome-align-viz 或 GATK Dashboard。
- [ ] 在 `.notes` 区域中补充讲稿要点：
  - 面向教师：每页要点与建议讲解顺序。
  - 面向学生：可在 presenter 模式下查看的简要提纲。

#### 2.8.2 版本与配套文档

- [ ] 为 slides 增加版本号（可在首页或某个 info 页面中展示）。
- [ ] 在根 `docs/` 中补充一份「课程配套说明」：
  - Slides 与各 app 的对应关系。
  - 一次完整教学中的推荐使用顺序。

---

## 3. 阶段执行建议与优先级

### 3.1 推荐整体顺序

1. **先做：阶段 1（基础设施与质量保障）**
   - 统一脚本、CI 与入口导航。
   - 直接提升项目的可维护性和协作体验。
2. **接着：阶段 2（教学体验强化）**
   - 将现有所有应用串联为一条或多条完整学习路径。
   - 非常适合作为对外示范或课堂实验的“第一印象”。
3. **然后：阶段 3（真实数据与后端集成）**
   - 结合实际需求选择合适的后端接入深度。
   - 成本较高，但能显著提升“实战感”。
4. **最后：阶段 4（测试覆盖与长线维护）持续进行**
   - 建议采用“新功能附带测试/文档”的策略逐步补齐。

### 3.2 不同使用场景下的重点选择

- 若近期重点在 **教学演示/课程**：
  - 优先：阶段 1 + 阶段 2 + slides 联动（2.8 部分）。
- 若重点在 **工程原型/产品展示**：
  - 优先：阶段 1 + 阶段 3 + 阶段 4 中与可用性强相关的测试与文档。

---

## 4. 附录：按模块索引（速查）

- **仓库整体**
  - 根目录 `README.md`、`package.json`、`pages/index.html`、`.github/workflows/*`。
- **Picard 流程可视化**
  - `apps/picard-workflow-spa/`。
- **基因分析全流程示例（Next.js）**
  - `apps/bioinfo-pipeline-web/`。
- **BWA 算法可视化**
  - `apps/bwa-algorithm-viz/`。
- **GATK 运行仪表板**
  - `apps/gatk-run-dashboard/`。
- **基因比对动态可视化**
  - `apps/genome-align-viz/`。
- **算术编码演示**
  - `apps/arith-compress-viz/`。
- **NGS vs TGS 讲稿**
  - `slides/ngs-vs-tgs/`。

本 Roadmap 可以根据后续实际项目进展和外部需求随时调整，建议在每个阶段结束时回顾一次，并更新对应子目录下的 README 或 docs。
