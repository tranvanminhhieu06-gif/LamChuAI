import { CONTENT_URL } from "@/content/ContentProvider";
import { normalizeContent } from "@/content/normalize";
import type { SiteContent } from "@/content/types";

const ADMIN_URL = "/api/admin.php";

export type ServerStatus =
  | { mode: "offline" }
  | { mode: "online"; configured: boolean; loggedIn: boolean };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function call<T>(action: string, init?: { body?: unknown; form?: FormData; query?: Record<string, string> }): Promise<T> {
  const params = new URLSearchParams({ action, ...init?.query });
  const isPost = init?.body !== undefined || init?.form !== undefined;
  const res = await fetch(`${ADMIN_URL}?${params}`, {
    method: isPost ? "POST" : "GET",
    credentials: "same-origin",
    cache: "no-store",
    // Header riêng buộc trình duyệt kiểm tra CORS, chặn trang lạ gửi yêu cầu thay quản trị viên.
    headers: {
      "X-LCA": "1",
      ...(init?.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.form ?? (init?.body !== undefined ? JSON.stringify(init.body) : undefined),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) throw new ApiError(data?.error ?? `Lỗi máy chủ (${res.status})`, res.status);
  return data as T;
}

export async function getStatus(): Promise<ServerStatus> {
  try {
    const s = await call<{ configured: boolean; loggedIn: boolean }>("status");
    return { mode: "online", ...s };
  } catch {
    // Không có PHP (chạy `next dev`) hoặc chưa tải thư mục api lên hosting.
    return { mode: "offline" };
  }
}

export const login = (password: string) => call<{ ok: true }>("login", { body: { password } });
export const logout = () => call<{ ok: true }>("logout", { body: {} });
export const save = (content: SiteContent) => call<{ ok: true; updatedAt: string }>("save", { body: { content } });
export const listBackups = () => call<{ items: { name: string; time: string; size: number }[] }>("backups");

export async function getBackup(name: string) {
  return normalizeContent(await call<unknown>("backup", { query: { name } }));
}

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  return call<{ url: string }>("upload", { form });
}

export async function getPublished(): Promise<SiteContent | null> {
  try {
    const res = await fetch(CONTENT_URL, { cache: "no-store" });
    return res.ok ? normalizeContent(await res.json()) : null;
  } catch {
    return null;
  }
}
