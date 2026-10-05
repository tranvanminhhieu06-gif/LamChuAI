import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Xuất mỗi trang thành thư mục/index.html: hosting cPanel (LiteSpeed) phục vụ đúng /blog/, /admin/…
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
