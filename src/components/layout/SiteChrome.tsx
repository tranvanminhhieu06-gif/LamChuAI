"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ContentProvider } from "@/content/ContentProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Khung chung của trang công khai: nạp nội dung + màu đã xuất bản, header, footer.
 * Trang /admin có giao diện riêng nên bỏ qua khung này.
 * (Không dùng route group vì bản xuất tĩnh của Next 16.3 đặt sai tên file prefetch cho route group.)
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  return (
    <ContentProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Bỏ qua đến nội dung chính
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </ContentProvider>
  );
}
