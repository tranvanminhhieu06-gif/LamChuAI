import {
  CircleHelp,
  GraduationCap,
  Image as ImageIcon,
  LayoutGrid,
  ListOrdered,
  Megaphone,
  Newspaper,
  PanelTop,
  Sparkles,
  TrendingUp,
  Type,
  type LucideIcon,
} from "lucide-react";
import type { BlockType, Columns } from "@/content/types";

type Base = { key: string; label: string; help?: string };

export type Field =
  | (Base & { kind: "text"; placeholder?: string })
  | (Base & { kind: "textarea"; rows?: number })
  | (Base & { kind: "number"; min?: number; max?: number; step?: number })
  | (Base & { kind: "link" })
  | (Base & { kind: "icon" })
  | (Base & { kind: "image" })
  | (Base & { kind: "color" })
  | (Base & { kind: "select"; options: { value: string; label: string }[] })
  | (Base & {
      kind: "list";
      itemLabel: string;
      /** Khóa dùng làm tiêu đề phần tử trong danh sách */
      titleKey: string;
      fields: Field[];
      create: () => Record<string, unknown>;
      max?: number;
    });

export type LayoutKey = "background" | "spacing" | "align" | "columns" | "anchor";

export type BlockMeta = {
  label: string;
  desc: string;
  icon: LucideIcon;
  fields: Field[];
  layout: LayoutKey[];
  columns?: Columns[];
};

const link = (label = "", href = "") => ({ label, href });

const iconText = (titleLabel = "Tiêu đề", descLabel = "Mô tả"): Field[] => [
  { kind: "icon", key: "icon", label: "Biểu tượng" },
  { kind: "text", key: "title", label: titleLabel },
  { kind: "textarea", key: "desc", label: descLabel, rows: 2 },
];

const heading: Field[] = [
  { kind: "text", key: "title", label: "Tiêu đề khối" },
  { kind: "textarea", key: "desc", label: "Mô tả ngắn", rows: 2 },
];

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  hero: {
    label: "Banner đầu trang",
    desc: "Tiêu đề lớn, mô tả, 2 nút và ảnh minh họa.",
    icon: PanelTop,
    layout: ["background", "spacing", "anchor"],
    fields: [
      { kind: "textarea", key: "title", label: "Tiêu đề", rows: 3, help: "Mỗi dòng là một dòng tiêu đề." },
      { kind: "textarea", key: "subtitle", label: "Mô tả", rows: 2 },
      { kind: "link", key: "primary", label: "Nút chính" },
      { kind: "link", key: "secondary", label: "Nút phụ" },
      { kind: "image", key: "image", label: "Ảnh minh họa", help: "Để trống để dùng hình laptop AI mặc định. Ảnh ngang tỉ lệ 5:4 đẹp nhất." },
      {
        kind: "list",
        key: "badges",
        label: "Điểm nổi bật dưới nút",
        itemLabel: "điểm nổi bật",
        titleKey: "title",
        max: 4,
        create: () => ({ icon: "star", title: "Tiêu đề", sub: "mô tả" }),
        fields: [
          { kind: "icon", key: "icon", label: "Biểu tượng" },
          { kind: "text", key: "title", label: "Dòng 1" },
          { kind: "text", key: "sub", label: "Dòng 2" },
        ],
      },
      {
        kind: "list",
        key: "chips",
        label: "Nhãn bay quanh ảnh",
        itemLabel: "nhãn",
        titleKey: "label",
        max: 4,
        create: () => ({ icon: "sparkles", label: "Nhãn mới" }),
        fields: [
          { kind: "icon", key: "icon", label: "Biểu tượng" },
          { kind: "text", key: "label", label: "Chữ" },
        ],
      },
    ],
  },
  features: {
    label: "Lưới tính năng",
    desc: "Các ô biểu tượng + tiêu đề + mô tả ngắn.",
    icon: LayoutGrid,
    layout: ["background", "spacing", "align", "columns", "anchor"],
    columns: [2, 3, 4, 6],
    fields: [
      ...heading,
      {
        kind: "list",
        key: "items",
        label: "Các ô",
        itemLabel: "ô",
        titleKey: "title",
        create: () => ({ icon: "sparkles", title: "Tính năng mới", desc: "Mô tả ngắn" }),
        fields: iconText(),
      },
    ],
  },
  courses: {
    label: "Khóa học",
    desc: "Thẻ khóa học có ảnh, giá và nút xem chi tiết.",
    icon: GraduationCap,
    layout: ["background", "spacing", "align", "columns", "anchor"],
    columns: [2, 3, 4],
    fields: [
      ...heading,
      { kind: "link", key: "more", label: "Link “xem tất cả”" },
      {
        kind: "list",
        key: "items",
        label: "Khóa học",
        itemLabel: "khóa học",
        titleKey: "title",
        help: "Trang chi tiết /khoa-hoc/… vẫn lấy nội dung từ mã nguồn; với khóa mới, hãy trỏ link tới trang đăng ký của bạn.",
        create: () => ({
          tag: "Mới",
          title: "Khóa học mới",
          excerpt: "Mô tả ngắn về khóa học.",
          sessions: "8 buổi",
          price: 0,
          href: "/khoa-hoc",
          image: "",
          coverTitle: "AI",
          coverFrom: "#0b2a7a",
          coverTo: "#2f72ff",
        }),
        fields: [
          { kind: "text", key: "title", label: "Tên khóa học" },
          { kind: "text", key: "tag", label: "Nhãn góc ảnh", placeholder: "Bán chạy, Mới, Hot…" },
          { kind: "textarea", key: "excerpt", label: "Mô tả", rows: 3 },
          { kind: "text", key: "sessions", label: "Thời lượng" },
          { kind: "number", key: "price", label: "Giá (đồng)", min: 0, step: 10000, help: "Nhập 0 để ẩn giá." },
          { kind: "text", key: "href", label: "Link khi bấm" },
          { kind: "image", key: "image", label: "Ảnh bìa", help: "Để trống để dùng ảnh bìa chữ bên dưới." },
          { kind: "text", key: "coverTitle", label: "Chữ trên ảnh bìa" },
          { kind: "color", key: "coverFrom", label: "Màu bìa (đầu)" },
          { kind: "color", key: "coverTo", label: "Màu bìa (cuối)" },
        ],
      },
    ],
  },
  roadmap: {
    label: "Lộ trình",
    desc: "Các bước được đánh số theo thứ tự.",
    icon: ListOrdered,
    layout: ["background", "spacing", "align", "columns", "anchor"],
    columns: [2, 3, 4],
    fields: [
      ...heading,
      {
        kind: "list",
        key: "items",
        label: "Các bước",
        itemLabel: "bước",
        titleKey: "title",
        create: () => ({ icon: "rocket", title: "Bước mới", desc: "Mô tả", time: "1 tuần" }),
        fields: [...iconText(), { kind: "text", key: "time", label: "Thời gian" }],
      },
    ],
  },
  posts: {
    label: "Bài viết mới",
    desc: "Hiện các bài blog mới nhất.",
    icon: Newspaper,
    layout: ["background", "spacing", "align", "columns", "anchor"],
    columns: [2, 3, 4],
    fields: [
      ...heading,
      { kind: "link", key: "more", label: "Link “xem tất cả”" },
      { kind: "number", key: "count", label: "Số bài hiển thị", min: 1, max: 12 },
    ],
  },
  resources: {
    label: "Tài nguyên",
    desc: "Thẻ tài liệu có nút tải.",
    icon: Sparkles,
    layout: ["background", "spacing", "align", "columns", "anchor"],
    columns: [2, 3, 4],
    fields: [
      ...heading,
      { kind: "link", key: "more", label: "Link “xem tất cả”" },
      {
        kind: "list",
        key: "items",
        label: "Tài nguyên",
        itemLabel: "tài nguyên",
        titleKey: "title",
        create: () => ({ icon: "file", title: "Tài liệu mới", desc: "Mô tả ngắn", button: link("Tải ngay", "#") }),
        fields: [...iconText(), { kind: "link", key: "button", label: "Nút" }],
      },
    ],
  },
  stats: {
    label: "Số liệu nổi bật",
    desc: "Tiêu đề + nút bên trái, các con số bên phải.",
    icon: TrendingUp,
    layout: ["background", "spacing", "align", "columns", "anchor"],
    columns: [2, 3, 4],
    fields: [
      { kind: "text", key: "eyebrow", label: "Dòng chữ nhỏ phía trên" },
      { kind: "text", key: "title", label: "Tiêu đề" },
      { kind: "textarea", key: "desc", label: "Mô tả", rows: 2 },
      { kind: "link", key: "cta", label: "Nút" },
      {
        kind: "list",
        key: "items",
        label: "Con số",
        itemLabel: "con số",
        titleKey: "label",
        create: () => ({ icon: "star", value: "100+", label: "Nhãn" }),
        fields: [
          { kind: "icon", key: "icon", label: "Biểu tượng" },
          { kind: "text", key: "value", label: "Con số" },
          { kind: "text", key: "label", label: "Nhãn" },
        ],
      },
    ],
  },
  text: {
    label: "Đoạn văn",
    desc: "Tiêu đề và nội dung chữ, có thể thêm nút.",
    icon: Type,
    layout: ["background", "spacing", "align", "anchor"],
    fields: [
      { kind: "text", key: "eyebrow", label: "Dòng chữ nhỏ phía trên" },
      { kind: "text", key: "title", label: "Tiêu đề" },
      { kind: "textarea", key: "body", label: "Nội dung", rows: 8, help: "Để một dòng trống giữa các đoạn." },
      { kind: "link", key: "cta", label: "Nút" },
    ],
  },
  cta: {
    label: "Kêu gọi hành động",
    desc: "Dải nổi bật với tiêu đề và nút đăng ký.",
    icon: Megaphone,
    layout: ["background", "spacing", "align", "anchor"],
    fields: [
      { kind: "text", key: "title", label: "Tiêu đề" },
      { kind: "textarea", key: "desc", label: "Mô tả", rows: 2 },
      { kind: "link", key: "primary", label: "Nút chính" },
      { kind: "link", key: "secondary", label: "Nút phụ" },
    ],
  },
  imageText: {
    label: "Ảnh + nội dung",
    desc: "Ảnh một bên, chữ và danh sách lợi ích bên kia.",
    icon: ImageIcon,
    layout: ["background", "spacing", "anchor"],
    fields: [
      { kind: "text", key: "eyebrow", label: "Dòng chữ nhỏ phía trên" },
      { kind: "text", key: "title", label: "Tiêu đề" },
      { kind: "textarea", key: "body", label: "Nội dung", rows: 5 },
      {
        kind: "list",
        key: "bullets",
        label: "Danh sách lợi ích",
        itemLabel: "dòng",
        titleKey: "text",
        create: () => ({ text: "Lợi ích mới" }),
        fields: [{ kind: "text", key: "text", label: "Nội dung" }],
      },
      { kind: "image", key: "image", label: "Ảnh" },
      { kind: "text", key: "imageAlt", label: "Mô tả ảnh (cho người khiếm thị và SEO)" },
      {
        kind: "select",
        key: "imageSide",
        label: "Vị trí ảnh",
        options: [
          { value: "right", label: "Bên phải" },
          { value: "left", label: "Bên trái" },
        ],
      },
      { kind: "link", key: "cta", label: "Nút" },
    ],
  },
  faq: {
    label: "Hỏi đáp",
    desc: "Danh sách câu hỏi thường gặp, bấm để mở.",
    icon: CircleHelp,
    layout: ["background", "spacing", "align", "anchor"],
    fields: [
      ...heading,
      {
        kind: "list",
        key: "items",
        label: "Câu hỏi",
        itemLabel: "câu hỏi",
        titleKey: "q",
        create: () => ({ q: "Câu hỏi mới?", a: "Câu trả lời." }),
        fields: [
          { kind: "text", key: "q", label: "Câu hỏi" },
          { kind: "textarea", key: "a", label: "Trả lời", rows: 4 },
        ],
      },
    ],
  },
};

export const SITE_FIELDS: Field[] = [
  { kind: "text", key: "name", label: "Tên website", help: "Hiện ở logo đầu trang và chân trang." },
  { kind: "textarea", key: "tagline", label: "Giới thiệu ở chân trang", rows: 2 },
  { kind: "link", key: "headerCta", label: "Nút ở đầu trang", help: "Để trống nhãn để ẩn nút." },
  {
    kind: "list",
    key: "nav",
    label: "Menu",
    itemLabel: "mục menu",
    titleKey: "label",
    max: 8,
    create: () => link("Mục mới", "/"),
    fields: [
      { kind: "text", key: "label", label: "Tên hiển thị" },
      { kind: "text", key: "href", label: "Link", help: "Ví dụ: /khoa-hoc/, /#lo-trinh hoặc https://…" },
    ],
  },
  { kind: "text", key: "phone", label: "Số điện thoại" },
  { kind: "text", key: "email", label: "Email" },
  { kind: "text", key: "address", label: "Địa chỉ" },
  { kind: "text", key: "hours", label: "Giờ làm việc" },
  {
    kind: "list",
    key: "socials",
    label: "Mạng xã hội",
    itemLabel: "mạng xã hội",
    titleKey: "label",
    max: 8,
    create: () => ({ label: "Mạng xã hội", short: "MX", href: "https://" }),
    fields: [
      { kind: "text", key: "label", label: "Tên" },
      { kind: "text", key: "short", label: "Chữ viết tắt trên nút" },
      { kind: "text", key: "href", label: "Link trang" },
    ],
  },
];

export const BACKGROUND_OPTIONS = [
  { value: "white", label: "Trắng" },
  { value: "soft", label: "Nhạt" },
  { value: "brand", label: "Màu thương hiệu" },
  { value: "deep", label: "Thương hiệu đậm" },
  { value: "dark", label: "Tối" },
] as const;

export const SPACING_OPTIONS = [
  { value: "sm", label: "Gọn" },
  { value: "md", label: "Vừa" },
  { value: "lg", label: "Rộng" },
] as const;
