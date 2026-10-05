"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_CONTENT } from "./defaults";
import { normalizeContent } from "./normalize";
import { themeCss } from "./theme";
import type { SiteContent } from "./types";

export const CONTENT_URL = "/api/content.php";
const CACHE_KEY = "lca:published";

/** Tin nhắn giữa trang /admin và khung xem trước (iframe trỏ tới /?preview=1). */
export type PreviewMessage =
  | { type: "lca:content"; content: SiteContent; selectedId: string | null; scroll?: boolean }
  | { type: "lca:ready" }
  | { type: "lca:select"; id: string };

type Ctx = { content: SiteContent; preview: boolean; selectedId: string | null };
const ContentContext = createContext<Ctx>({ content: DEFAULT_CONTENT, preview: false, selectedId: null });

export const useContent = () => useContext(ContentContext).content;
export const usePreview = () => {
  const { preview, selectedId } = useContext(ContentContext);
  return { preview, selectedId };
};

// Hai giá trị chỉ có ở trình duyệt, đọc qua useSyncExternalStore: lúc build dùng giá trị mặc định,
// khi chạy trên trình duyệt React đổi sang giá trị thật ngay sau hydrate.
const noSubscribe = () => () => {};
const readIsPreview = () => window.parent !== window && new URLSearchParams(location.search).has("preview");
const readCacheRaw = () => {
  try {
    return localStorage.getItem(CACHE_KEY);
  } catch {
    return null;
  }
};

export function ContentProvider({ children }: { children: ReactNode }) {
  const preview = useSyncExternalStore(noSubscribe, readIsPreview, () => false);
  // Khách quay lại thấy ngay bản đã xuất bản lần trước, không phải chờ tải.
  const cacheRaw = useSyncExternalStore(noSubscribe, readCacheRaw, () => null);
  const cached = useMemo(() => {
    try {
      return cacheRaw ? normalizeContent(JSON.parse(cacheRaw)) : null;
    } catch {
      return null;
    }
  }, [cacheRaw]);
  const [fetched, setFetched] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<{ content: SiteContent; selectedId: string | null } | null>(null);

  useEffect(() => {
    if (preview) return;
    let cancelled = false;
    fetch(CONTENT_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const content = normalizeContent(data);
        if (cancelled || !content) return;
        setFetched(content);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(content));
        } catch {}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [preview]);

  useEffect(() => {
    if (!preview) return;
    const post = (msg: PreviewMessage) => window.parent.postMessage(msg, location.origin);

    const onMessage = (e: MessageEvent<PreviewMessage>) => {
      if (e.origin !== location.origin || e.data?.type !== "lca:content") return;
      const content = normalizeContent(e.data.content);
      if (!content) return;
      const { selectedId, scroll } = e.data;
      setDraft({ content, selectedId });
      if (scroll && selectedId) {
        requestAnimationFrame(() =>
          document.querySelector(`[data-block-id="${CSS.escape(selectedId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
      }
    };
    // Trong khung xem trước: bấm vào khối để chọn, không cho điều hướng đi trang khác.
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button[type=submit]")) e.preventDefault();
      const id = target.closest("[data-block-id]")?.getAttribute("data-block-id");
      if (id) post({ type: "lca:select", id });
    };
    const onSubmit = (e: SubmitEvent) => e.preventDefault();

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    post({ type: "lca:ready" });
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [preview]);

  const value = useMemo<Ctx>(
    () =>
      preview
        ? { content: draft?.content ?? DEFAULT_CONTENT, preview, selectedId: draft?.selectedId ?? null }
        : { content: fetched ?? cached ?? DEFAULT_CONTENT, preview, selectedId: null },
    [preview, draft, fetched, cached],
  );
  const css = themeCss(value.content.theme);

  return (
    <ContentContext.Provider value={value}>
      {css && <style>{css}</style>}
      {children}
    </ContentContext.Provider>
  );
}
