# 维护与平台状态

## 原始基线

审计起点为分叉的 `main` 提交 `3720860`。当前工作树中的包版本是 3.4.0，包内变更日志已记录对应条目；本次工作区包含尚未提交的发布基础设施改动。分叉的 GitHub 仓库远程地址为 `yuchen0x1/themes`，默认分支与分支保护、Secrets、Variables、Releases、Actions 设置需在 GitHub Settings/API 中复核，不能仅凭本地文件确认。上游 npm 包与分叉的 GitHub 分发各自独立。

| 模块                                      | 原有功能与架构                                                                                                                                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/radix-ui-themes/src/components` | 主题及嵌套主题、Button/IconButton、Checkbox 和 Radio 系列、Switch、Slider、Select、输入框和文本区、Dialog/AlertDialog、Popover、菜单、Tooltip、HoverCard、Tabs/TabNav、进度、骨架、头像、表格、数据列表、文本与图标语义辅助。Radix Primitives 提供交互和焦点管理。 |
| `props`、`helpers`、`styles`              | Box、Flex、Grid、Container、Section、Inset、ScrollArea 等布局能力。共用响应式 props 和 CSS 自定义属性，含颜色、外观、半径、字号、间距、缩放和布局变量。                                                                                                            |
| `scripts`、PostCSS 配置、包清单           | esbuild CJS/ESM 与 TypeScript 声明，PostCSS 构建全量 CSS 和分层入口。组件、props、helpers 有独立导入入口。                                                                                                                                                         |
| `apps/playground`                         | Next.js App Router。组件总览 `/sink`、单组件页面、`/demo`、主题快照及 `/test/*`。唯一服务端路由是演示头像延迟重定向。                                                                                                                                              |
| 数据、权限和硬件                          | 组件状态由 React 与消费方管理。Playground 的主题偏好经 `next-themes` 保存在浏览器。业务数据库、身份服务、文件权限、迁移和专用硬件均不适用。                                                                                                                        |
| 文档、测试及发布                          | MIT。原有 macOS Playwright 截图，CI 只比较 Chromium。原有发布工作流仅能发布上游 npm，分叉的 README 曾由带仓库写权限的定时工作流更新。                                                                                                                              |

库构建和库 lint 在依赖树恢复后通过。历史 Windows 运行完整视觉测试曾触发缺失 `win32` 快照；当前 CI 已在非 macOS 浏览器作业排除视觉回归，视觉基线仍以仓库现有 `darwin` 快照为准。格式检查仍需单独处理 checkout 行尾差异和既有格式偏差。旧依赖的公开 npm advisories 应通过官方 registry 复核，配置中的本地镜像未提供 audit 所需端点。

## 平台可行性

A 为正式支持的交付形式。C 表示可以用于外围演示或作为消费场景，维护成本高于独立交付价值。D 表示缺少运行 Web DOM、CSS 或 React DOM 的基础。

| 目标                                      | 评级  | 核心兼容性、体验、维护和分发                                                                                                              |
| ----------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 桌面 Web                                  | A     | Chromium、Firefox、WebKit 可运行 React DOM 和 CSS。支持键盘、指针、响应式布局和主题。消费方通过锁文件升级，浏览器通过站点部署加载新版本。 |
| 移动 Web                                  | A     | Chrome Android 与 Safari iOS 浏览器交互通过触屏和窄视口验证，真实设备覆盖见测试记录。浏览器沙盒内运行，无安装权限或专用硬件。             |
| 响应式 Web                                | A     | 桌面和移动共用 CSS 变量与断点。组件大小和布局可响应容器或屏幕条件，宿主站点负责 viewport、业务界面和跨设备验收。                          |
| Windows 10、Windows 11                    | A / C | 桌面浏览器使用 A 级 Web 同一资产。独立 Win32 应用为 C，需另写业务界面和系统安装、托盘及更新，组件库本身没有独立工作流。                   |
| Linux、Ubuntu、Debian、Fedora、Arch Linux | A / C | 浏览器使用 A 级 Web 同一资产，CI 的 Ubuntu runner 验证范围不等同于每个发行版。原生包为 C，需要按发行版维护安装、签名和升级。              |
| macOS Intel、macOS Apple Silicon          | A / C | Web 同一资产，CI macOS runner 验证的是该 runner 的环境。原生应用为 C，双架构分发、签名和公证没有对应业务收益。                            |
| Android、Android 平板、折叠屏             | A / D | 浏览器中的触屏与响应式布局沿用 Web 检查。平板和折叠姿态仍需设备验收。原生 React Native 视图没有 DOM、CSS 级联或现有 focus/portal 语义。   |
| iOS、iPadOS                               | A / D | 浏览器使用 Web 资产，需真实 Safari 设备补足。原生 UIKit/SwiftUI 无法直接承载现有功能，重写会形成另一套组件和商店发布维护链。              |
| PWA                                       | C     | 宿主站点可自行实现 Service Worker、离线和安装。为组件库演示添加更新弹窗和离线持久化的收益有限。                                           |
| Chrome、Edge、Firefox 扩展                | C     | 扩展的 HTML 页面可以消费组件。各浏览器的权限、CSP、商店审核和更新由扩展宿主处理。                                                         |
| Docker、NAS、私有化、云服务器             | C     | Next.js Playground 可运行在 Node 24 环境。容器和站点是演示部署，库的交付单位是 tarball。消费方负责主机权限、维护和回滚。                  |
| CLI                                       | D     | 包管理器负责安装和版本查询。交互组件依赖浏览器，CLI 无法提供组件功能。                                                                    |

## 兼容性与日常维护

React 16、17、18、19 使用同一 tarball 和 CSS。CI 通过独立消费者目录安装并执行 ESM、CommonJS 和服务端渲染 smoke。Web 交互矩阵包含三个桌面引擎和两套移动设备配置。主分支推送、PR、每周日程和版本标签使用同一 CI。macOS Chromium 保留截图比较。Firefox、WebKit 的原 macOS 参考仍可在 macOS 手工运行。

每周 Dependabot 检查 npm、GitHub Actions。PR 有新增依赖的漏洞和许可证审查，CI 对整个工作区生产依赖执行 high 级门禁。私密漏洞报告入口由 SECURITY.md 提供；Secret Scanning、推送保护、分支规则和环境审批属于 GitHub Settings/API 控制项，需在仓库中单独复核，不能由本地文件证明已启用。处理安全修复时先检查实际发布依赖、Playground 运行时与仅用于开发的工具链各自受到的影响。

工作区的生成文件包括 CSS、类型文件、CJS、ESM 和源映射。源码和源映射供公开 MIT 包的消费者调试。发布包必须包含 MIT 声明。可以在 [CI](https://github.com/yuchen0x1/themes/actions/workflows/ci.yml)、[依赖审核](https://github.com/yuchen0x1/themes/actions/workflows/dependency-review.yml) 和 [Release](https://github.com/yuchen0x1/themes/releases) 查看每个版本的实时状态。新增功能评审参考 [升级候选清单](./ecosystem-review.md)，发布验证与回滚见 [发布流程](../release-process.md)。

每次较大版本评审重新检查相关上游的 Releases、Issues 和核心实现。每月例行维护时复查近期上游安全修复、发布资产、下载地址和依赖 PR。将实际结果记入维护 PR 的描述，待评估的功能保留在候选清单。
