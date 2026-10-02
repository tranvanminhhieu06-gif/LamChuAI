# Cộng Đồng Làm Chủ AI – Website

Next.js 16 (App Router) + Tailwind CSS 4 + lucide-react. Font Be Vietnam Pro tự host qua `@fontsource` (không phụ thuộc Google Fonts lúc build).

## Chạy thử

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # bản production
```

## Cấu trúc

```
src/
  app/
    page.tsx                 Trang chủ (ghép các section)
    khoa-hoc/page.tsx        Danh sách khóa học
    khoa-hoc/[slug]/page.tsx Chi tiết khóa học (SSG + schema Course)
    blog/page.tsx            Danh sách bài viết
    blog/[slug]/page.tsx     Chi tiết bài viết (SSG + schema Article)
    sitemap.ts, robots.ts    SEO
    globals.css              Design tokens (màu, bóng, animation)
  components/
    layout/   Header (menu mobile), Footer, NewsletterForm
    sections/ Hero, Features, Courses, Roadmap, BlogPreview, Resources, Community
    cards/    CourseCard, PostCard
    ui/       Button, SectionHeader, Logo, CoverArt, PageHero
  data/site.ts      Dữ liệu tạm: thông tin site, khóa học, bài viết, tài nguyên
  lib/content.ts    Lớp lấy dữ liệu – đổi sang CMS chỉ cần sửa file này
```

## Việc tiếp theo

1. **Ảnh thật**: đặt ảnh vào `public/images/`, thay `CoverArt` và phần minh họa trong `Hero.tsx` bằng `next/image`. Chỉ dùng ảnh có bản quyền.
2. **Nội dung**: sửa `src/data/site.ts` (giá, số điện thoại, email, domain `site.url`).
3. **Form**: tạo file `.env.local` với `NEXT_PUBLIC_NEWSLETTER_WEBHOOK=<url webhook n8n>` để form đăng ký nhận tin gửi dữ liệu thật. Nút "Đăng ký ngay" ở trang khóa học hiện gọi điện, sẽ thay bằng form.
4. **CMS / MDX**: viết lại các hàm trong `src/lib/content.ts` để lấy dữ liệu từ Sanity/Strapi hoặc file MDX.
5. **Deploy**: đẩy lên GitHub → import vào Vercel → trỏ tên miền.
