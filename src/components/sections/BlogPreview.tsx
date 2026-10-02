import { posts } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PostCard } from "@/components/cards/PostCard";

export function BlogPreview() {
  return (
    <section aria-labelledby="blog-title" className="py-16 lg:py-20">
      <div className="container-x">
        <SectionHeader
          id="blog-title"
          title="Kiến thức AI chuẩn SEO"
          desc="Cập nhật những bài viết hữu ích, hướng dẫn chi tiết, giúp bạn luôn đi trước một bước."
          more={{ href: "/blog", label: "Xem tất cả bài viết" }}
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
