# React Mastery Tutorial Vite 迁移设计

## 背景

当前应用是一个 Next.js 客户端教程页，七个章节在普通模式下同时可见和挂载。它适合从头滚动浏览，但不适合逐章观察 React 行为：多个组件的 render、Effect、计时器与控制台输出会交织，下一章节也会提前进入视野。

项目已经具备目录、主题、键盘操作、URL hash 与本地偏好恢复。此次迁移保留这些成果，但把产品形态从“长页面 + 可选禅模式”收敛为“始终单章节的学习工作台”。

## 目标

- 将项目从 Next.js 迁移到 Vite、React 19、TypeScript、Tailwind CSS 4 与 shadcn/ui。
- 每次只挂载一个章节，隔离 Effect、计时器、render 日志与临时组件状态。
- 使用页面按钮和 `A` / `D` 快捷键切换上一章、下一章。
- 使用按需打开的目录直接跳转章节。
- 持久化主题、当前章节与 Notes；Counter、Todo、ContactForm 等临时状态在离开章节后重置。
- 保留现有 Git 历史和迁移前快照，不创建一个与旧仓库割裂的新仓库。

## 非目标

- 不引入 React Router。七个本地章节由 `activeId + URL hash + localStorage` 管理。
- 不保留普通长页面模式，也不再保留 `zenMode` 布尔状态。
- 不把 Recall 或未来的空白 Sandbox 合并进本项目。
- 不在本次迁移中扩充 React 课程主题。

## 技术架构

### 应用入口

- `index.html` 承担标题、描述和主题初始化脚本。
- `src/main.tsx` 创建 React root，导入全局样式并渲染 `App`。
- `src/App.tsx` 组合 `ThemeProvider` 与 `TutorialWorkspace`。

### 章节模型

`src/lib/sections.ts` 提供稳定的章节元数据；`TutorialWorkspace` 按章节 ID 选择示例组件。章节定义包含：

- `id`
- `number`
- `title`
- `description`

只渲染当前章节组件。章节变化时旧组件卸载、新组件挂载，因此章节内部临时 state 重置，Effect cleanup 能在离开章节时运行。

### 章节导航状态

优先级：

1. URL hash 中的有效章节 ID。
2. `tutorial-prefs:v2` 中存储的有效章节 ID。
3. 第一章节。

章节变化时：

- 更新 React state。
- 使用 History API 更新 hash。
- 写入 localStorage。
- 关闭目录。
- 将焦点移动到章节标题。
- 将学习区域滚动到顶部；减少动态效果时使用即时滚动。

浏览器 `popstate` / `hashchange` 能恢复前进/后退导航。损坏或不可用的 localStorage 不得阻断应用。

### 键盘交互

- `A`：上一章。
- `D`：下一章。
- 第一章和最后一章不循环。
- 忽略 editable target、组合输入、重复键和带修饰键的事件。
- 页面始终提供可见的上一章/下一章按钮，快捷键不是唯一入口。

### 目录

- 使用 shadcn/ui `Sheet` 实现按需目录。
- 每个目录项显示顺序、标题和当前状态。
- 目录按钮显示当前进度，例如 `2 / 7`。
- 点击当前章节也会关闭目录并聚焦标题。

### 主题与样式

- 继续使用 `.light` / `.dark` 与 CSS Variables。
- shadcn 语义 token 作为唯一颜色契约：`background`、`foreground`、`card`、`primary`、`muted`、`border`、`ring` 等。
- `src/index.css` 保存 Tailwind、shadcn imports、theme token 和基础样式。
- `src/styles/tutorial.css` 保存教程专属布局与组件样式。
- 移除 Sass。现有 `%placeholder` 可改为普通组合选择器，章节 `@each` 循环因单章节渲染而不再需要。
- 优先用 shadcn `Button`、`Input`、`Textarea`、`Sheet` 替换相同职责的自定义控件；教程特有展示仍可使用语义类名。

## 内容正确性调整

- Clock 的正常计时器必须在 cleanup 中 `clearInterval`。
- 不提供会遗留真实后台计时器的“坏示例”开关；坏模式保留为注释说明。
- Todo 进度条使用明确 props 类型，移除意外文本。
- Notes 不再用数组 index 作为可变列表 key；Note 数据包含稳定 ID。
- useCallback 的说明改为有条件的性能工具，不把 JSX 内联函数描述成普遍性能问题。

## 测试策略

- 使用 Vitest、Testing Library、user-event 与 jsdom。
- 纯函数测试：偏好解析、hash 优先级、边界导航。
- 组件测试：默认章节、按钮导航、A/D、editable target 忽略、目录跳转、焦点移动、持久化容错。
- 回归测试：离开章节再返回时 Counter 状态重置。
- Clock 使用 fake timers 验证卸载后计时器被清理。
- 验证命令：`pnpm test --run`、`pnpm lint`、`pnpm typecheck`、`pnpm build`。

## Git 与迁移安全

- 迁移在 `codex/vite-tutorial-migration` 分支和隔离 worktree 中完成。
- 迁移前主线提交保留为 `nextjs-final` tag。
- shadcn 脚手架只在临时目录生成；不覆盖原仓库的 `.git`。
- 迁移按配置、交互、样式与内容修正分批提交，使历史可追踪。
- 原工作区中的未提交 Clock 实验先保留，完成时以可恢复方式处理，不静默丢弃。

## 验收标准

- 启动后只显示一个章节，不出现普通长页面或禅模式切换。
- A/D、可见按钮和目录均可切换章节。
- 章节、主题和 Notes 刷新后恢复；其他示例状态离开章节后重置。
- URL hash 优先于本地章节偏好，浏览器前进/后退可用。
- 隐藏章节不再保持活动 Effect 或计时器。
- 390×844、1024×768、1440×900 和超宽桌面布局无水平溢出，正文保持居中且不过宽。
- 所有测试、lint、TypeScript 和生产构建通过。
