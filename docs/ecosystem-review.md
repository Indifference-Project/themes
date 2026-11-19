# 生态调研与升级候选

本轮比较 React Web 组件库、无样式 Web 原语、设计系统和测试工具。直接对标的组件库依赖 Web 宿主。Ark UI 可以复用交互到多种 Web 框架，Web Components 提供框架无关的浏览器路线。Radix Themes 的 DOM、焦点、Portal 和 CSS 契约适合保持为一个 Web 分发包。

## 产品和技术差距

| 能力        | Radix Themes                                                    | 参考做法与本轮决定                                                                     |
| ----------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Dialog 组合 | 底层已有焦点约束和恢复。内置关闭按钮与自定义 DOM 宿主组合会出错 | Base UI 和 React Aria 将对话框拆成可组合部件。利用现有 Radix Slot 修复组合入口         |
| 国际化      | 内置关闭按钮名称固定英文                                        | MUI、React Aria、Fluent UI 允许应用提供面向用户的名称。添加本地化关闭名称，保留默认值  |
| Web 回归    | 路由快照可以检测样式差异                                        | Playwright 的三引擎和触屏模拟结合 APG 的焦点规范。补齐键盘、触屏和表单测试             |
| 视觉发现    | 已有主题面板、组件导航和单组件页面                              | Storybook 隔离示例，Mantine 按语义归类文档。本轮保留导航和示例，提供真实截图与安装示例 |
| 分发        | 上游 npm 有公开版本，分叉起点缺少可安装资产                     | Changesets 将 changelog 对应到包版本。用 GitHub Releases 提供可验证的构建、说明和回滚  |
| 可访问性    | 部分属性靠 TypeScript 和静态检查约束                            | axe-core 可扩充检查。优先覆盖真实键盘和触屏流程，等待屏幕阅读器真机验收                |

参考 [Base UI Dialog](https://base-ui.com/react/components/dialog)、[React Aria Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html)、[APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)、[Playwright emulation](https://playwright.dev/docs/emulation)、[GitHub immutable releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)。调研用于比较接口、交互和流程，开发使用仓库已有 MIT 代码与依赖。

## 升级候选

| #   | 候选与用户价值                          | 依据                            | 级别 / 成本 | 决定                         |
| --- | --------------------------------------- | ------------------------------- | ----------- | ---------------------------- |
| 01  | Dialog 自定义 DOM 保留 role、ref 与内容 | Radix Slot、Base UI             | A / 低      | 实施                         |
| 02  | 内置关闭控件支持本地化名称              | React Aria、Fluent UI           | A / 低      | 实施                         |
| 03  | 关闭对话框后恢复键盘焦点                | APG Dialog                      | A / 低      | 实施                         |
| 04  | 验证 Select required、提交与清空        | Base UI Form、React Aria Select | A / 低      | 实施                         |
| 05  | 真实触屏事件操作弹窗                    | Playwright emulation            | A / 低      | 实施                         |
| 06  | Linux、Windows、macOS 浏览器交互矩阵    | Playwright                      | A / 中      | 实施                         |
| 07  | 四代 React 对同一 tarball 安装和渲染    | MUI peer 策略                   | A / 中      | 实施                         |
| 08  | 验证 CJS、ESM、分层 CSS 入口            | Mantine、Radix Themes           | A / 低      | 实施                         |
| 09  | tag、包版本、变更记录匹配               | Changesets                      | A / 低      | 实施                         |
| 10  | 检查包大小与 SHA-256                    | GitHub Releases                 | A / 中      | 实施                         |
| 11  | 不可变发布和签名证明                    | GitHub immutable releases       | A / 中      | 实施                         |
| 12  | 消费端可重复升级和回滚                  | npm lockfile                    | A / 低      | 实施                         |
| 13  | 升级旧的 Playground 运行时依赖          | GitHub Advisory Database        | A / 中      | 实施                         |
| 14  | Actions 固定 SHA 和权限隔离             | GitHub Actions                  | A / 低      | 实施                         |
| 15  | 私密报告与新增依赖审查                  | GitHub Security                 | A / 低      | 实施                         |
| 16  | 依赖和 Action 更新 PR                   | GitHub Dependabot               | A / 低      | 实施                         |
| 17  | 实际示例、截图和安装流程                | Mantine、Storybook              | B / 低      | 实施                         |
| 18  | 记录版本、覆盖范围和已知问题            | MUI、Base UI releases           | B / 低      | 实施                         |
| 19  | Dialog 初始焦点和异常路径               | Base UI Focus                   | B / 中      | 随用户案例补测               |
| 20  | axe 核查核心 gallery 路由               | axe-core                        | B / 中      | 需处理演示样例基线           |
| 21  | NVDA、VoiceOver、TalkBack 真机流程      | APG、React Aria                 | B / 中      | 需设备和人工验证             |
| 22  | RTL 与嵌套弹出层回归                    | Ark UI、Radix Primitives        | B / 中      | 按用户案例增加               |
| 23  | 高对比、forced colors、reduced motion   | Fluent UI、Carbon               | B / 中      | 拓展测试基线                 |
| 24  | 独立组件 CSS 体积预算                   | Mantine、PrimeReact             | B / 中      | 先测量再评估拆分             |
| 25  | Gallery 首次加载成本                    | Storybook、shadcn/ui            | B / 中      | 先测主路由性能               |
| 26  | 大列表虚拟化示例                        | TanStack Virtual                | C / 中      | 等实际数据规模               |
| 27  | 字段组、错误及帮助文本示例              | Base UI Form、React Aria        | C / 中      | 随文档补充                   |
| 28  | 可搜索的 Combobox                       | Ariakit、Headless UI            | C / 高      | 先验证触屏与读屏需求         |
| 29  | 交互式文档专站和版本切换                | Storybook、Mantine              | C / 高      | 文档需求成熟时评估           |
| 30  | W3C tokens 导入导出                     | Radix Colors、Carbon            | C / 高      | 核对主题继承语义             |
| 31  | 原生应用、扩展或 PWA 分发               | Web Components 对比             | D / 高      | 组件库缺少独立应用流程       |
| 32  | 客户端后台安装和强制更新                | npm 与 GitHub 分发机制          | D / 高      | 消费应用控制安装、验收和部署 |

## 调研项目与来源

以下项目按“直接竞品、无样式交互原语、无障碍与测试基础设施、设计令牌和发布工程”分类。每一行至少绑定一个官方项目入口和一个可核验的功能页面；项目没有在本表中填入未经实时核验的 Star、Fork 或版本数字。访问日期：2026-11-19。

|   # | 项目                  | 分类             | 官方项目                                                         | 可核验入口                                                                                       | 对当前项目的启发                  |
| --: | --------------------- | ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------- |
|  01 | Radix Primitives      | 直接技术基座     | [GitHub](https://github.com/radix-ui/primitives)                 | [官网](https://www.radix-ui.com/primitives)                                                      | 保持行为、焦点和 Portal 基座      |
|  02 | Base UI               | 无样式原语       | [GitHub](https://github.com/mui/base-ui)                         | [Dialog](https://base-ui.com/react/components/dialog)                                            | 对照 Dialog 组合和焦点边界        |
|  03 | React Aria Components | 无障碍原语       | [GitHub](https://github.com/adobe/react-spectrum)                | [Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html)                                | 对照语义、国际化和插槽            |
|  04 | React Spectrum        | 设计系统         | [GitHub](https://github.com/adobe/react-spectrum)                | [官网](https://react-spectrum.adobe.com/)                                                        | 参考跨平台设计系统治理            |
|  05 | Ariakit               | 无障碍原语       | [GitHub](https://github.com/ariakit/ariakit)                     | [官网](https://ariakit.com/)                                                                     | 参考 Combobox、Menu 和焦点管理    |
|  06 | Headless UI           | 无样式组件       | [GitHub](https://github.com/tailwindlabs/headlessui)             | [官网](https://headlessui.com/)                                                                  | 参考 Dialog、Combobox 的用户路径  |
|  07 | Reach UI              | 无障碍组件       | [GitHub](https://github.com/reach/reach-ui)                      | [官网](https://reach.tech/)                                                                      | 参考 APG 对应的键盘行为           |
|  08 | Ark UI                | 多框架原语       | [GitHub](https://github.com/chakra-ui/ark)                       | [官网](https://ark-ui.com/)                                                                      | 参考状态机和多框架边界            |
|  09 | Chakra UI             | React 设计系统   | [GitHub](https://github.com/chakra-ui/chakra-ui)                 | [官网](https://chakra-ui.com/)                                                                   | 参考主题和组合式 API              |
|  10 | MUI                   | React 设计系统   | [GitHub](https://github.com/mui/material-ui)                     | [Dialog](https://mui.com/material-ui/react-dialog/)                                              | 参考 API 稳定性和迁移文档         |
|  11 | Fluent UI             | 企业设计系统     | [GitHub](https://github.com/microsoft/fluentui)                  | [React 文档](https://react.fluentui.dev/)                                                        | 参考 RTL、文案和无障碍指南        |
|  12 | Mantine               | React 组件库     | [GitHub](https://github.com/mantinedev/mantine)                  | [官网](https://mantine.dev/)                                                                     | 参考组件文档和主题组织            |
|  13 | Ant Design            | 企业组件库       | [GitHub](https://github.com/ant-design/ant-design)               | [官网](https://ant.design/)                                                                      | 参考 Form、Modal、Select 和国际化 |
|  14 | PrimeReact            | React 组件库     | [GitHub](https://github.com/primefaces/primereact)               | [官网](https://primereact.org/)                                                                  | 参考主题拆分和组件覆盖            |
|  15 | React Bootstrap       | React 组件库     | [GitHub](https://github.com/react-bootstrap/react-bootstrap)     | [Modal](https://react-bootstrap.netlify.app/docs/components/modal/)                              | 参考 CSS 分发和版本兼容           |
|  16 | Carbon Design System  | 设计系统         | [GitHub](https://github.com/carbon-design-system/carbon)         | [官网](https://carbondesignsystem.com/)                                                          | 参考 token、高对比和主题治理      |
|  17 | Shoelace              | Web Components   | [GitHub](https://github.com/shoelace-style/shoelace)             | [官网](https://shoelace.style/)                                                                  | 评估框架无关分发的边界            |
|  18 | FAST                  | Web Components   | [GitHub](https://github.com/microsoft/fast)                      | [官网](https://www.fast.design/)                                                                 | 参考跨框架组件基础设施            |
|  19 | Storybook             | 组件文档工具     | [GitHub](https://github.com/storybookjs/storybook)               | [a11y 测试](https://storybook.js.org/docs/writing-tests/accessibility-testing)                   | 评估隔离示例和可访问性面板        |
|  20 | Playwright            | 浏览器测试       | [GitHub](https://github.com/microsoft/playwright)                | [设备模拟](https://playwright.dev/docs/emulation)                                                | 保持桌面、移动和触屏矩阵          |
|  21 | axe-core              | 无障碍引擎       | [GitHub](https://github.com/dequelabs/axe-core)                  | [规则文档](https://www.deque.com/axe/core-documentation/)                                        | 为核心示例增加严重级别门禁        |
|  22 | axe-core Playwright   | 测试适配器       | [GitHub](https://github.com/dequelabs/axe-core-npm)              | [包文档](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)             | 在真实页面执行 axe 扫描           |
|  23 | Testing Library       | 用户行为测试     | [GitHub](https://github.com/testing-library/dom-testing-library) | [官网](https://testing-library.com/)                                                             | 以用户可见语义组织断言            |
|  24 | jest-axe              | 无障碍测试适配器 | [GitHub](https://github.com/NickColley/jest-axe)                 | [README](https://github.com/NickColley/jest-axe#readme)                                          | 对照组件级 axe 断言方式           |
|  25 | Pa11y                 | 页面无障碍测试   | [GitHub](https://github.com/pa11y/pa11y)                         | [官网](https://pa11y.org/)                                                                       | 评估页面级 CI 扫描边界            |
|  26 | Lighthouse            | Web 审计工具     | [GitHub](https://github.com/GoogleChrome/lighthouse)             | [无障碍审计](https://developer.chrome.com/docs/lighthouse/overview)                              | 参考性能和可访问性审计            |
|  27 | Radix Colors          | 颜色 token       | [GitHub](https://github.com/radix-ui/colors)                     | [官网](https://www.radix-ui.com/colors)                                                          | 保持色阶和对比度语义              |
|  28 | Style Dictionary      | token 工具       | [GitHub](https://github.com/amzn/style-dictionary)               | [官网](https://styledictionary.com/)                                                             | 评估跨平台 token 输出             |
|  29 | TanStack Virtual      | 性能工具         | [GitHub](https://github.com/TanStack/virtual)                    | [官网](https://tanstack.com/virtual/latest)                                                      | 仅在真实大列表需求出现时吸收      |
|  30 | Changesets            | 版本治理         | [GitHub](https://github.com/changesets/changesets)               | [使用文档](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md) | 参考变更、版本和 changelog 联动   |
|  31 | Dependabot            | 依赖维护         | [GitHub](https://github.com/dependabot)                          | [配置文档](https://docs.github.com/en/code-security/dependabot)                                  | 保持依赖和 Action 更新 PR         |
|  32 | npm                   | 包分发           | [文档](https://docs.npmjs.com/)                                  | [Provenance](https://docs.npmjs.com/generating-provenance-statements)                            | 区分上游 npm 与 fork Release 责任 |

本次证据边界：表格记录了项目、官方入口和与本项目结论直接相关的页面，但没有声称已经完成每个项目的完整源码、Issues、Releases 和近期活动统计。后续大版本调研应为候选项目追加版本、最近 Release、近期提交和许可证快照。
