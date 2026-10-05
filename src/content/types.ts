// Mô hình dữ liệu của toàn bộ nội dung có thể chỉnh trong trang quản trị.
// Trang công khai và trang /admin dùng chung các kiểu này.

export type LinkValue = { label: string; href: string };

export type Background = "white" | "soft" | "brand" | "deep" | "dark";
export type Spacing = "sm" | "md" | "lg";
export type Align = "left" | "center";
export type Columns = 2 | 3 | 4 | 6;

export type BlockLayout = {
  background: Background;
  spacing: Spacing;
  align: Align;
  columns: Columns;
  /** id của section, dùng cho link dạng /#lo-trinh */
  anchor: string;
};

export type CourseItem = {
  tag: string;
  title: string;
  excerpt: string;
  sessions: string;
  price: number;
  href: string;
  image: string;
  coverTitle: string;
  coverFrom: string;
  coverTo: string;
};

export type BlockPropsMap = {
  hero: {
    title: string;
    subtitle: string;
    primary: LinkValue;
    secondary: LinkValue;
    image: string;
    badges: { icon: string; title: string; sub: string }[];
    chips: { icon: string; label: string }[];
  };
  features: {
    title: string;
    desc: string;
    items: { icon: string; title: string; desc: string }[];
  };
  courses: {
    title: string;
    desc: string;
    more: LinkValue;
    items: CourseItem[];
  };
  roadmap: {
    title: string;
    desc: string;
    items: { icon: string; title: string; desc: string; time: string }[];
  };
  posts: {
    title: string;
    desc: string;
    more: LinkValue;
    count: number;
  };
  resources: {
    title: string;
    desc: string;
    more: LinkValue;
    items: { icon: string; title: string; desc: string; button: LinkValue }[];
  };
  stats: {
    eyebrow: string;
    title: string;
    desc: string;
    cta: LinkValue;
    items: { icon: string; value: string; label: string }[];
  };
  text: {
    eyebrow: string;
    title: string;
    body: string;
    cta: LinkValue;
  };
  cta: {
    title: string;
    desc: string;
    primary: LinkValue;
    secondary: LinkValue;
  };
  imageText: {
    eyebrow: string;
    title: string;
    body: string;
    bullets: { text: string }[];
    image: string;
    imageAlt: string;
    imageSide: "left" | "right";
    cta: LinkValue;
  };
  faq: {
    title: string;
    desc: string;
    items: { q: string; a: string }[];
  };
};

export type BlockType = keyof BlockPropsMap;

export type Block<T extends BlockType = BlockType> = {
  id: string;
  type: T;
  hidden: boolean;
  layout: BlockLayout;
  props: BlockPropsMap[T];
};

export type AnyBlock = { [K in BlockType]: Block<K> }[BlockType];

export type Theme = {
  /** Màu thương hiệu chính (nút, điểm nhấn) */
  primary: string;
  /** Màu nền tối (footer, khối "Tối") */
  dark: string;
  /** Màu chữ chính */
  text: string;
  /** Màu chữ phụ */
  muted: string;
};

export type SiteInfo = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  headerCta: LinkValue;
  nav: LinkValue[];
  socials: { label: string; short: string; href: string }[];
};

export type SiteContent = {
  version: 1;
  updatedAt?: string;
  theme: Theme;
  site: SiteInfo;
  blocks: AnyBlock[];
};
