"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  CloudUpload,
  Download,
  ExternalLink,
  History,
  Loader2,
  LogOut,
  Monitor,
  MoreHorizontal,
  Redo2,
  RotateCcw,
  Smartphone,
  Tablet,
  Undo2,
  Upload,
  WifiOff,
  X,
} from "lucide-react";
import { createBlock, DEFAULT_CONTENT, newId } from "@/content/defaults";
import { normalizeContent } from "@/content/normalize";
import { themeCss } from "@/content/theme";
import type { AnyBlock, BlockType, SiteContent } from "@/content/types";
import * as api from "./api";
import { AdminEnv, FieldGroup, IconBtn, inputCls } from "./fields";
import { AddBlockDialog, BlockEditor, BlockList, ThemePanel } from "./panels";
import { PreviewFrame, type Device } from "./PreviewFrame";
import { SITE_FIELDS } from "./schema";

const DRAFT_KEY = "lca:draft";

const sameContent = (a: SiteContent, b: SiteContent) =>
  JSON.stringify({ ...a, updatedAt: undefined }) === JSON.stringify({ ...b, updatedAt: undefined });

/* ---------------- Lịch sử hoàn tác ---------------- */

type Hist = { past: SiteContent[]; present: SiteContent; future: SiteContent[]; key: string; at: number };

function useHistory(initial: SiteContent) {
  const [h, setH] = useState<Hist>({ past: [], present: initial, future: [], key: "", at: 0 });
  /** key khác rỗng: các thay đổi liên tiếp cùng key trong 1 giây được gộp thành một bước hoàn tác. */
  const update = useCallback((fn: (c: SiteContent) => SiteContent, key = "") => {
    setH((s) => {
      const next = fn(s.present);
      if (next === s.present) return s;
      const now = Date.now();
      const merge = key !== "" && key === s.key && now - s.at < 1000;
      return { past: merge ? s.past : [...s.past.slice(-80), s.present], present: next, future: [], key, at: now };
    });
  }, []);
  const undo = useCallback(
    () => setH((s) => (s.past.length ? { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future], key: "", at: 0 } : s)),
    [],
  );
  const redo = useCallback(
    () => setH((s) => (s.future.length ? { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1), key: "", at: 0 } : s)),
    [],
  );
  return { content: h.present, update, undo, redo, canUndo: h.past.length > 0, canRedo: h.future.length > 0 };
}

/* ---------------- Ứng dụng ---------------- */

export function AdminApp() {
  const [status, setStatus] = useState<api.ServerStatus | null>(null);

  const refresh = useCallback(() => {
    api.getStatus().then(setStatus);
  }, []);
  useEffect(refresh, [refresh]);

  if (!status) return <Centered>Đang kết nối…</Centered>;
  if (status.mode === "online" && !status.configured) return <NotConfigured />;
  if (status.mode === "online" && !status.loggedIn) return <LoginScreen onDone={refresh} />;
  return <Loader online={status.mode === "online"} onLoggedOut={refresh} />;
}

function Loader({ online, onLoggedOut }: { online: boolean; onLoggedOut: () => void }) {
  const [init, setInit] = useState<{ published: SiteContent | null; draft: { content: SiteContent; savedAt: string } | null } | null>(null);
  useEffect(() => {
    (async () => {
      const published = online ? await api.getPublished() : null;
      let draft = null;
      try {
        const raw = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
        const content = normalizeContent(raw?.content);
        if (content) draft = { content, savedAt: String(raw.savedAt ?? "") };
      } catch {}
      setInit({ published, draft });
    })();
  }, [online]);
  if (!init) return <Centered>Đang tải nội dung…</Centered>;
  return <Editor online={online} initial={init} onLoggedOut={onLoggedOut} />;
}

type Toast = { id: number; msg: string; tone: "ok" | "error"; action?: { label: string; run: () => void } };
type Tab = "blocks" | "theme" | "site";

function Editor({
  online,
  initial,
  onLoggedOut,
}: {
  online: boolean;
  initial: { published: SiteContent | null; draft: { content: SiteContent; savedAt: string } | null };
  onLoggedOut: () => void;
}) {
  const [published, setPublished] = useState(initial.published);
  const base = published ?? DEFAULT_CONTENT;
  const startWithDraft = !!initial.draft && !sameContent(initial.draft.content, base);
  const { content, update, undo, redo, canUndo, canRedo } = useHistory(startWithDraft ? initial.draft!.content : base);

  const [tab, setTab] = useState<Tab>("blocks");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [scrollToken, setScrollToken] = useState(0);
  const [device, setDevice] = useState<Device>("desktop");
  const [adding, setAdding] = useState(false);
  const [menu, setMenu] = useState(false);
  const [backups, setBackups] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [draftNotice, setDraftNotice] = useState(startWithDraft ? initial.draft!.savedAt : "");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const importRef = useRef<HTMLInputElement>(null);

  const dirty = useMemo(() => !sameContent(content, base), [content, base]);

  const notify = useCallback((msg: string, tone: "ok" | "error" = "ok", action?: Toast["action"]) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), action ? 7000 : 3500);
  }, []);

  // Tự lưu nháp trên trình duyệt này.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (dirty) localStorage.setItem(DRAFT_KEY, JSON.stringify({ content, savedAt: new Date().toISOString() }));
        else localStorage.removeItem(DRAFT_KEY);
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [content, dirty]);

  // Ctrl+Z / Ctrl+Shift+Z khi không gõ trong ô nhập.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return;
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z" && e.key.toLowerCase() !== "y") return;
      e.preventDefault();
      if (e.key.toLowerCase() === "y" || e.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  /* ----- thao tác với khối ----- */

  const setBlocks = (fn: (b: AnyBlock[]) => AnyBlock[], key = "") => update((c) => ({ ...c, blocks: fn(c.blocks) }), key);
  const patchBlock = (id: string, fn: (b: AnyBlock) => AnyBlock, key = "") => setBlocks((bs) => bs.map((b) => (b.id === id ? fn(b) : b)), key);

  const select = useCallback((id: string, scroll: boolean) => {
    setSelectedId(id);
    setEditing(true);
    setTab("blocks");
    if (scroll) setScrollToken((n) => n + 1);
  }, []);
  const selectFromPreview = useCallback((id: string) => select(id, false), [select]);

  function addBlock(type: BlockType) {
    const block = createBlock(type) as AnyBlock;
    setBlocks((bs) => {
      // Chèn ngay sau khối đang chọn, không có thì thêm cuối trang.
      const idx = bs.findIndex((b) => b.id === selectedId);
      const at = idx >= 0 ? idx + 1 : bs.length;
      return [...bs.slice(0, at), block, ...bs.slice(at)];
    });
    setAdding(false);
    select(block.id, true);
  }

  function deleteBlock(id: string) {
    const b = content.blocks.find((x) => x.id === id);
    setBlocks((bs) => bs.filter((x) => x.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setEditing(false);
    }
    notify(`Đã xóa khối “${b ? (b.props as { title?: string }).title?.split("\n")[0] || b.type : ""}”`, "ok", { label: "Hoàn tác", run: undo });
  }

  function duplicateBlock(id: string) {
    const i = content.blocks.findIndex((b) => b.id === id);
    if (i < 0) return;
    const copy = { ...structuredClone(content.blocks[i]), id: newId() };
    copy.layout.anchor = "";
    setBlocks((bs) => [...bs.slice(0, i + 1), copy, ...bs.slice(i + 1)]);
    select(copy.id, true);
  }

  function moveBlock(from: number, to: number) {
    if (to < 0 || to >= content.blocks.length) return;
    setBlocks((bs) => {
      const next = [...bs];
      const [b] = next.splice(from, 1);
      next.splice(to, 0, b);
      return next;
    });
  }

  /* ----- xuất bản, nhập/xuất ----- */

  async function publish() {
    setPublishing(true);
    try {
      const { updatedAt } = await api.save(content);
      setPublished({ ...content, updatedAt });
      setDraftNotice("");
      notify("Đã xuất bản. Khách truy cập sẽ thấy nội dung mới.");
    } catch (e) {
      if (e instanceof api.ApiError && e.status === 401) {
        notify("Phiên đăng nhập đã hết hạn. Bản nháp vẫn được giữ — hãy đăng nhập lại.", "error");
        onLoggedOut();
      } else notify(e instanceof Error ? e.message : "Xuất bản thất bại", "error");
    } finally {
      setPublishing(false);
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `noi-dung-trang-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importJson(file: File | undefined) {
    if (!file) return;
    try {
      const data = normalizeContent(JSON.parse(await file.text()));
      if (!data) throw new Error();
      update(() => data);
      notify("Đã nhập nội dung. Kiểm tra rồi bấm Xuất bản.", "ok", { label: "Hoàn tác", run: undo });
    } catch {
      notify("File không đúng định dạng nội dung trang.", "error");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  const selected = content.blocks.find((b) => b.id === selectedId) ?? null;
  const css = themeCss(content.theme);

  return (
    <AdminEnv.Provider value={{ online, notify }}>
      {css && <style>{css}</style>}
      <div className="flex h-dvh flex-col bg-slate-100 text-slate-900">
        {/* ----- thanh công cụ ----- */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 sm:px-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">Quản trị trang chủ</p>
            <p className="truncate text-xs text-slate-500">
              {!online
                ? "Chế độ ngoại tuyến"
                : dirty
                  ? "Có thay đổi chưa xuất bản · đã lưu nháp"
                  : published
                    ? "Đã xuất bản, không có thay đổi"
                    : "Đang dùng nội dung mặc định"}
            </p>
          </div>

          <div className="hidden items-center gap-1 rounded-lg bg-slate-100 p-1 lg:flex" role="group" aria-label="Kích thước xem trước">
            {(
              [
                ["desktop", Monitor, "Máy tính"],
                ["tablet", Tablet, "Máy tính bảng"],
                ["mobile", Smartphone, "Điện thoại"],
              ] as const
            ).map(([d, Icon, label]) => (
              <button
                key={d}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={device === d}
                onClick={() => setDevice(d)}
                className={`grid size-8 place-items-center rounded-md ${device === d ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>

          <IconBtn label="Hoàn tác (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
            <Undo2 className="size-4" />
          </IconBtn>
          <IconBtn label="Làm lại (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}>
            <Redo2 className="size-4" />
          </IconBtn>
          <a href="/" target="_blank" rel="noreferrer" className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:inline-flex">
            <ExternalLink className="size-4" aria-hidden /> Xem trang
          </a>

          <div className="relative">
            <IconBtn label="Thêm thao tác" onClick={() => setMenu((v) => !v)}>
              <MoreHorizontal className="size-5" />
            </IconBtn>
            {menu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenu(false)} aria-hidden />
                <div role="menu" className="absolute right-0 z-40 mt-1 w-60 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-xl" onClick={() => setMenu(false)}>
                  <MenuItem icon={Download} onClick={exportJson}>Tải nội dung (JSON)</MenuItem>
                  <MenuItem icon={Upload} onClick={() => importRef.current?.click()}>Nhập nội dung từ JSON</MenuItem>
                  {online && <MenuItem icon={History} onClick={() => setBackups(true)}>Phiên bản đã xuất bản</MenuItem>}
                  <MenuItem
                    icon={RotateCcw}
                    onClick={() => {
                      update(() => DEFAULT_CONTENT);
                      notify("Đã khôi phục nội dung mặc định.", "ok", { label: "Hoàn tác", run: undo });
                    }}
                  >
                    Khôi phục mặc định
                  </MenuItem>
                  {online && (
                    <MenuItem
                      icon={LogOut}
                      onClick={async () => {
                        await api.logout().catch(() => {});
                        onLoggedOut();
                      }}
                    >
                      Đăng xuất
                    </MenuItem>
                  )}
                </div>
              </>
            )}
          </div>
          <input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => importJson(e.target.files?.[0])} />

          <button
            type="button"
            onClick={publish}
            disabled={!online || !dirty || publishing}
            title={!online ? "Cần kết nối máy chủ để xuất bản" : undefined}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {publishing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CloudUpload className="size-4" aria-hidden />}
            Xuất bản
          </button>
        </header>

        {!online && (
          <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            <WifiOff className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Không kết nối được máy chủ (đang chạy trên máy hoặc chưa tải thư mục <code>api</code> lên hosting). Bạn vẫn chỉnh sửa
              được, bản nháp lưu trên trình duyệt này; dùng “Tải nội dung (JSON)” để sao lưu.
            </p>
          </div>
        )}
        {draftNotice && (
          <div className="flex items-center gap-3 border-b border-sky-200 bg-sky-50 px-4 py-2 text-xs text-sky-900">
            <p className="flex-1">
              Đang mở bản nháp chưa xuất bản{draftNotice && ` (lưu lúc ${new Date(draftNotice).toLocaleString("vi-VN")})`}.
            </p>
            <button
              type="button"
              className="font-semibold underline"
              onClick={() => {
                update(() => base);
                setDraftNotice("");
              }}
            >
              Bỏ nháp, mở bản đang chạy
            </button>
            <IconBtn label="Đóng thông báo" onClick={() => setDraftNotice("")}>
              <X className="size-4" />
            </IconBtn>
          </div>
        )}

        {/* ----- vùng làm việc ----- */}
        <div className="grid min-h-0 flex-1 lg:grid-cols-[420px_1fr]">
          <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            <div role="tablist" className="flex shrink-0 border-b border-slate-200 px-2">
              {(
                [
                  ["blocks", "Khối"],
                  ["theme", "Màu sắc"],
                  ["site", "Thông tin chung"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  role="tab"
                  type="button"
                  aria-selected={tab === k}
                  onClick={() => {
                    setTab(k);
                    if (k === "blocks") setEditing(false);
                  }}
                  className={`-mb-px border-b-2 px-3 py-3 text-sm font-semibold ${
                    tab === k ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {l}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setMobilePreview(true)}
                className="ml-auto self-center rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 lg:hidden"
              >
                Xem trước
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {tab === "blocks" &&
                (editing && selected ? (
                  <BlockEditor
                    key={selected.id}
                    block={selected}
                    onBack={() => setEditing(false)}
                    onProps={(k, v, c) =>
                      patchBlock(selected.id, (b) => ({ ...b, props: { ...b.props, [k]: v } }) as AnyBlock, c ? `${selected.id}.${k}` : "")
                    }
                    onLayout={(patch, c) =>
                      patchBlock(selected.id, (b) => ({ ...b, layout: { ...b.layout, ...patch } }), c ? `${selected.id}.layout` : "")
                    }
                    anchorTaken={(a) => content.blocks.some((b) => b.id !== selected.id && b.layout.anchor === a)}
                  />
                ) : (
                  <BlockList
                    blocks={content.blocks}
                    selectedId={selectedId}
                    onSelect={(id) => select(id, true)}
                    onMove={moveBlock}
                    onToggle={(id) => patchBlock(id, (b) => ({ ...b, hidden: !b.hidden }))}
                    onDuplicate={duplicateBlock}
                    onDelete={deleteBlock}
                    onAdd={() => setAdding(true)}
                  />
                ))}
              {tab === "theme" && (
                <ThemePanel theme={content.theme} onChange={(patch, c) => update((s) => ({ ...s, theme: { ...s.theme, ...patch } }), c ? "theme" : "")} />
              )}
              {tab === "site" && (
                <div className="p-4">
                  <FieldGroup
                    fields={SITE_FIELDS}
                    value={content.site as unknown as Record<string, unknown>}
                    onChange={(k, v, c) => update((s) => ({ ...s, site: { ...s.site, [k]: v } }), c ? `site.${k}` : "")}
                  />
                </div>
              )}
            </div>
          </aside>

          <main
            className={`min-h-0 ${mobilePreview ? "fixed inset-0 z-40 flex flex-col bg-slate-100" : "hidden"} lg:static lg:block`}
            aria-label="Xem trước"
          >
            {mobilePreview && (
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 lg:hidden">
                <span className="text-sm font-semibold">Xem trước</span>
                <button type="button" onClick={() => setMobilePreview(false)} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                  Quay lại chỉnh sửa
                </button>
              </div>
            )}
            <div className="min-h-0 flex-1 lg:h-full">
              <PreviewFrame
                content={content}
                selectedId={selectedId}
                scrollToken={scrollToken}
                device={mobilePreview ? "mobile" : device}
                onSelect={(id) => {
                  selectFromPreview(id);
                  setMobilePreview(false);
                }}
              />
            </div>
          </main>
        </div>
      </div>

      {adding && <AddBlockDialog onPick={addBlock} onClose={() => setAdding(false)} />}
      {backups && (
        <BackupsDialog
          onClose={() => setBackups(false)}
          onOpen={(c) => {
            update(() => c);
            setBackups(false);
            notify("Đã mở phiên bản cũ trong trình chỉnh sửa. Bấm Xuất bản để dùng lại.", "ok", { label: "Hoàn tác", run: undo });
          }}
        />
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-xl px-4 py-3 text-sm shadow-xl ${
              t.tone === "error" ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
            }`}
          >
            <span>{t.msg}</span>
            {t.action && (
              <button
                type="button"
                className="shrink-0 font-semibold text-sky-300 hover:underline"
                onClick={() => {
                  t.action!.run();
                  setToasts((all) => all.filter((x) => x.id !== t.id));
                }}
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </AdminEnv.Provider>
  );
}

function MenuItem({ icon: Icon, onClick, children }: { icon: typeof Download; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-100">
      <Icon className="size-4 text-slate-500" aria-hidden />
      {children}
    </button>
  );
}

function BackupsDialog({ onClose, onOpen }: { onClose: () => void; onOpen: (c: SiteContent) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<{ name: string; time: string; size: number }[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    ref.current?.showModal();
    api
      .listBackups()
      .then((r) => setItems(r.items))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="backups-title"
      className="m-auto w-[min(520px,calc(100vw-32px))] rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/50"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 id="backups-title" className="text-lg font-bold">
          Phiên bản đã xuất bản
        </h2>
        <IconBtn label="Đóng" onClick={onClose}>
          <X className="size-5" />
        </IconBtn>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-3">
        {error && <p className="p-3 text-sm text-rose-600">{error}</p>}
        {!items && !error && <p className="p-3 text-sm text-slate-500">Đang tải…</p>}
        {items?.length === 0 && <p className="p-3 text-sm text-slate-500">Chưa có phiên bản cũ nào. Mỗi lần xuất bản, bản trước đó sẽ được lưu ở đây.</p>}
        <ul>
          {items?.map((it) => (
            <li key={it.name} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-slate-50">
              <span className="text-sm">{new Date(it.time).toLocaleString("vi-VN")}</span>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                onClick={async () => {
                  try {
                    const c = await api.getBackup(it.name);
                    if (c) onOpen(c);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Không mở được phiên bản này");
                  }
                }}
              >
                Mở
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}

/* ---------------- Đăng nhập ---------------- */

function LoginScreen({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.login(password);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
      setBusy(false);
    }
  }

  return (
    <Centered>
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-6 text-left shadow-xl ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Đăng nhập quản trị</h1>
        <p className="mt-1 text-sm text-slate-500">Nhập mật khẩu đã đặt trong file api/config.php trên hosting.</p>
        <label htmlFor="admin-password" className="mt-5 mb-1 block text-xs font-semibold text-slate-600">
          Mật khẩu
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={inputCls}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p role="alert" className="mt-2 min-h-5 text-sm text-rose-600">
          {error}
        </p>
        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Đăng nhập
        </button>
      </form>
    </Centered>
  );
}

function NotConfigured() {
  return (
    <Centered>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-left shadow-xl ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Cần đặt mật khẩu quản trị</h1>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>
            Mở cPanel → <b>Quản Lý Tệp</b> → thư mục <code>public_html/api/</code>.
          </li>
          <li>
            Sao chép file <code>config.sample.php</code> thành <code>config.php</code> (cùng thư mục).
          </li>
          <li>
            Sửa <code>config.php</code>: thay <code>DOI-MAT-KHAU-NAY</code> bằng mật khẩu của bạn (ít nhất 10 ký tự), rồi lưu.
          </li>
          <li>Tải lại trang này.</li>
        </ol>
      </div>
    </Centered>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-dvh place-items-center bg-slate-100 p-4 text-center text-sm text-slate-500">{children}</div>;
}
