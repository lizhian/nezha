import type React from "react";

export const windowDragRegion = {
  "data-tauri-drag-region": "",
} satisfies { "data-tauri-drag-region": string };

export const windowDragPassthrough = {
  pointerEvents: "none",
} satisfies React.CSSProperties;
