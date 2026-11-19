# 上游 Issue 分诊与归档就绪记录 — 2026-11-19

本文件记录仓库归档前对 [`radix-ui/themes`](https://github.com/radix-ui/themes) 公开 issue 栏的全量分诊结果，以及基于当前源码的实际修复情况。

## 分诊方法

1. 通过 GitHub API 拉取上游仓库全部 **100 个 open issue**（含 bug、request、documentation、info-needed 及无标签项）。
2. 按编号分 5 组并行分诊，逐条读取 issue 正文并对照当前 `packages/radix-ui-themes/src/` 源码、`CHANGELOG.md` 以及已安装的 `radix-ui` / `@radix-ui/*` 依赖实现。
3. 分诊结论分为：`ALREADY_FIXED`（本 fork 或上游依赖已解决）、`UPSTREAM_PRIMITIVE`（根因在依赖中，无法在本仓库修复）、`NOT_A_BUG`（功能请求、文档站问题、用户使用方式或环境问题）、`ACTIONABLE`（本仓库源码中仍存在且可修复）。
4. 对所有 `ACTIONABLE` 候选用真实浏览器（Playwright，`getComputedStyle` 与真实交互）实测，再决定修复方案。未复现者不做改动。

## 分诊结论

绝大多数 open issue 属于功能请求、文档站问题、用户使用方式，或已由本 fork / 上游依赖修复。逐项结果摘要如下。

### 已在当前仓库或依赖中修复

- **表单与选择**：#234、#610、#558（Select 表单值、required 校验，依赖升级 + 空 option）；#599、#692（placeholder 类型与渲染）。
- **交互与焦点**：#155（菜单关闭后指针事件恢复）、#439、#454（Select 触摸/滑动）、#556（Dialog Title 警告）、#573（Button `loading` 类型）、#583（DropdownMenuItem `asChild`）、#590（Dialog 主题继承）、#610、#614（Link 光标与下划线）、#616（Dialog.Trigger 条件子元素）、#665（React 19 遮罩闪烁）、#671（循环依赖）、#689（DropdownMenu 嵌套按钮）。
- **样式与布局**：#591、#606（嵌套 Container）、#505（DataList 宽度）、#443（Popover 高度）、#559（React 19 ref 警告）。
- **无障碍与对比度**：#418、#440、#476（Tooltip 对比度）、#694（Callout WCAG AA）。
- **本 fork 新增或强化**：#451（RadioGroup.Item 不接收 `checked`）、#628（ScrollArea `dir`）、#630（Dialog 关闭按钮）、#639（grayColor 类型）、#664（Flex `around`/`evenly`）、#690（负 inset utility）、#719（Tooltip `disabled`）、#730/#720/#729（SegmentedControl 20 项/RTL/纵向）等，均已记录在 `CHANGELOG.md`。

### 根因在 Radix Primitives 依赖中（本仓库无法修复）

- #147（ContextMenu 重定位，实测见下）、#515（Select 重复 value 的 React key 警告，原生 select 要求 value 唯一）、#531（Checkbox `onChange` 语义，由 primitive 的隐藏原生 input 决定）、#658（RadioCards 原生校验气泡定位，由 primitive 的隐藏 radio 决定）、#696（ContextMenu 触发 Dialog 的事件顺序）。

### 功能请求 / 文档站 / 使用方式 / 环境问题（非本仓库 bug）

- 功能请求：#11、#539（RTL）、#47、#66、#69、#128、#247、#323、#379、#382、#421、#425、#434、#464、#472、#489（已在 fork 实现）、#505、#511、#524（已在 fork 实现）、#533（已在 fork 实现）、#562、#570（已在 fork 实现）、#584、#587（已在 fork 实现）、#589、#609、#643、#655、#669、#673 等。
- 文档站（独立 `radix-ui/website` 仓库）：#240、#453、#465、#486、#488、#513、#535、#568、#691。
- 使用方式或环境：#177、#443、#556、#559、#572、#574、#579、#580、#581、#592、#604、#617、#631、#670、#679、#689、#692 等。
- 内容为空或占位文本：#597。

### 本次实际修复（经浏览器实测确认）

| Issue                                                 | 结论               | 修复                                                                                                                                                                                  |
| ----------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#605](https://github.com/radix-ui/themes/issues/605) | ACTIONABLE，已复现 | `Avatar` 在 fallback 模式下不渲染 `<img>`，原先注入到 Image 上的 `asChild` 触发器 props/ref 因此丢失。改为将交互 props 放到持久的 Root 上，Popover/HoverCard 等触发器现在可正常打开。 |
| [#435](https://github.com/radix-ui/themes/issues/435) | ACTIONABLE，已复现 | `TextField` 用 `text-indent` 只设置起始侧内边距，右对齐/RTL 文本紧贴边框。改为同时设置 `padding-inline-end`，右对齐与 RTL 都保留内边距。                                              |

### 复核后未采纳的候选

- [#147](https://github.com/radix-ui/themes/issues/147)（ContextMenu 重定位）：分诊建议把动画的 `transform` 改为 `translate`/`scale`。**实测未复现**：右键菜单在二次右键后立即移动到新位置（`translate(56px,382px)` → `translate(246px,432px)`），定位 transform 位于 Popper 包裹层，动画作用于内层内容，二者并不冲突。为避免引入回归，未做改动，仅新增回归测试固化当前正确行为。

## 验证

- `pnpm format:check`、`pnpm lint`、`pnpm build` 全部通过。
- Playwright 交互与回归测试 **58 项通过**（Chromium / Firefox / WebKit / Android Chrome / iOS Safari）。
- 发布 tarball 冒烟测试在 **React 16.14 / 17.0 / 18.3 / 19.2** 全部通过。

## 分支与仓库状态

归档前的分支清理与保护详见 [branch-audit-2026-11-19.md](./branch-audit-2026-11-19.md) 与 [branch-governance.md](./branch-governance.md)。

- `origin/main` 为唯一稳定基线，`codex/web-release-foundation` 已完全合并入 `origin/main`，无未合并的功能分支。
- 本次归档就绪改动位于 `chore/archive-readiness` 分支，包含两笔提交，涵盖全部代码修复、回归测试与 changelog。
- 依赖、CI 与发布流程保持 `main` 保护规则；归档后不再接受新功能，仅保留只读快照与既有 Release 资产。
