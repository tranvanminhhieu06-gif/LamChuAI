import { DEFAULT_CONTENT, NEW_BLOCK_LAYOUT, NEW_BLOCK_PROPS, newId } from "./defaults";
import type { AnyBlock, BlockType, SiteContent } from "./types";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/** Giữ giá trị đã lưu nếu cùng kiểu với mẫu, ngược lại dùng mẫu. Mảng đối tượng được chuẩn hóa từng phần tử. */
function conform<T>(template: T, value: unknown): T {
  if (Array.isArray(template)) {
    if (!Array.isArray(value)) return template;
    const itemTemplate = template[0];
    if (itemTemplate === undefined) return value.filter(isObj) as T;
    return value.map((v) => conform(itemTemplate, v)) as T;
  }
  if (isObj(template)) {
    const src = isObj(value) ? value : {};
    const out: Obj = {};
    for (const key of Object.keys(template)) out[key] = conform((template as Obj)[key], src[key]);
    return out as T;
  }
  return (typeof value === typeof template ? value : template) as T;
}

// Mẫu phần tử cho các danh sách có thể rỗng ở khối mới (để vẫn chuẩn hóa được phần tử đã lưu).
const ITEM_TEMPLATES: Partial<Record<BlockType, Obj>> = {
  hero: {
    badges: [{ icon: "", title: "", sub: "" }],
    chips: [{ icon: "", label: "" }],
  },
  courses: {
    items: [
      { tag: "", title: "", excerpt: "", sessions: "", price: 0, href: "", image: "", coverTitle: "", coverFrom: "#0b2a7a", coverTo: "#2f72ff" },
    ],
  },
};

function normalizeBlock(raw: unknown): AnyBlock | null {
  if (!isObj(raw) || typeof raw.type !== "string" || !(raw.type in NEW_BLOCK_PROPS)) return null;
  const type = raw.type as BlockType;
  const template = { ...NEW_BLOCK_PROPS[type](), ...ITEM_TEMPLATES[type] };
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : newId(),
    type,
    hidden: raw.hidden === true,
    layout: conform(NEW_BLOCK_LAYOUT[type], raw.layout),
    props: conform(template, raw.props),
  } as AnyBlock;
}

export function normalizeContent(raw: unknown): SiteContent | null {
  if (!isObj(raw) || !Array.isArray(raw.blocks)) return null;
  return {
    version: 1,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
    theme: conform(DEFAULT_CONTENT.theme, raw.theme),
    site: conform(DEFAULT_CONTENT.site, raw.site),
    blocks: raw.blocks.map(normalizeBlock).filter((b): b is AnyBlock => b !== null),
  };
}

/** Chỉ cho phép link an toàn: đường dẫn nội bộ, neo, http(s), mailto, tel. */
export function safeHref(href: string) {
  const v = href.trim();
  if (/^(\/|#|https?:\/\/|mailto:|tel:)/i.test(v)) return v;
  return "#";
}

/** Chỉ cho phép ảnh từ đường dẫn nội bộ hoặc http(s). */
export function safeSrc(src: string) {
  const v = src.trim();
  return /^(\/|https?:\/\/)/i.test(v) ? v : "";
}
