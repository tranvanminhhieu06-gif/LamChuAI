import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate, type Post } from "@/data/site";
import { CoverArt } from "@/components/ui/CoverArt";

export function PostCard({ post }: { post: Post }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <Link href={href} tabIndex={-1}>
        <CoverArt {...post.cover} tag={post.tag} className="aspect-[16/9]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={post.date} className="text-xs text-muted">
          {formatDate(post.date)}
        </time>
        <h3 className="mt-2 font-bold leading-snug text-brand-900">
          <Link href={href} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          Đọc tiếp <ArrowRight className="size-4" aria-hidden />
          <span className="sr-only">: {post.title}</span>
        </Link>
      </div>
    </article>
  );
}
