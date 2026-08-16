# React Mastery Focused Tutorial

一个用于复习 React 基础的单章节学习工作台。它保留原教程的八个交互示例，但每次只挂载当前章节，避免多个 render 日志、Effect、计时器和临时状态互相干扰。

原始视频教程：[YouTube Guide](https://www.youtube.com/watch?v=vZzFlAjz4rA&list=PLE9hy4A7ZTmpGq7GHf5tgGFWh2277AeDR&index=15)。当前仓库在原项目基础上增加了聚焦式导航、持久化、可访问性、测试和 Vite/shadcn 迁移。

## 使用方式

- `A`：上一章；`D`：下一章。输入框、文本域、组合输入、长按和带修饰键的操作不会触发切章。
- 页面底部始终有上一章、下一章按钮。
- 顶部“目录”会打开 shadcn Sheet，可直接跳转任意章节。
- URL hash 可直接定位章节，浏览器前进/后退可恢复章节。
- 第一章和最后一章不会循环跳转。

持久化范围是有意收敛的：

| 内容 | 刷新后 | 离开章节再返回 |
| --- | --- | --- |
| 主题 | 保留 | 保留 |
| 当前章节 | 保留 | — |
| Smart Notes | 保留 | 保留 |
| Counter、Todo、ContactForm 等临时状态 | 不保留 | 重置 |

只挂载当前章节意味着离开章节时会真实执行 Effect cleanup。Clock interval、模拟用户请求和表单提交 timer 都有回归测试，隐藏章节不会继续在后台运行。

## 本地运行

需要 Node.js 20.19+ 或 22.12+，并使用 pnpm：

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3001](http://localhost:3001)。

完整验证：

```bash
pnpm test --run
pnpm lint
pnpm typecheck
pnpm build
```

## 七个章节、八个示例

1. State Management：Counter（`useState`）与 Clock（`useEffect` cleanup）
2. Component Architecture：Props、组合与可复用按钮
3. Conditional Rendering：loading、error、success 状态
4. Data Display：列表渲染、稳定 key 与不可变更新
5. User Interaction：受控表单、校验与异步清理
6. Global State：Context 与主题持久化
7. Advanced Patterns：自定义 `useLocalStorage`、`useMemo` 与 Notes

## 项目结构

```text
src/
├── App.tsx
├── main.tsx
├── index.css                  # Tailwind、shadcn token 与基础主题
├── styles/tutorial.css        # 教程专属普通 CSS（无 Sass）
├── components/
│   ├── TutorialWorkspace.tsx  # 单章节渲染、目录和导航
│   ├── Section.tsx
│   ├── ui/                    # shadcn Base Nova 组件
│   └── 01_... 至 08_...       # React 示例
├── contexts/ThemeContext.tsx
├── hooks/
│   ├── use-section-shortcuts.ts
│   └── useLocalStorage.ts
└── lib/
    ├── sections.ts
    └── tutorial-navigation.ts
```

技术栈：React 19、TypeScript 6、Vite 8、Tailwind CSS 4、shadcn/ui Base Nova、Vitest 与 Testing Library。七个本地章节无需 React Router；`activeId + hash + localStorage` 已足够表达导航状态。

## 建议的复习闭环

1. **Tutorial 看懂范例**：一次只研究一个章节，观察 state、render 和 cleanup。
2. **空白 Sandbox 脱稿实现**：不复制整个项目，只根据验收目标重新写出最小示例。
3. **Recall 隔天回忆原理**：先用文字解释“为什么”，再回到 Tutorial 对照遗漏。

Tutorial 是可运行参考答案，Sandbox 是主动提取练习，Recall 是延迟检索。三者分工明确，比把同一份长文和代码重复三遍更有效。

## Git 迁移说明

项目在原仓库内原地迁移，历史没有重建。`nextjs-final` tag 指向迁移前的 Next.js 最终提交；之后的 Vite、导航、shadcn 和示例校正均为独立提交，可逐步回看。

MIT License。
