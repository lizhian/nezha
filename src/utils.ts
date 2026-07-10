import { NERD_DIRECTORY_ICONS, NERD_EXTENSION_ICONS, NERD_FILENAME_ICONS } from "./fileIcons";

export const AVATAR_COLORS: [string, string][] = [
  ["#2563D6", "#1E4FA8"],
  ["#4F63D7", "#3F46A6"],
  ["#6D55D2", "#5540A8"],
  ["#7B4CC7", "#61369C"],
  ["#0891B2", "#0E6F86"],
  ["#0D9488", "#0F6B64"],
  ["#0B80C6", "#075E91"],
  ["#0A9A73", "#087354"],
  ["#5B6FD6", "#4250A8"],
  ["#12A4C7", "#0B7892"],
];

export function getAvatarGradient(name: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function shortenPath(p: string) {
  return p.replace(/^\/Users\/[^/]+/, "~");
}

export function load<T>(key: string, fallback: T): T {
  try {
    const r = localStorage.getItem(key);
    return r ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
}
export function save<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ── Usage 颜色工具 ────────────────────────────────────────────────────────────

export function getUsageColor(remainingPercent: number): string {
  if (remainingPercent > 70) return "var(--usage-good)";
  if (remainingPercent >= 20) return "var(--usage-warn)";
  return "var(--usage-danger)";
}

// ── Git 状态工具 ──────────────────────────────────────────────────────────────

export function getGitStatusColor(status: string): string {
  switch (status) {
    case "A":
      return "#3fb950";
    case "D":
      return "#f85149";
    case "M":
      return "#e3b341";
    case "R":
      return "#79c0ff";
    case "?":
      return "#79c0ff";
    case "U":
      return "#f85149";
    default:
      return "var(--text-muted)";
  }
}

export function getGitStatusLabel(status: string): string {
  switch (status) {
    case "A":
      return "A";
    case "D":
      return "D";
    case "M":
      return "M";
    case "R":
      return "R";
    case "?":
      return "U";
    case "U":
      return "!";
    default:
      return status;
  }
}

// ── 文件颜色工具 ──────────────────────────────────────────────────────────────

export function getFileColor(name: string, ext?: string): string {
  const n = name.toLowerCase();
  const e = ext ?? (name.includes(".") ? name.split(".").pop()!.toLowerCase() : "");

  if (n === "dockerfile" || n.startsWith("dockerfile.")) return "var(--icon-file-docker)";
  if (n === "makefile" || n === "gnumakefile" || n === "justfile") return "var(--icon-file-build)";
  if (n === "gemfile" || n === "rakefile") return "var(--icon-file-ruby)";
  if (n.startsWith(".git") || n.startsWith(".docker") || n === ".editorconfig" || n === ".npmrc")
    return "var(--icon-file-config)";
  if (n === ".env" || n.startsWith(".env.")) return "var(--icon-file-config)";

  switch (e) {
    case "ts":
    case "tsx":
      return "var(--icon-file-ts)";
    case "js":
    case "jsx":
    case "mjs":
    case "cjs":
      return "var(--icon-file-js)";
    case "json":
    case "jsonc":
      return "var(--icon-file-json)";
    case "rs":
      return "var(--icon-file-rust)";
    case "html":
    case "htm":
      return "var(--icon-file-html)";
    case "css":
    case "scss":
    case "sass":
      return "var(--icon-file-css)";
    case "md":
    case "mdx":
      return "var(--icon-file-md)";
    case "yaml":
    case "yml":
      return "var(--icon-file-yaml)";
    case "toml":
      return "var(--icon-file-toml)";
    case "py":
      return "var(--icon-file-python)";
    case "go":
      return "var(--icon-file-go)";
    case "sh":
    case "bash":
    case "zsh":
      return "var(--icon-file-shell)";
    case "lock":
      return "var(--icon-file-config)";
    case "svg":
      return "var(--icon-file-svg)";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "ico":
      return "var(--icon-file-image)";
    case "wasm":
      return "var(--icon-file-wasm)";
    default:
      return "var(--icon-file-default)";
  }
}

export function getFileIconGlyph(
  name: string,
  ext?: string,
  isDir = false,
  expanded = false,
): string {
  if (isDir)
    return expanded
      ? "\uf115"
      : (NERD_DIRECTORY_ICONS[name] ?? NERD_DIRECTORY_ICONS[name.toLowerCase()] ?? "\ue5ff");

  const n = name.toLowerCase();
  const e = ext ?? (name.includes(".") ? name.split(".").pop()!.toLowerCase() : "");
  if (n.startsWith(".env.")) return NERD_EXTENSION_ICONS.env ?? "\uf462";
  return NERD_FILENAME_ICONS[name] ?? NERD_FILENAME_ICONS[n] ?? NERD_EXTENSION_ICONS[e] ?? "\uf15b";
}

const NERD_FONT_TEST_GLYPH = "\ue7a8";
const nerdFontSupportCache = new Map<string, boolean>();

export function supportsNerdFontGlyphs(): boolean {
  if (typeof document === "undefined") return false;

  const fontFamily =
    getComputedStyle(document.body).getPropertyValue("--font-ui").trim() ||
    getComputedStyle(document.body).fontFamily;
  const cacheKey = fontFamily || "default";
  const cached = nerdFontSupportCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return false;

  canvas.width = 48;
  canvas.height = 48;

  const drawGlyph = (glyph: string) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000";
    context.textBaseline = "top";
    context.font = `28px ${fontFamily}`;
    context.fillText(glyph, 8, 8);
    return Array.from(context.getImageData(0, 0, canvas.width, canvas.height).data);
  };

  const glyphPixels = drawGlyph(NERD_FONT_TEST_GLYPH);
  const replacementPixels = drawGlyph("\ufffd");
  const boxPixels = drawGlyph("\u25a1");
  const glyphWidth = context.measureText(NERD_FONT_TEST_GLYPH).width;

  const differsFrom = (other: number[]) =>
    glyphPixels.some((value, index) => value !== other[index]);
  const hasInk = glyphPixels.some((value, index) => index % 4 === 3 && value > 0);
  const supported =
    glyphWidth > 0 && hasInk && differsFrom(replacementPixels) && differsFrom(boxPixels);
  nerdFontSupportCache.set(cacheKey, supported);
  return supported;
}

// ── 文件类型扩展名集合 ────────────────────────────────────────────────────────

export const CODE_EXTS = new Set([
  "ts",
  "tsx",
  "js",
  "jsx",
  "rs",
  "py",
  "go",
  "java",
  "c",
  "cpp",
  "h",
  "css",
  "html",
  "vue",
  "svelte",
  "swift",
  "kt",
]);
