import { courses, site } from "@/data/site";
import { DEFAULT_THEME } from "./theme";
import type { AnyBlock, Block, BlockLayout, BlockPropsMap, BlockType, SiteContent } from "./types";

const link = (label = "", href = "") => ({ label, href });

/** Nội dung mẫu cho khối mới thêm. */
export const NEW_BLOCK_PROPS: { [K in BlockType]: () => BlockPropsMap[K] } = {
  hero: () => ({
    title: "Tiêu đề lớn\ncủa trang",
    subtitle: "Một câu mô tả ngắn gọn giá trị bạn mang lại.",
    primary: link("Bắt đầu ngay", "/khoa-hoc"),
    secondary: link("Tìm hiểu thêm", "/#lo-trinh"),
    image: "",
    badges: [],
    chips: [],
  }),
  features: () => ({
    title: "Tiêu đề khối",
    desc: "Mô tả ngắn cho khối tính năng.",
    items: [
      { icon: "sparkles", title: "Tính năng 1", desc: "Mô tả ngắn" },
      { icon: "rocket", title: "Tính năng 2", desc: "Mô tả ngắn" },
      { icon: "target", title: "Tính năng 3", desc: "Mô tả ngắn" },
    ],
  }),
  courses: () => ({ title: "Khóa học", desc: "", more: link("Xem tất cả", "/khoa-hoc"), items: [] }),
  roadmap: () => ({
    title: "Lộ trình",
    desc: "",
    items: [
      { icon: "chip", title: "Bước 1", desc: "Mô tả", time: "1 tuần" },
      { icon: "rocket", title: "Bước 2", desc: "Mô tả", time: "2 tuần" },
    ],
  }),
  posts: () => ({ title: "Bài viết mới", desc: "", more: link("Xem tất cả bài viết", "/blog"), count: 3 }),
  resources: () => ({
    title: "Tài nguyên",
    desc: "",
    more: link(),
    items: [{ icon: "file", title: "Tài liệu", desc: "Mô tả ngắn", button: link("Tải ngay", "#") }],
  }),
  stats: () => ({
    eyebrow: "Con số nổi bật",
    title: "Tiêu đề khối số liệu",
    desc: "",
    cta: link(),
    items: [
      { icon: "users", value: "1.000+", label: "Học viên" },
      { icon: "star", value: "4.9/5", label: "Đánh giá" },
    ],
  }),
  text: () => ({ eyebrow: "", title: "Tiêu đề", body: "Nội dung đoạn văn. Xuống dòng hai lần để tách đoạn.", cta: link() }),
  cta: () => ({
    title: "Sẵn sàng bắt đầu?",
    desc: "Tham gia cùng hàng nghìn học viên đang làm chủ AI.",
    primary: link("Đăng ký ngay", "/khoa-hoc"),
    secondary: link(),
  }),
  imageText: () => ({
    eyebrow: "",
    title: "Tiêu đề",
    body: "Nội dung mô tả bên cạnh hình ảnh.",
    bullets: [{ text: "Lợi ích thứ nhất" }, { text: "Lợi ích thứ hai" }],
    image: "",
    imageAlt: "",
    imageSide: "right",
    cta: link(),
  }),
  faq: () => ({
    title: "Câu hỏi thường gặp",
    desc: "",
    items: [{ q: "Câu hỏi?", a: "Câu trả lời." }],
  }),
};

export const NEW_BLOCK_LAYOUT: { [K in BlockType]: BlockLayout } = {
  hero: { background: "brand", spacing: "md", align: "left", columns: 4, anchor: "" },
  features: { background: "white", spacing: "md", align: "center", columns: 6, anchor: "" },
  courses: { background: "white", spacing: "md", align: "left", columns: 4, anchor: "" },
  roadmap: { background: "soft", spacing: "md", align: "center", columns: 4, anchor: "" },
  posts: { background: "white", spacing: "md", align: "left", columns: 3, anchor: "" },
  resources: { background: "white", spacing: "md", align: "left", columns: 4, anchor: "" },
  stats: { background: "deep", spacing: "sm", align: "left", columns: 3, anchor: "" },
  text: { background: "white", spacing: "md", align: "center", columns: 2, anchor: "" },
  cta: { background: "brand", spacing: "md", align: "center", columns: 2, anchor: "" },
  imageText: { background: "white", spacing: "md", align: "left", columns: 2, anchor: "" },
  faq: { background: "soft", spacing: "md", align: "center", columns: 2, anchor: "" },
};

export const newId = () => Math.random().toString(36).slice(2, 10);

export function createBlock<T extends BlockType>(type: T): Block<T> {
  return {
    id: newId(),
    type,
    hidden: false,
    layout: { ...NEW_BLOCK_LAYOUT[type] },
    props: NEW_BLOCK_PROPS[type](),
  };
}

const block = <T extends BlockType>(
  id: string,
  type: T,
  props: BlockPropsMap[T],
  layout: Partial<BlockLayout> = {},
): AnyBlock => ({ id, type, hidden: false, layout: { ...NEW_BLOCK_LAYOUT[type], ...layout }, props }) as AnyBlock;

/** Nội dung mặc định = giao diện hiện tại của trang chủ. */
export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  theme: DEFAULT_THEME,
  site: {
    name: site.name,
    tagline: "Kiến thức AI – Kỹ năng thực chiến – Cộng đồng đồng hành cùng bạn làm chủ tương lai.",
    phone: site.phone,
    email: site.email,
    address: site.address,
    hours: site.hours,
    headerCta: link("Học ngay", "/khoa-hoc"),
    nav: [
      link("Trang chủ", "/"),
      link("Khóa học", "/khoa-hoc"),
      link("Lộ trình AI", "/#lo-trinh"),
      link("Blog AI", "/blog"),
      link("Tài nguyên", "/#tai-nguyen"),
      link("Về chúng tôi", "/#cong-dong"),
    ],
    socials: [
      { label: "YouTube", short: "YT", href: "#" },
      { label: "Facebook", short: "f", href: "#" },
      { label: "Zalo", short: "Zalo", href: "#" },
      { label: "Telegram", short: "TG", href: "#" },
      { label: "TikTok", short: "TT", href: "#" },
    ],
  },
  blocks: [
    block("hero", "hero", {
      title: "Làm Chủ\nMarketing Trong\nKỷ Nguyên AI",
      subtitle: "Học Marketing AI thực chiến – xây hệ thống nội dung, SEO, video và thương hiệu cá nhân với AI.",
      primary: link("Xem khóa học", "/khoa-hoc"),
      secondary: link("Khám phá lộ trình", "/#lo-trinh"),
      image: "",
      badges: [
        { icon: "target", title: "Thực chiến", sub: "100%" },
        { icon: "monitor", title: "Học online", sub: "linh hoạt" },
        { icon: "users", title: "Giảng viên", sub: "kinh nghiệm" },
        { icon: "headphones", title: "Hỗ trợ", sub: "trọn đời" },
      ],
      chips: [
        { icon: "search", label: "SEO AI" },
        { icon: "file", label: "Content AI" },
        { icon: "play", label: "Video AI" },
        { icon: "bot", label: "Automation" },
      ],
    }),
    block("features", "features", {
      title: "Học gì tại Cộng đồng Làm chủ AI?",
      desc: "Trang bị đầy đủ kỹ năng và công cụ AI để tạo ra nội dung chất lượng, tăng trưởng kênh và xây dựng thương hiệu cá nhân vững mạnh.",
      items: [
        { icon: "megaphone", title: "Marketing AI", desc: "Chiến lược marketing thông minh với AI" },
        { icon: "pen", title: "Content AI", desc: "Tạo nội dung chất lượng nhanh chóng" },
        { icon: "search", title: "SEO AI", desc: "Tối ưu tìm kiếm, đứng top bền vững" },
        { icon: "video", title: "Video AI", desc: "Sản xuất video chuyên nghiệp, viral" },
        { icon: "user", title: "Personal Branding", desc: "Xây dựng thương hiệu cá nhân bằng AI" },
        { icon: "bot", title: "AI Automation", desc: "Tự động hóa quy trình, tăng hiệu suất" },
      ],
    }),
    block("courses", "courses", {
      title: "Khóa học nổi bật",
      desc: "Những khóa học được thiết kế bài bản, thực chiến, giúp bạn ứng dụng AI ngay vào công việc và kinh doanh.",
      more: link("Xem tất cả khóa học", "/khoa-hoc"),
      items: courses.map((c) => ({
        tag: c.tag,
        title: c.title,
        excerpt: c.excerpt,
        sessions: c.sessions,
        price: c.price,
        href: `/khoa-hoc/${c.slug}`,
        image: "",
        coverTitle: c.cover.title,
        coverFrom: c.cover.from,
        coverTo: c.cover.to,
      })),
    }),
    block(
      "roadmap",
      "roadmap",
      {
        title: "Lộ trình Làm Chủ AI",
        desc: "Học theo lộ trình bài bản, từ cơ bản đến nâng cao, giúp bạn tự tin làm chủ AI trong marketing.",
        items: [
          { icon: "chip", title: "Nền tảng AI", desc: "Hiểu đúng về AI, làm quen công cụ và tư duy ứng dụng.", time: "1 – 2 tuần" },
          { icon: "pen", title: "Content & SEO AI", desc: "Tạo nội dung, tối ưu SEO, thu hút khách hàng tự nhiên.", time: "2 – 4 tuần" },
          { icon: "video", title: "Video AI", desc: "Sản xuất video, xây kênh, tăng tương tác và chuyển đổi.", time: "2 – 4 tuần" },
          { icon: "gear", title: "Automation & Scale", desc: "Tự động hóa quy trình, tối ưu hiệu suất, mở rộng quy mô.", time: "2 – 6 tuần" },
        ],
      },
      { anchor: "lo-trinh" },
    ),
    block("posts", "posts", {
      title: "Kiến thức AI chuẩn SEO",
      desc: "Cập nhật những bài viết hữu ích, hướng dẫn chi tiết, giúp bạn luôn đi trước một bước.",
      more: link("Xem tất cả bài viết", "/blog"),
      count: 3,
    }),
    block(
      "resources",
      "resources",
      {
        title: "Tài nguyên miễn phí",
        desc: "Những công cụ và tài liệu hữu ích, giúp bạn bắt đầu và tiến xa hơn trong hành trình làm chủ AI.",
        more: link("Xem tất cả tài nguyên", "/#tai-nguyen"),
        items: [
          { icon: "message", title: "Prompt hay", desc: "100+ prompt mẫu cho marketing, content, video, SEO…", button: link("Tải ngay", "#") },
          { icon: "check", title: "Checklist", desc: "Checklist triển khai marketing AI, SEO, content, video…", button: link("Tải ngay", "#") },
          { icon: "file", title: "Template", desc: "Template kế hoạch, bảng theo dõi, content, kịch bản…", button: link("Tải ngay", "#") },
          { icon: "book", title: "Ebook", desc: "Ebook hướng dẫn chi tiết, kinh nghiệm thực chiến…", button: link("Tải ngay", "#") },
        ],
      },
      { anchor: "tai-nguyen" },
    ),
    block(
      "stats",
      "stats",
      {
        eyebrow: "Cộng đồng của chúng tôi",
        title: "Cùng nhau học hỏi – Cùng nhau phát triển",
        desc: "Hàng nghìn học viên đã và đang làm chủ AI để tạo ra những thay đổi tích cực trong công việc và cuộc sống.",
        cta: link("Bắt đầu học ngay", "/khoa-hoc"),
        items: [
          { icon: "users", value: "5.000+", label: "Học viên" },
          { icon: "bookCheck", value: "100+", label: "Bài học" },
          { icon: "gift", value: "50+", label: "Tài nguyên miễn phí" },
        ],
      },
      { anchor: "cong-dong", spacing: "md" },
    ),
  ],
};
