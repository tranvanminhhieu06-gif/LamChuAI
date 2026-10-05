"use client";

import { posts } from "@/data/site";
import { CourseCard } from "@/components/cards/CourseCard";
import { PostCard } from "@/components/cards/PostCard";
import { BlockHeader, GRID_COLS, type BlockProps } from "./shared";

export function CoursesBlock({ block }: BlockProps<"courses">) {
  const { id, props: p, layout } = block;
  return (
    <div className="container-x">
      <BlockHeader id={id} title={p.title} desc={p.desc} align={layout.align} more={p.more} />
      <ul className={`grid gap-5 ${GRID_COLS[layout.columns] ?? GRID_COLS[4]}`}>
        {p.items.map((c, i) => (
          <li key={i}>
            <CourseCard course={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Bài viết lấy từ mã nguồn (mỗi bài có trang riêng được tạo lúc build); khối chỉ chọn số lượng hiển thị.
const latestPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function PostsBlock({ block }: BlockProps<"posts">) {
  const { id, props: p, layout } = block;
  return (
    <div className="container-x">
      <BlockHeader id={id} title={p.title} desc={p.desc} align={layout.align} more={p.more} />
      <ul className={`grid gap-6 ${GRID_COLS[layout.columns] ?? GRID_COLS[3]}`}>
        {latestPosts.slice(0, Math.max(1, p.count)).map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
