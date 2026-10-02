import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/cards/PostCard";

export const metadata: Metadata = {
  title: "Blog AI",
  description: "Kiến thức AI chuẩn SEO: hướng dẫn Content AI, SEO AI, Video AI và tự động hóa marketing.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        eyebrow="Blog AI"
        title="Kiến thức AI chuẩn SEO"
        desc="Hướng dẫn chi tiết, cập nhật liên tục để bạn ứng dụng AI vào marketing ngay hôm nay."
      />
      <div className="container-x py-14">
        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
