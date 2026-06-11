import { invoke } from "@tauri-apps/api/core";

let cachedFonts: string[] | null = null;

const CSS_GENERIC_FONT_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "emoji",
  "math",
  "fangsong",
]);

export async function loadSystemFonts(): Promise<string[]> {
  if (cachedFonts) return cachedFonts;

  try {
    const fonts = await invoke<string[]>("get_system_fonts");
    cachedFonts = fonts;
    return fonts;
  } catch {
    return [];
  }
}

export function parseFirstFontName(stack: string): string {
  const first = splitFontFamilyStack(stack)[0]?.trim() ?? "";
  if (!first) return "";

  // Strip surrounding quotes
  if (
    (first.startsWith('"') && first.endsWith('"')) ||
    (first.startsWith("'") && first.endsWith("'"))
  ) {
    return first.slice(1, -1);
  }
  return first;
}

export function normalizeCssFontFamily(stack: string): string {
  return splitFontFamilyStack(stack)
    .map((name) => quoteCssFontFamilyName(name))
    .filter(Boolean)
    .join(", ");
}

export function quoteCssFontFamilyName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed;
  }
  if (CSS_GENERIC_FONT_FAMILIES.has(trimmed.toLowerCase())) return trimmed;
  return `"${trimmed.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function splitFontFamilyStack(stack: string): string[] {
  const result: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (const char of stack) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }
    if ((char === '"' || char === "'") && !quote) {
      quote = char;
      current += char;
      continue;
    }
    if (quote && char === quote) {
      quote = null;
      current += char;
      continue;
    }
    if (!quote && char === ",") {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  result.push(current.trim());
  return result.filter(Boolean);
}

export function filterFonts(fonts: string[], query: string): string[] {
  if (!query) return fonts;
  const q = query.toLowerCase();

  const exact: string[] = [];
  const startsWith: string[] = [];
  const contains: string[] = [];

  for (const f of fonts) {
    const lower = f.toLowerCase();
    if (lower === q) exact.push(f);
    else if (lower.startsWith(q)) startsWith.push(f);
    else if (lower.includes(q)) contains.push(f);
  }

  return [...exact, ...startsWith, ...contains];
}
