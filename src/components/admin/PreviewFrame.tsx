"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PreviewMessage } from "@/content/ContentProvider";
import type { SiteContent } from "@/content/types";

export type Device = "desktop" | "tablet" | "mobile";
const WIDTH: Record<Device, number> = { desktop: 1280, tablet: 820, mobile: 390 };

/**
 * Hiển thị trang chủ thật trong iframe ở đúng bề rộng thiết bị (thu nhỏ cho vừa khung),
 * gửi bản nháp qua postMessage nên mọi thay đổi hiện ngay mà không cần tải lại.
 */
export function PreviewFrame({
  content,
  selectedId,
  scrollToken,
  device,
  onSelect,
}: {
  content: SiteContent;
  selectedId: string | null;
  /** Đổi giá trị để yêu cầu cuộn tới khối đang chọn */
  scrollToken: number;
  device: Device;
  onSelect: (id: string) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const lastScroll = useRef(scrollToken);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent<PreviewMessage>) => {
      if (e.origin !== location.origin || e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.type === "lca:ready") setReady(true);
      if (e.data?.type === "lca:select") onSelect(e.data.id);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onSelect]);

  useEffect(() => {
    if (!ready) return;
    const scroll = lastScroll.current !== scrollToken;
    lastScroll.current = scrollToken;
    const msg: PreviewMessage = { type: "lca:content", content, selectedId, scroll };
    frameRef.current?.contentWindow?.postMessage(msg, location.origin);
  }, [ready, content, selectedId, scrollToken]);

  const width = WIDTH[device];
  const scale = box.w ? Math.min(1, (box.w - 32) / width) : 1;

  return (
    <div ref={boxRef} className="relative h-full overflow-hidden bg-slate-200/70">
      <div
        className="absolute top-4 left-1/2 origin-top overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10"
        style={{ width, height: (box.h - 32) / scale, transform: `translateX(-50%) scale(${scale})` }}
      >
        <iframe
          ref={frameRef}
          src="/?preview=1"
          title="Xem trước trang chủ"
          className="size-full"
        />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-white/80 text-sm text-slate-500">Đang tải bản xem trước…</div>
        )}
      </div>
    </div>
  );
}
