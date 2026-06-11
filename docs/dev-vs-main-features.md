# dev 对比 main 新增功能说明

对比范围：`main..dev`

基准分支：`main`（`d06e8f4 chore(release): bump version to 0.4.1`）

目标分支：`dev`（`929b1bb Merge branch 'nezha/task-779619'`）

## 概览

`dev` 分支相对 `main` 主要新增和优化了终端体验，重点包括：

- 新增终端字号快捷键：支持通过键盘快速增大或减小终端字体。
- 新增快捷键开关：可在应用设置中启用或关闭终端字号快捷键。
- 优化 xterm 滚动条：将默认滚动条调整为贴边的 overlay 样式，减少终端内容区占用。
- 修复 Nerd Font + WebGL 渲染问题：改善字符宽度测量和字体图集刷新，降低字形错位或 fallback 字体残留的概率。
- 调整终端视觉细节：统一终端容器内边距，暗色主题下聊天终端背景与界面面板更一致。

## 新增功能

### 1. 终端字号快捷键

`dev` 增加了全局终端字号快捷键：

- macOS：`Cmd + +` 增大终端字体，`Cmd + -` 减小终端字体。
- Windows / Linux / 其他平台：`Ctrl + +` 增大终端字体，`Ctrl + -` 减小终端字体。
- 支持数字小键盘的 `NumpadAdd` / `NumpadSubtract`。
- 按下 `Alt` 时不会触发字号调整，避免和终端程序或系统快捷键冲突。

触发后会直接更新应用内的 `terminalFontSize` 状态，并沿用已有的字号上下限逻辑。

涉及文件：

- `src/App.tsx`
- `src/shortcuts.ts`
- `src/test/send-shortcut.test.ts`

### 2. 应用设置中新增“终端字体大小”快捷键开关

快捷键面板新增“终端字体大小”开关，用于控制终端字号快捷键是否启用。

行为说明：

- 默认开启。
- 设置会持久化到 `~/.nezha/settings.json`。
- 切换后通过已有的应用设置变更事件刷新主界面状态。
- 旧配置文件没有该字段时，会自动使用默认值 `true`。

新增的应用设置字段：

```json
{
  "terminal_font_size_shortcuts_enabled": true
}
```

涉及文件：

- `src-tauri/src/app_settings.rs`
- `src-tauri/src/lib.rs`
- `src/components/app-settings/ShortcutsPanel.tsx`
- `src/components/app-settings/AgentPathSection.tsx`
- `src/components/app-settings/types.ts`
- `src/i18n.tsx`

## 体验优化

### 1. 终端 overlay 滚动条

`dev` 为 xterm 容器新增统一 class，并通过 CSS 覆盖 xterm 6 的滚动条样式：

- 隐藏浏览器原生滚动条。
- 使用 xterm 自绘的贴边窄滚动条。
- 默认滚动条 thumb 宽度为 6px，容器命中区域为 12px。
- Shell 终端单独设置右侧偏移，避免贴边位置与面板布局冲突。
- 隐藏 overview ruler，避免终端右侧出现额外视觉噪声。

涉及文件：

- `src/App.css`
- `src/components/TerminalView.tsx`
- `src/components/ShellTerminalPanel.tsx`
- `src/components/terminalShared.ts`

### 2. 终端背景和内边距统一

终端视觉细节调整：

- 暗色主题下聊天终端背景改为 `#2b313d`，与运行视图的聊天区域更协调。
- 终端容器内边距统一为 `10px`。

涉及文件：

- `src/components/TerminalView.tsx`
- `src/styles/terminal.ts`

## 技术修复

### 1. 修复 Nerd Font 字符宽度测量偏差

在 WKWebView + Nerd Font + WebGL 场景下，xterm 通过 canvas `measureText` 得到的字符宽度可能与真实 DOM 排版不一致，导致：

- 终端列数计算不准。
- WebGL cell 宽度偏移。
- 字符渲染出现错位。

`dev` 在 `safeFit()` 前后加入 DOM 实测字符尺寸，并同步到 xterm 内部的 `_charSizeService`，确保 FitAddon 和 WebGL 渲染使用一致的字符宽度。

涉及文件：

- `src/components/terminalShared.ts`

### 2. 修复 WebGL 字体图集刷新时机

WebGL glyph atlas 的首次 warmup 可能早于 WebView 完成字体加载，导致默认色 ASCII 被缓存成 fallback 字形。

`dev` 在字体 ready 后清理 WebGL texture atlas，并刷新终端内容，相当于自动执行一次字体重新栅格化。

涉及文件：

- `src/components/terminalShared.ts`

## 国际化

新增中英文文案：

- `appSettings.terminalFontSizeShortcuts`
- `appSettings.terminalFontSizeIncrease`
- `appSettings.terminalFontSizeDecrease`

涉及文件：

- `src/i18n.tsx`

## 测试覆盖

新增单元测试覆盖：

- 终端字号快捷键开关默认值归一化。
- 不同平台下的增大 / 减小字号快捷键识别。
- 错误修饰键、跨平台错误组合、带 `Alt` 的组合不会触发。
- 不同平台快捷键展示文案生成。

涉及文件：

- `src/test/send-shortcut.test.ts`

## 变更文件清单

```text
src-tauri/src/app_settings.rs
src-tauri/src/lib.rs
src/App.css
src/App.tsx
src/components/ShellTerminalPanel.tsx
src/components/TerminalView.tsx
src/components/app-settings/AgentPathSection.tsx
src/components/app-settings/ShortcutsPanel.tsx
src/components/app-settings/types.ts
src/components/terminalShared.ts
src/i18n.tsx
src/shortcuts.ts
src/styles/terminal.ts
src/test/send-shortcut.test.ts
```

## 建议验证

建议在合并前执行：

```bash
pnpm test
pnpm lint
pnpm build
```

手动验证重点：

- 在应用设置中关闭“终端字体大小”后，字号快捷键不再生效。
- 重新打开应用后，快捷键开关状态能正确恢复。
- 任务终端和 Shell 终端滚动条都正常显示、拖动和淡出。
- macOS 下 Nerd Font 在 WebGL 渲染时没有明显字符错位或 fallback 字形残留。
