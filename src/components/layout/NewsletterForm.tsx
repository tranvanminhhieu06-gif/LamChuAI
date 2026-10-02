"use client";

import { useState, type FormEvent } from "react";

// Gửi email về webhook (ví dụ n8n) cấu hình qua NEXT_PUBLIC_NEWSLETTER_WEBHOOK.
// Chưa cấu hình thì form chỉ hiển thị thông báo thành công giả lập để test UI.
export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("loading");
    try {
      const url = process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK;
      if (url) {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "footer-newsletter" }),
        });
        if (!res.ok) throw new Error();
      }
      form.reset();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email của bạn
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="Nhập email của bạn"
        className="h-11 rounded-lg border border-white/15 bg-white px-4 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-brand-400"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 rounded-lg bg-brand-500 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {status === "loading" ? "Đang gửi…" : "Đăng ký"}
      </button>
      <p role="status" className="min-h-5 text-xs">
        {status === "done" && <span className="text-emerald-300">Đăng ký thành công. Cảm ơn bạn!</span>}
        {status === "error" && <span className="text-rose-300">Có lỗi xảy ra, vui lòng thử lại.</span>}
      </p>
    </form>
  );
}
