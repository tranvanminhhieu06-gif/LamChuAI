// Dữ liệu tạm cho giai đoạn đầu. Sau này thay bằng CMS (Sanity/Strapi) hoặc MDX
// mà không phải sửa component — chỉ cần giữ nguyên kiểu dữ liệu bên dưới.

export const site = {
  name: "Cộng đồng Làm chủ AI",
  shortName: "Làm Chủ AI",
  url: "https://trangai.com",
  description:
    "Học Marketing AI thực chiến – xây hệ thống nội dung, SEO, video và thương hiệu cá nhân với AI.",
  phone: "0967 664 321",
  email: "contact@trangai.com",
  address: "Hà Nội, Việt Nam",
  hours: "8:00 – 22:00 (T2 – CN)",
};

export const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/khoa-hoc", label: "Khóa học" },
  { href: "/#lo-trinh", label: "Lộ trình AI" },
  { href: "/blog", label: "Blog AI" },
  { href: "/#tai-nguyen", label: "Tài nguyên" },
  { href: "/#cong-dong", label: "Về chúng tôi" },
];

export type FeatureIcon =
  | "megaphone"
  | "pen"
  | "search"
  | "video"
  | "user"
  | "bot";

export const features: { icon: FeatureIcon; title: string; desc: string }[] = [
  { icon: "megaphone", title: "Marketing AI", desc: "Chiến lược marketing thông minh với AI" },
  { icon: "pen", title: "Content AI", desc: "Tạo nội dung chất lượng nhanh chóng" },
  { icon: "search", title: "SEO AI", desc: "Tối ưu tìm kiếm, đứng top bền vững" },
  { icon: "video", title: "Video AI", desc: "Sản xuất video chuyên nghiệp, viral" },
  { icon: "user", title: "Personal Branding", desc: "Xây dựng thương hiệu cá nhân bằng AI" },
  { icon: "bot", title: "AI Automation", desc: "Tự động hóa quy trình, tăng hiệu suất" },
];

export type Course = {
  slug: string;
  tag: string;
  cover: { title: string; from: string; to: string };
  title: string;
  excerpt: string;
  sessions: string;
  price: number;
  outcomes: string[];
};

export const courses: Course[] = [
  {
    slug: "marketing-ai-thuc-chien",
    tag: "Bán chạy",
    cover: { title: "AI MARKETING", from: "#0b2a7a", to: "#2f72ff" },
    title: "Marketing AI Thực Chiến",
    excerpt: "Xây dựng hệ thống marketing tự động với AI: nội dung, SEO, video, quảng cáo.",
    sessions: "12 buổi (6 tuần)",
    price: 2990000,
    outcomes: [
      "Lập kế hoạch marketing 90 ngày với AI",
      "Bộ prompt cho từng kênh: Facebook, TikTok, Website",
      "Đo lường và tối ưu chiến dịch bằng dữ liệu",
    ],
  },
  {
    slug: "content-ai-storytelling",
    tag: "Mới",
    cover: { title: "CONTENT", from: "#1238a8", to: "#5a96ff" },
    title: "Content AI & Storytelling",
    excerpt: "Tạo nội dung hấp dẫn, đúng insight với AI. Kể câu chuyện thương hiệu chạm cảm xúc.",
    sessions: "8 buổi (4 tuần)",
    price: 1990000,
    outcomes: [
      "Khung kể chuyện thương hiệu dễ áp dụng",
      "Viết bài, kịch bản, caption nhanh gấp 5 lần",
      "Giữ giọng văn riêng khi dùng AI",
    ],
  },
  {
    slug: "seo-ai-tu-a-z",
    tag: "Phổ biến",
    cover: { title: "SEO", from: "#071a45", to: "#1658f5" },
    title: "SEO AI Từ A – Z",
    excerpt: "Tối ưu website, nội dung, từ khóa bằng AI. Lên top bền vững.",
    sessions: "10 buổi (5 tuần)",
    price: 2490000,
    outcomes: [
      "Nghiên cứu và gom cụm từ khóa bằng AI",
      "Viết bài chuẩn SEO, chuẩn E-E-A-T",
      "Audit kỹ thuật và schema markup",
    ],
  },
  {
    slug: "video-ai-xay-kenh",
    tag: "Hot",
    cover: { title: "VIDEO AI", from: "#0f44d6", to: "#8ebcff" },
    title: "Video AI – Xây Kênh Từ Con Số 0",
    excerpt: "Tạo video bằng AI, dựng kênh YouTube, TikTok, Facebook hiệu quả.",
    sessions: "8 buổi (4 tuần)",
    price: 1990000,
    outcomes: [
      "Quy trình kịch bản → giọng đọc → dựng video",
      "Tạo avatar và B-roll bằng AI",
      "Lịch đăng và tối ưu thuật toán từng nền tảng",
    ],
  },
];

export const roadmap = [
  { step: "01", icon: "chip", title: "Nền tảng AI", desc: "Hiểu đúng về AI, làm quen công cụ và tư duy ứng dụng.", time: "1 – 2 tuần" },
  { step: "02", icon: "pen", title: "Content & SEO AI", desc: "Tạo nội dung, tối ưu SEO, thu hút khách hàng tự nhiên.", time: "2 – 4 tuần" },
  { step: "03", icon: "video", title: "Video AI", desc: "Sản xuất video, xây kênh, tăng tương tác và chuyển đổi.", time: "2 – 4 tuần" },
  { step: "04", icon: "gear", title: "Automation & Scale", desc: "Tự động hóa quy trình, tối ưu hiệu suất, mở rộng quy mô.", time: "2 – 6 tuần" },
] as const;

export type Post = {
  slug: string;
  tag: string;
  date: string; // ISO
  cover: { title: string; from: string; to: string };
  title: string;
  excerpt: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "5-cach-dung-chatgpt-viet-content-marketing",
    tag: "Content AI",
    date: "2026-09-28",
    cover: { title: "ChatGPT", from: "#0b2a7a", to: "#2f72ff" },
    title: "5 Cách Dùng ChatGPT Để Viết Content Marketing Hiệu Quả",
    excerpt: "Khám phá 5 cách sử dụng ChatGPT giúp bạn tạo nội dung nhanh hơn, hay hơn và tiết kiệm thời gian.",
    body: [
      "Nội dung bài viết sẽ được lấy từ CMS hoặc file MDX ở giai đoạn sau.",
      "Đây là đoạn mẫu để kiểm tra bố cục trang chi tiết bài viết.",
    ],
  },
  {
    slug: "seo-ai-huong-dan-toi-uu-website",
    tag: "SEO AI",
    date: "2026-09-25",
    cover: { title: "SEO", from: "#071a45", to: "#1658f5" },
    title: "SEO AI: Hướng Dẫn Tối Ưu Website Với Trí Tuệ Nhân Tạo",
    excerpt: "Từ khóa, nội dung, kỹ thuật… AI giúp bạn đạt thứ hạng cao hơn trên Google.",
    body: [
      "Nội dung bài viết sẽ được lấy từ CMS hoặc file MDX ở giai đoạn sau.",
      "Đây là đoạn mẫu để kiểm tra bố cục trang chi tiết bài viết.",
    ],
  },
  {
    slug: "huong-dan-tao-video-ai-chat-luong-cao",
    tag: "Video AI",
    date: "2026-09-22",
    cover: { title: "VIDEO", from: "#0f44d6", to: "#8ebcff" },
    title: "Hướng Dẫn Tạo Video AI Chất Lượng Cao Chỉ Trong 10 Phút",
    excerpt: "Khám phá công cụ, prompt và quy trình tạo video AI hiệu quả, phù hợp cho người mới.",
    body: [
      "Nội dung bài viết sẽ được lấy từ CMS hoặc file MDX ở giai đoạn sau.",
      "Đây là đoạn mẫu để kiểm tra bố cục trang chi tiết bài viết.",
    ],
  },
];

export const resources = [
  { icon: "message", title: "Prompt hay", desc: "100+ prompt mẫu cho marketing, content, video, SEO…" },
  { icon: "check", title: "Checklist", desc: "Checklist triển khai marketing AI, SEO, content, video…" },
  { icon: "file", title: "Template", desc: "Template kế hoạch, bảng theo dõi, content, kịch bản…" },
  { icon: "book", title: "Ebook", desc: "Ebook hướng dẫn chi tiết, kinh nghiệm thực chiến…" },
] as const;

export const stats = [
  { value: "5.000+", label: "Học viên" },
  { value: "100+", label: "Bài học" },
  { value: "50+", label: "Tài nguyên miễn phí" },
];

export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ";

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
};
