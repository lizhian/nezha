import { describe, expect, it } from "vitest";
import { normalizeCssFontFamily, parseFirstFontName, quoteCssFontFamilyName } from "../utils/fonts";

describe("font family helpers", () => {
  it("quotes concrete font family names", () => {
    expect(quoteCssFontFamilyName("JetBrains Mono")).toBe('"JetBrains Mono"');
    expect(quoteCssFontFamilyName("SF Mono")).toBe('"SF Mono"');
    expect(quoteCssFontFamilyName("Family, With Comma")).toBe('"Family, With Comma"');
  });

  it("does not quote generic CSS font families", () => {
    expect(quoteCssFontFamilyName("monospace")).toBe("monospace");
    expect(quoteCssFontFamilyName("ui-monospace")).toBe("ui-monospace");
    expect(quoteCssFontFamilyName("sans-serif")).toBe("sans-serif");
  });

  it("normalizes mixed font stacks", () => {
    expect(normalizeCssFontFamily("JetBrains Mono, Fira Code, ui-monospace, monospace")).toBe(
      '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
    );
  });

  it("preserves already quoted names", () => {
    expect(normalizeCssFontFamily('"SF Pro Display", "PingFang SC", sans-serif')).toBe(
      '"SF Pro Display", "PingFang SC", sans-serif',
    );
  });

  it("parses the first family without splitting inside quotes", () => {
    expect(parseFirstFontName('"Family, With Comma", monospace')).toBe("Family, With Comma");
  });
});
