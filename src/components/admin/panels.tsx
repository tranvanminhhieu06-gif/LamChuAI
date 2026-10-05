"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Copy, Eye, EyeOff, GripVertical, Plus, Trash2, TriangleAlert, X } from "lucide-react";
import { blend, brandScale, contrast, THEME_PRESETS } from "@/content/theme";
import type { AnyBlock, BlockLayout, BlockType, Theme } from "@/content/types";
import { ColorField, FieldGroup, IconBtn, inputCls } from "./fields";
import { BACKGROUND_OPTIONS, BLOCK_META, SPACING_OPTIONS } from "./schema";

export const blockTitle = (b: AnyBlock) => {
  const p = b.props as { title?: string; label?: string };
  return (p.title ?? "").split("\n").join(" ").trim();
};

/* ---------------- Danh sách khối ---------------- */

export function BlockList({
  blocks,
  selectedId,
  onSelect,
  onMove,
  onToggle,
  onDuplicate,
  onDelete,
  onAdd,
}: {
  blocks: AnyBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onToggle: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  const [drag, setDrag] = useState<{ from: number; over: number } | null>(null);

  return (
    <div className="p-4">
      <p className="mb-3 text-xs text-slate-500">
        Kéo <GripVertical className="inline size-3.5" aria-hidden /> hoặc dùng mũi tên để đổi thứ tự. Bấm vào khối (ở đây hoặc trong
        khung xem trước) để sửa.
      </p>
      <ol className="space-y-2">
        {blocks.map((b, i) => {
          const meta = BLOCK_META[b.type];
          const Icon = meta.icon;
          const active = b.id === selectedId;
          const showLine = drag && drag.over === i && drag.from !== i;
          return (
            <li
              key={b.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                setDrag({ from: i, over: i });
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (drag && drag.over !== i) setDrag({ ...drag, over: i });
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (drag && drag.from !== i) onMove(drag.from, i);
                setDrag(null);
              }}
              onDragEnd={() => setDrag(null)}
              className={`group flex items-center gap-1 rounded-xl border bg-white pr-1 transition ${
                active ? "border-brand-500 ring-2 ring-brand-500/20" : "border-slate-200 hover:border-slate-300"
              } ${showLine ? (drag!.from < i ? "border-b-4 border-b-brand-500" : "border-t-4 border-t-brand-500") : ""} ${
                drag?.from === i ? "opacity-50" : ""
              }`}
            >
              <span className="grid h-14 w-6 shrink-0 cursor-grab place-items-center text-slate-300 group-hover:text-slate-500" aria-hidden>
                <GripVertical className="size-4" />
              </span>
              <button type="button" onClick={() => onSelect(b.id)} className="flex min-w-0 flex-1 items-center gap-3 py-2 text-left">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                    b.hidden ? "bg-slate-100 text-slate-400" : "bg-brand-50 text-brand-600"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className={`block truncate text-sm font-semibold ${b.hidden ? "text-slate-400 line-through" : "text-slate-900"}`}>
                    {meta.label}
                  </span>
                  <span className="block truncate text-xs text-slate-500">{blockTitle(b) || "—"}</span>
                </span>
              </button>
              <div className="flex shrink-0 opacity-70 group-hover:opacity-100">
                <IconBtn label="Lên trên" onClick={() => onMove(i, i - 1)} disabled={i === 0}>
                  <ChevronUp className="size-4" />
                </IconBtn>
                <IconBtn label="Xuống dưới" onClick={() => onMove(i, i + 1)} disabled={i === blocks.length - 1}>
                  <ChevronDown className="size-4" />
                </IconBtn>
                <IconBtn label={b.hidden ? "Hiện khối" : "Ẩn khối"} onClick={() => onToggle(b.id)}>
                  {b.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </IconBtn>
                <IconBtn label="Nhân bản" onClick={() => onDuplicate(b.id)}>
                  <Copy className="size-4" />
                </IconBtn>
                <IconBtn label="Xóa khối" danger onClick={() => onDelete(b.id)}>
                  <Trash2 className="size-4" />
                </IconBtn>
              </div>
            </li>
          );
        })}
      </ol>
      {blocks.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Trang chưa có khối nào.</p>}
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-300 text-sm font-semibold text-brand-700 hover:border-brand-500 hover:bg-brand-50"
      >
        <Plus className="size-5" aria-hidden /> Thêm khối
      </button>
    </div>
  );
}

/* ---------------- Sửa một khối ---------------- */

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-xs font-semibold text-slate-600">{label}</legend>
      <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value)}
            className={`min-h-9 flex-1 rounded-md px-2 text-xs font-semibold whitespace-nowrap transition ${
              o.value === value ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const BG_SWATCH: Record<string, string> = {
  white: "bg-white",
  soft: "bg-gradient-to-b from-brand-50 to-brand-100",
  brand: "bg-gradient-to-br from-brand-700 to-brand-500",
  deep: "bg-gradient-to-r from-brand-900 to-brand-600",
  dark: "bg-navy",
};

export function BlockEditor({
  block,
  onBack,
  onProps,
  onLayout,
  anchorTaken,
}: {
  block: AnyBlock;
  onBack: () => void;
  onProps: (key: string, value: unknown, coalesce: boolean) => void;
  onLayout: (patch: Partial<BlockLayout>, coalesce: boolean) => void;
  anchorTaken: (anchor: string) => boolean;
}) {
  const meta = BLOCK_META[block.type];
  const [tab, setTab] = useState<"content" | "layout">("content");
  const anchorId = useId();
  const L = block.layout;
  const has = (k: (typeof meta.layout)[number]) => meta.layout.includes(k);
  const anchorConflict = L.anchor && anchorTaken(L.anchor);

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 pt-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="size-4" aria-hidden /> Tất cả khối
        </button>
        <h2 className="mt-1 text-base font-bold text-slate-900">{meta.label}</h2>
        <div role="tablist" className="mt-2 flex gap-4">
          {(
            [
              ["content", "Nội dung"],
              ["layout", "Bố cục"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              role="tab"
              type="button"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`-mb-px border-b-2 pb-2 text-sm font-semibold ${
                tab === k ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {tab === "content" ? (
          <FieldGroup fields={meta.fields} value={block.props as Record<string, unknown>} onChange={onProps} />
        ) : (
          <div className="space-y-5">
            {has("background") && (
              <fieldset>
                <legend className="mb-1 text-xs font-semibold text-slate-600">Nền</legend>
                <div className="grid grid-cols-5 gap-2">
                  {BACKGROUND_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={L.background === o.value}
                      onClick={() => onLayout({ background: o.value }, false)}
                      className="group text-center"
                    >
                      <span
                        className={`relative block h-10 rounded-lg border ${BG_SWATCH[o.value]} ${
                          L.background === o.value ? "border-brand-600 ring-2 ring-brand-500/40" : "border-slate-300"
                        }`}
                      >
                        {L.background === o.value && (
                          <Check className={`absolute inset-0 m-auto size-4 ${o.value === "white" || o.value === "soft" ? "text-brand-700" : "text-white"}`} aria-hidden />
                        )}
                      </span>
                      <span className="mt-1 block text-[11px] leading-tight text-slate-600">{o.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {has("spacing") && (
              <Segmented label="Khoảng cách trên/dưới" value={L.spacing} options={SPACING_OPTIONS} onChange={(v) => onLayout({ spacing: v }, false)} />
            )}
            {has("align") && (
              <Segmented
                label="Căn tiêu đề"
                value={L.align}
                options={[
                  { value: "left", label: "Trái" },
                  { value: "center", label: "Giữa" },
                ]}
                onChange={(v) => onLayout({ align: v }, false)}
              />
            )}
            {has("columns") && meta.columns && (
              <Segmented
                label="Số cột (màn hình lớn)"
                value={L.columns}
                options={meta.columns.map((c) => ({ value: c, label: `${c} cột` }))}
                onChange={(v) => onLayout({ columns: v }, false)}
              />
            )}
            {has("anchor") && (
              <div>
                <label htmlFor={anchorId} className="mb-1 block text-xs font-semibold text-slate-600">
                  Tên neo (id)
                </label>
                <input
                  id={anchorId}
                  className={inputCls}
                  placeholder="vd: lo-trinh"
                  value={L.anchor}
                  onChange={(e) =>
                    onLayout(
                      {
                        anchor: e.target.value
                          .normalize("NFD")
                          .replace(/[̀-ͯ]/g, "")
                          .replace(/đ/gi, "d")
                          .toLowerCase()
                          .replace(/[^a-z0-9-]+/g, "-"),
                      },
                      true,
                    )
                  }
                />
                <p className={`mt-1 text-xs ${anchorConflict ? "font-semibold text-rose-600" : "text-slate-500"}`}>
                  {anchorConflict
                    ? "Tên neo này đang được khối khác dùng — hãy đặt tên khác."
                    : `Dùng trong menu để cuộn tới khối: /#${L.anchor || "ten-neo"}`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Màu sắc ---------------- */

export function ThemePanel({ theme, onChange }: { theme: Theme; onChange: (patch: Partial<Theme>, coalesce: boolean) => void }) {
  const scale = brandScale(theme.primary);
  const checks = [
    { label: "Chữ trắng trên nút / nền thương hiệu", ratio: contrast("#ffffff", scale[600]), min: 4.5 },
    { label: "Chữ trắng ở đầu sáng của nền gradient", ratio: contrast("#ffffff", scale[500]), min: 3 },
    { label: "Tiêu đề trên nền trắng", ratio: contrast(scale[900], "#ffffff"), min: 4.5 },
    { label: "Chữ chính trên nền trắng", ratio: contrast(theme.text, "#ffffff"), min: 4.5 },
    { label: "Chữ phụ trên nền trắng", ratio: contrast(theme.muted, "#ffffff"), min: 4.5 },
    // Nền "Nhạt" là gradient brand-50 → brand-100 đục 60% trên nền trắng; lấy điểm đậm nhất.
    { label: "Chữ phụ trên nền nhạt", ratio: contrast(theme.muted, blend(scale[100], "#ffffff", 0.6)), min: 4.5 },
    { label: "Chữ trắng trên nền tối / footer", ratio: contrast("#ffffff", theme.dark), min: 4.5 },
  ];
  const fails = checks.filter((c) => c.ratio < c.min).length;

  return (
    <div className="space-y-6 p-4">
      <section>
        <h3 className="mb-2 text-sm font-bold text-slate-900">Bộ màu có sẵn</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEME_PRESETS.map((p) => {
            const active = p.theme.primary === theme.primary && p.theme.dark === theme.dark;
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(p.theme, false)}
                className={`flex items-center gap-2 rounded-lg border p-2 text-left text-xs font-semibold ${
                  active ? "border-brand-600 ring-2 ring-brand-500/30" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="flex shrink-0 overflow-hidden rounded-md">
                  <span className="size-5" style={{ background: p.theme.primary }} />
                  <span className="size-5" style={{ background: p.theme.dark }} />
                </span>
                {p.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Tùy chỉnh</h3>
        <ColorField id="theme-primary" label="Màu thương hiệu (nút, điểm nhấn)" value={theme.primary} onChange={(v, c) => onChange({ primary: String(v) }, c)} />
        <div className="flex h-6 overflow-hidden rounded-md" aria-label="Thang màu tạo ra từ màu thương hiệu">
          {Object.entries(scale).map(([k, v]) => (
            <span key={k} className="flex-1" style={{ background: v }} title={`${k}: ${v}`} />
          ))}
        </div>
        <ColorField id="theme-dark" label="Nền tối (chân trang)" value={theme.dark} onChange={(v, c) => onChange({ dark: String(v) }, c)} />
        <ColorField id="theme-text" label="Chữ chính" value={theme.text} onChange={(v, c) => onChange({ text: String(v) }, c)} />
        <ColorField id="theme-muted" label="Chữ phụ" value={theme.muted} onChange={(v, c) => onChange({ muted: String(v) }, c)} />
      </section>

      <section>
        <h3 className="mb-1 text-sm font-bold text-slate-900">Độ tương phản (WCAG)</h3>
        <p className={`mb-2 text-xs ${fails ? "text-amber-700" : "text-emerald-700"}`}>
          {fails ? `${fails} cặp màu khó đọc — nên chọn màu đậm hơn.` : "Tất cả cặp màu đều dễ đọc."}
        </p>
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 text-xs">
          {checks.map((c) => {
            const ok = c.ratio >= c.min;
            return (
              <li key={c.label} className="flex items-center gap-2 px-3 py-2">
                {ok ? <Check className="size-4 shrink-0 text-emerald-600" aria-hidden /> : <TriangleAlert className="size-4 shrink-0 text-amber-600" aria-hidden />}
                <span className="flex-1 text-slate-700">{c.label}</span>
                <span className={`font-mono font-semibold ${ok ? "text-slate-500" : "text-amber-700"}`}>
                  {c.ratio.toFixed(1)}:1
                  <span className="sr-only">{ok ? " đạt" : ` chưa đạt, cần ${c.min}:1`}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* ---------------- Thêm khối ---------------- */

export function AddBlockDialog({ onPick, onClose }: { onPick: (type: BlockType) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="add-block-title"
      className="m-auto w-[min(720px,calc(100vw-32px))] rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/50"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 id="add-block-title" className="text-lg font-bold text-slate-900">
          Thêm khối
        </h2>
        <IconBtn label="Đóng" onClick={onClose}>
          <X className="size-5" />
        </IconBtn>
      </div>
      <ul className="grid max-h-[70vh] gap-3 overflow-y-auto p-5 sm:grid-cols-2">
        {(Object.keys(BLOCK_META) as BlockType[]).map((type) => {
          const m = BLOCK_META[type];
          const Icon = m.icon;
          return (
            <li key={type}>
              <button
                type="button"
                onClick={() => onPick(type)}
                className="flex h-full w-full items-start gap-3 rounded-xl border border-slate-200 p-4 text-left hover:border-brand-400 hover:bg-brand-50/50"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-slate-900">{m.label}</span>
                  <span className="mt-0.5 block text-sm text-slate-500">{m.desc}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </dialog>
  );
}
