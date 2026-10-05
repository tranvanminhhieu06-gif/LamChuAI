"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Copy, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { ICONS, IconView } from "@/content/icons";
import { safeSrc } from "@/content/normalize";
import { isHex } from "@/content/theme";
import type { LinkValue } from "@/content/types";
import { uploadImage } from "./api";
import type { Field } from "./schema";

/** Thông tin môi trường dùng chung cho các ô nhập. */
export const AdminEnv = createContext<{ online: boolean; notify: (msg: string, tone?: "ok" | "error") => void }>({
  online: false,
  notify: () => {},
});

/** coalesce = true khi đang gõ chữ, để Hoàn tác gộp cả cụm thay vì từng ký tự. */
export type OnChange = (value: unknown, coalesce: boolean) => void;

export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-2 focus:outline-brand-500/30";

function Labeled({ id, label, help, children }: { id: string; label: string; help?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      {children}
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );
}

export function FieldGroup({
  fields,
  value,
  onChange,
}: {
  fields: Field[];
  value: Record<string, unknown>;
  onChange: (key: string, v: unknown, coalesce: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <FieldEditor key={f.key} field={f} value={value[f.key]} onChange={(v, c) => onChange(f.key, v, c)} />
      ))}
    </div>
  );
}

export function FieldEditor({ field, value, onChange }: { field: Field; value: unknown; onChange: OnChange }) {
  const id = useId();
  switch (field.kind) {
    case "text":
      return (
        <Labeled id={id} label={field.label} help={field.help}>
          <input
            id={id}
            className={inputCls}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value, true)}
          />
        </Labeled>
      );
    case "textarea":
      return (
        <Labeled id={id} label={field.label} help={field.help}>
          <textarea
            id={id}
            className={`${inputCls} resize-y`}
            rows={field.rows ?? 3}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value, true)}
          />
        </Labeled>
      );
    case "number":
      return (
        <Labeled id={id} label={field.label} help={field.help}>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            className={inputCls}
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            value={Number(value ?? 0)}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value), true)}
          />
        </Labeled>
      );
    case "select":
      return (
        <Labeled id={id} label={field.label} help={field.help}>
          <select id={id} className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value, false)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Labeled>
      );
    case "link":
      return <LinkField id={id} field={field} value={(value as LinkValue) ?? { label: "", href: "" }} onChange={onChange} />;
    case "icon":
      return <IconField id={id} label={field.label} value={String(value ?? "")} onChange={onChange} />;
    case "color":
      return <ColorField id={id} label={field.label} value={String(value ?? "")} onChange={onChange} />;
    case "image":
      return <ImageField id={id} label={field.label} help={field.help} value={String(value ?? "")} onChange={onChange} />;
    case "list":
      return <ListField field={field} value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []} onChange={onChange} />;
  }
}

function LinkField({ id, field, value, onChange }: { id: string; field: Field; value: LinkValue; onChange: OnChange }) {
  return (
    <fieldset>
      <legend className="mb-1 text-xs font-semibold text-slate-600">{field.label}</legend>
      <div className="grid grid-cols-[1fr_1.3fr] gap-2">
        <input
          id={id}
          aria-label={`${field.label}: chữ trên nút`}
          className={inputCls}
          placeholder="Chữ trên nút"
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value }, true)}
        />
        <input
          aria-label={`${field.label}: link`}
          className={inputCls}
          placeholder="/khoa-hoc/ hoặc https://…"
          value={value.href}
          onChange={(e) => onChange({ ...value, href: e.target.value }, true)}
        />
      </div>
      {field.help && <p className="mt-1 text-xs text-slate-500">{field.help}</p>}
    </fieldset>
  );
}

function IconField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: OnChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <button
        id={id}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm hover:border-brand-400"
      >
        <span className="grid size-7 place-items-center rounded-md bg-brand-600 text-white">
          <IconView name={value} className="size-4" />
        </span>
        {ICONS[value]?.label ?? "Chọn biểu tượng"}
        <ChevronDown className="size-4 text-slate-400" aria-hidden />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 grid w-72 grid-cols-6 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {Object.entries(ICONS).map(([name, { icon: I, label: l }]) => (
            <button
              key={name}
              type="button"
              title={l}
              aria-label={l}
              aria-pressed={name === value}
              onClick={() => {
                onChange(name, false);
                setOpen(false);
              }}
              className={`grid size-10 place-items-center rounded-lg ${
                name === value ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-brand-50"
              }`}
            >
              <I className="size-5" aria-hidden />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: OnChange }) {
  // Ô chữ cho phép gõ dở (#6d2…); đồng bộ lại khi giá trị bên ngoài đổi (chọn bảng màu, hoàn tác).
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setText(value);
  }
  return (
    <Labeled id={id} label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label}: bảng màu`}
          value={isHex(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value, true)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
        />
        <input
          id={id}
          className={`${inputCls} font-mono uppercase`}
          value={text}
          maxLength={7}
          onChange={(e) => {
            const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
            setText(v);
            if (isHex(v)) onChange(v.toLowerCase(), true);
          }}
        />
      </div>
    </Labeled>
  );
}

function ImageField({ id, label, help, value, onChange }: { id: string; label: string; help?: string; value: string; onChange: OnChange }) {
  const { online, notify } = useContext(AdminEnv);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const src = safeSrc(value);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url, false);
      notify("Đã tải ảnh lên");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Tải ảnh thất bại", "error");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Labeled id={id} label={label} help={help}>
      <div className="flex gap-3">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-[10px] text-slate-400">
          {/* eslint-disable-next-line @next/next/no-img-element -- xem trước ảnh do người dùng nhập */}
          {src ? <img src={src} alt="" className="size-full object-cover" /> : "Chưa có"}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={id}
            className={inputCls}
            placeholder="https://… hoặc /uploads/…"
            value={value}
            onChange={(e) => onChange(e.target.value, true)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!online || busy}
              title={online ? undefined : "Cần kết nối máy chủ để tải ảnh"}
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
              Tải ảnh lên
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("", false)}
                className="h-9 rounded-lg px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                Bỏ ảnh
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </Labeled>
  );
}

function ListField({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "list" }>;
  value: Record<string, unknown>[];
  onChange: OnChange;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const full = field.max !== undefined && value.length >= field.max;

  const set = (next: Record<string, unknown>[]) => onChange(next, false);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
    if (open === i) setOpen(j);
  };

  return (
    <fieldset>
      <legend className="mb-1 text-xs font-semibold text-slate-600">
        {field.label} <span className="font-normal text-slate-400">({value.length})</span>
      </legend>
      {field.help && <p className="mb-2 text-xs text-slate-500">{field.help}</p>}
      <ul className="space-y-2">
        {value.map((item, i) => {
          const title = String(item[field.titleKey] ?? "") || `${field.itemLabel} ${i + 1}`;
          const expanded = open === i;
          return (
            <li key={i} className="rounded-lg border border-slate-200 bg-slate-50/60">
              <div className="flex items-center gap-1 pr-1">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex min-h-10 min-w-0 flex-1 items-center gap-2 px-3 text-left text-sm font-medium text-slate-800"
                >
                  <ChevronDown className={`size-4 shrink-0 text-slate-400 transition ${expanded ? "" : "-rotate-90"}`} aria-hidden />
                  <span className="truncate">{title}</span>
                </button>
                <IconBtn label="Lên" onClick={() => move(i, -1)} disabled={i === 0}>
                  <ChevronUp className="size-4" />
                </IconBtn>
                <IconBtn label="Xuống" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                  <ChevronDown className="size-4" />
                </IconBtn>
                <IconBtn label="Nhân bản" onClick={() => set([...value.slice(0, i + 1), structuredClone(item), ...value.slice(i + 1)])} disabled={full}>
                  <Copy className="size-4" />
                </IconBtn>
                <IconBtn label="Xóa" danger onClick={() => { set(value.filter((_, j) => j !== i)); setOpen(null); }}>
                  <Trash2 className="size-4" />
                </IconBtn>
              </div>
              {expanded && (
                <div className="border-t border-slate-200 p-3">
                  <FieldGroup
                    fields={field.fields}
                    value={item}
                    onChange={(k, v, c) => onChange(value.map((it, j) => (j === i ? { ...it, [k]: v } : it)), c)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        disabled={full}
        onClick={() => {
          set([...value, field.create()]);
          setOpen(value.length);
        }}
        className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700 disabled:opacity-50"
      >
        <Plus className="size-4" aria-hidden /> Thêm {field.itemLabel}
        {full && ` (tối đa ${field.max})`}
      </button>
    </fieldset>
  );
}

export function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-8 shrink-0 place-items-center rounded-md transition disabled:opacity-30 ${
        danger ? "text-slate-500 hover:bg-rose-50 hover:text-rose-600" : "text-slate-500 hover:bg-slate-200 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
