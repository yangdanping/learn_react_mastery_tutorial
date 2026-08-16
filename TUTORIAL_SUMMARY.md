# React 精通教程：复习摘要

## 项目定位

这是一个 Vite + React 19 的交互式复习项目。七个章节承载八个示例；界面始终只挂载当前章节，以便单独观察组件状态、render 和 Effect 生命周期。

## 核心概念

### 1. useState 与 useEffect

```tsx
const [count, setCount] = useState(0);
setCount((current) => current + 1);

useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer);
}, []);
```

- state 更新会触发重新渲染；依赖旧值时优先使用函数式更新。
- render 必须保持纯净，timer、订阅和请求属于 Effect 或事件处理。
- cleanup 在依赖变化前和卸载时运行。本项目切章会卸载旧章节，因此后台任务必须被清理。

### 2. Props 与组合

- Props 是组件的输入；TypeScript 接口明确约束输入形状。
- 优先组合小组件，不为每种外观复制一个新组件。
- 默认参数用于表达常见路径，variant 用于表达有限差异。

### 3. 条件渲染

- loading、error、empty、success 是互斥的 UI 状态。
- 模拟请求也需要取消机制，避免组件卸载后继续更新状态。
- 条件分支应让每个时刻只呈现有意义的状态。

### 4. 列表与 key

- key 必须来自稳定 ID，而不是会随排序或删除改变的数组下标。
- 更新数组时返回新数组和新对象，不直接修改原 state。
- 可点击列表项应使用 `button` 等原生交互元素，而不是只给 `div` 添加 `onClick`。

### 5. 表单与事件

- 受控输入由 React state 驱动，提交时阻止浏览器默认导航。
- 校验结果属于可见 UI，应靠 state 表达。
- JSX 内联函数通常不是性能问题。只有 memoized child、Effect 依赖或实测重渲染成本确实需要稳定引用时，才使用 `useCallback`。
- 延迟提交在章节卸载时必须取消。

### 6. Context

- Context 适合主题等跨层级共享且更新频率可控的状态。
- 不要把所有 state 都放进 Context；局部状态仍应留在最近的组件中。
- 本项目只持久化显式主题选择，`A` / `D` 专用于章节导航。

### 7. 自定义 Hooks 与 memoization

- 自定义 Hook 抽取的是可复用的有状态逻辑，而不是 UI。
- `useLocalStorage` 保持类似 `useState` 的函数式 setter，并容忍损坏或不可用的 storage。
- `useMemo` 是有成本的性能工具，不是所有计算的默认写法。
- Notes 使用持久化稳定 ID；旧的字符串数组会自动迁移。

## 复习检查题

完成一个章节后，不看源码回答：

1. 这个示例的 state 最小集合是什么？哪些值可以计算得到？
2. 哪段代码会触发 render？哪段代码属于副作用？
3. 组件离开页面时必须清理什么？
4. 如果从空白项目重写，最小验收行为是什么？
5. 隔天能否只用文字解释错误写法为什么错？

推荐节奏：**Tutorial 看懂 → Sandbox 脱稿实现 → Recall 隔天检索 → 回到 Tutorial 校正**。
