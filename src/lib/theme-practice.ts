export interface ThemePractice {
  themeId: string;
  predict: string[];
  check: string[];
  pitfalls: string[];
  sandboxAccept: string[];
}

export const COUNTER_STATE_THEME_ID = 'counter-state';
export const EFFECT_CLEANUP_THEME_ID = 'effect-cleanup';
export const PROPS_COMPOSITION_THEME_ID = 'props-composition';
export const CONDITIONAL_UI_THEME_ID = 'conditional-ui';
export const LIST_KEYS_THEME_ID = 'list-keys';
export const FORM_CONTROL_THEME_ID = 'form-control';
export const CONTEXT_THEME_THEME_ID = 'context-theme';
export const CUSTOM_HOOKS_STORAGE_THEME_ID = 'custom-hooks-storage';

export const COUNTER_STATE_PRACTICE: ThemePractice = {
  themeId: COUNTER_STATE_THEME_ID,
  predict: [
    '点 + 后，数字为什么会变？',
    '若 count 是普通 let，点按钮后 UI 会怎样？',
    '离开本章再回来，count 还是刚才的值吗？'
  ],
  check: [
    'setCount 会触发 re-render，所以画面上的数字会变。',
    '值会改，但 UI 不会更新。',
    '不会。离开章节会卸载，count 从 0 再开始。'
  ],
  pitfalls: [
    '直接改 count 或用普通变量，UI 都不会更新。',
    '连续点击用 setCount(count + 1) 可能读到过期值。'
  ],
  sandboxAccept: [
    '显示当前数字，初始为 0。',
    '+ / - 各改 1，Reset 回到 0。',
    '离开页面再进入，计数回到 0。'
  ]
};

export const EFFECT_CLEANUP_PRACTICE: ThemePractice = {
  themeId: EFFECT_CLEANUP_THEME_ID,
  predict: [
    '进入本章后，Clock 创建了什么？',
    '离开本章时，interval 会怎样？',
    '再回来时，旧 interval 还在跑吗？'
  ],
  check: [
    '一个每秒更新时间的 setInterval。',
    'cleanup 会 clearInterval，timer 停掉。',
    '不会。旧的已清掉，会再开一个新的。'
  ],
  pitfalls: [
    '遗漏 clearInterval，离开后 timer 仍在跑。',
    '在 render 里设 interval，或把 time 放进依赖，都会反复重建。'
  ],
  sandboxAccept: [
    'Clock 每秒更新一次。',
    '暂停后不再 tick；再开时只有一个 timer。',
    '卸载后 timer 归零；StrictMode 检查也不该多留 timer。'
  ]
};

export const PROPS_COMPOSITION_PRACTICE: ThemePractice = {
  themeId: PROPS_COMPOSITION_THEME_ID,
  predict: [
    '这五个按钮是几个组件？',
    '点 Disabled 会不会弹窗？',
    '再加一种外观，复制组件还是加 variant？'
  ],
  check: [
    '同一个 CustomButton，换 variant / disabled / 文案。',
    '不会。disabled 时 onClick 不触发。',
    '加 variant（或新 prop），不要再做一个按钮组件。'
  ],
  pitfalls: [
    '为每种外观复制一个按钮组件。',
    'disabled 时仍指望 onClick 生效。'
  ],
  sandboxAccept: [
    '一个按钮组件至少能表达 primary / secondary / destructive。',
    '支持 disabled，禁用时点击无效果。',
    '文案由调用方传入，而不是写死。'
  ]
};

export const CONDITIONAL_UI_PRACTICE: ThemePractice = {
  themeId: CONDITIONAL_UI_THEME_ID,
  predict: [
    '进入本章第一秒应该看到什么？',
    '离开时，未完成的请求会怎样？',
    'loading、error、user 会同时出现吗？'
  ],
  check: [
    '先看到 loading，结束后才是资料或错误。',
    '会取消，不再对已卸载组件 setState。',
    '不会。三种状态互斥，只显示一种。'
  ],
  pitfalls: [
    '同时渲染 loading、error 和成功内容。',
    '卸载后仍 setState；用 && 判断时把 0 渲染出来。'
  ],
  sandboxAccept: [
    '请求中只显示 loading。',
    '失败可重试；成功只显示用户信息。',
    '卸载时取消未完成请求，不更新已卸载组件。'
  ]
};

export const LIST_KEYS_PRACTICE: ThemePractice = {
  themeId: LIST_KEYS_THEME_ID,
  predict: [
    '打勾后，进度数字会怎么变？',
    '列表项的 key 用的是 id 还是下标？',
    '用 index 当 key，勾选后再重排会怎样？'
  ],
  check: [
    '完成数 +1，进度跟着变。',
    '用稳定 id，不是数组下标。',
    '勾选状态可能跟错另一项。'
  ],
  pitfalls: [
    '对会重排的列表用 index 当 key。',
    '直接改 todos[i].completed，而不是返回新数组和新对象。'
  ],
  sandboxAccept: [
    '列表用稳定 id 作为 key。',
    '切换完成状态时只更新该项，进度跟着变。',
    '更新时返回新数组和新对象，不改原 state。'
  ]
};

export const FORM_CONTROL_PRACTICE: ThemePractice = {
  themeId: FORM_CONTROL_THEME_ID,
  predict: [
    '输入值存在 DOM 里，还是 React state 里？',
    '空提交时，焦点会落到哪？',
    '提交中离开本章，还会进历史吗？'
  ],
  check: [
    '在 React state 里（受控输入）。',
    '第一个无效字段。',
    '不会。卸载会取消未完成的提交 timer。'
  ],
  pitfalls: [
    '忘记 preventDefault，页面被刷新。',
    '卸载后仍把提交结果写进 state。'
  ],
  sandboxAccept: [
    '受控输入；校验失败有提示并聚焦首个错误字段。',
    '成功提交后出现一条历史，表单被清空。',
    '提交中卸载会取消未完成的 timer。'
  ]
};

export const CONTEXT_THEME_PRACTICE: ThemePractice = {
  themeId: CONTEXT_THEME_THEME_ID,
  predict: [
    '点按钮后，变的是这张卡，还是整页？',
    '主题存在组件自己的 state，还是 Context？',
    '切走再回来，主题会回到默认吗？'
  ],
  check: [
    '整页（含顶栏），读的是同一份 Context。',
    '在 Context 里，深层组件也能读到。',
    '不会。这个示例会把主题持久化。'
  ],
  pitfalls: [
    '为了主题把 props 一层层往下传。',
    '用 A / D 去切主题（这里只换章）。'
  ],
  sandboxAccept: [
    '任意深层组件能读到并切换主题，无需 prop drilling。',
    '主题选择会持久化。',
    'A / D 只换章，不切主题。'
  ]
};

export const CUSTOM_HOOKS_STORAGE_PRACTICE: ThemePractice = {
  themeId: CUSTOM_HOOKS_STORAGE_THEME_ID,
  predict: [
    '加一条笔记后离开再回来，还在吗？',
    '上面的统计是每次 render 都重算吗？',
    '如果旧数据是字符串数组，页面会怎样？'
  ],
  check: [
    '还在。笔记写进了 localStorage。',
    'notes 变了才重算（useMemo）。',
    '不会崩，会迁移成带 id 的对象列表。'
  ],
  pitfalls: [
    '把 localStorage 读写复制到每个组件。',
    '损坏的 storage 让页面直接崩。'
  ],
  sandboxAccept: [
    '新增笔记后刷新或回章仍在。',
    'storage 损坏或不可用时回退到安全空列表。',
    '笔记有稳定 id；旧字符串数组能迁移。'
  ]
};

const THEME_PRACTICE: Record<string, ThemePractice> = {
  [COUNTER_STATE_THEME_ID]: COUNTER_STATE_PRACTICE,
  [EFFECT_CLEANUP_THEME_ID]: EFFECT_CLEANUP_PRACTICE,
  [PROPS_COMPOSITION_THEME_ID]: PROPS_COMPOSITION_PRACTICE,
  [CONDITIONAL_UI_THEME_ID]: CONDITIONAL_UI_PRACTICE,
  [LIST_KEYS_THEME_ID]: LIST_KEYS_PRACTICE,
  [FORM_CONTROL_THEME_ID]: FORM_CONTROL_PRACTICE,
  [CONTEXT_THEME_THEME_ID]: CONTEXT_THEME_PRACTICE,
  [CUSTOM_HOOKS_STORAGE_THEME_ID]: CUSTOM_HOOKS_STORAGE_PRACTICE
};

export const THEME_PRACTICE_IDS = Object.keys(THEME_PRACTICE);

export function getThemePractice(themeId: string): ThemePractice | undefined {
  return THEME_PRACTICE[themeId];
}
