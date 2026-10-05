import type { Theme } from "./types";

export const DEFAULT_THEME: Theme = {
  primary: "#1658f5",
  dark: "#071a45",
  text: "#0c1b3a",
  muted: "#5b6b8c",
};

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
type Shade = (typeof SHADES)[number];

// Thang màu gốc trong globals.css — giữ nguyên khi người dùng không đổi màu chính.
const ORIGINAL_SCALE: Record<Shade, string> = {
  50: "#eef5ff",
  100: "#dbe9ff",
  200: "#bcd6ff",
  300: "#8ebcff",
  400: "#5a96ff",
  500: "#2f72ff",
  600: "#1658f5",
  700: "#0f44d6",
  800: "#1238a8",
  900: "#0b2a7a",
};

// Tỉ lệ pha với trắng (số dương) hoặc đen (số âm) cho từng sắc độ.
const MIX: Record<Shade, number> = {
  50: 0.07,
  100: 0.15,
  200: 0.28,
  300: 0.45,
  400: 0.68,
  500: 0.86,
  600: 1,
  700: -0.16,
  800: -0.32,
  900: -0.5,
};

export const THEME_PRESETS: { name: string; theme: Theme }[] = [
  { name: "Xanh dương", theme: DEFAULT_THEME },
  { name: "Tím", theme: { ...DEFAULT_THEME, primary: "#6d28d9", dark: "#1e0b3a", text: "#1c1233" } },
  { name: "Xanh lá", theme: { ...DEFAULT_THEME, primary: "#047857", dark: "#05261c", text: "#0f241d" } },
  { name: "Xanh ngọc", theme: { ...DEFAULT_THEME, primary: "#0e7490", dark: "#062a33", text: "#0d2229" } },
  { name: "Cam", theme: { ...DEFAULT_THEME, primary: "#c2410c", dark: "#2a1206", text: "#2a160c" } },
  { name: "Hồng", theme: { ...DEFAULT_THEME, primary: "#be185d", dark: "#2b0717", text: "#2a0f1c" } },
];

export const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: number[]) {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

function mix(hex: string, amount: number) {
  const c = rgb(hex);
  if (amount >= 0) return toHex(c.map((v) => 255 + (v - 255) * amount));
  return toHex(c.map((v) => v * (1 + amount)));
}

/** Màu nhìn thấy khi phủ `fg` với độ đục `alpha` lên nền `bg`. */
export function blend(fg: string, bg: string, alpha: number) {
  const a = rgb(fg);
  const b = rgb(bg);
  return toHex(a.map((v, i) => v * alpha + b[i] * (1 - alpha)));
}

export function brandScale(primary: string): Record<Shade, string> {
  if (!isHex(primary) || primary.toLowerCase() === DEFAULT_THEME.primary) return ORIGINAL_SCALE;
  return Object.fromEntries(SHADES.map((s) => [s, mix(primary, MIX[s])])) as Record<Shade, string>;
}

function luminance(hex: string) {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  if (!isHex(a) || !isHex(b)) return 0;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** CSS ghi đè biến màu của Tailwind. Trả về chuỗi rỗng khi dùng màu mặc định. */
export function themeCss(theme: Theme) {
  const vars: string[] = [];
  if (isHex(theme.primary) && theme.primary.toLowerCase() !== DEFAULT_THEME.primary) {
    const scale = brandScale(theme.primary);
    for (const s of SHADES) vars.push(`--color-brand-${s}:${scale[s]}`);
  }
  if (isHex(theme.dark) && theme.dark.toLowerCase() !== DEFAULT_THEME.dark) vars.push(`--color-navy:${theme.dark}`);
  if (isHex(theme.text) && theme.text.toLowerCase() !== DEFAULT_THEME.text) vars.push(`--color-ink:${theme.text}`);
  if (isHex(theme.muted) && theme.muted.toLowerCase() !== DEFAULT_THEME.muted) vars.push(`--color-muted:${theme.muted}`);
  return vars.length ? `:root{${vars.join(";")}}` : "";
}
