import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPost, getPosts } from "@/lib/content";
import { formatDate, site } from "@/data/site";
import { CoverArt } from "@/components/ui/CoverArt";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function PostDetail({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article className="container-x max-w-3xl py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800">
        <ChevronLeft className="size-4" aria-hidden /> Tất cả bài viết
      </Link>
      <p className="mt-6 text-sm font-semibold text-brand-600">{post.tag}</p>
      <h1 className="mt-2 text-3xl leading-tight font-black text-brand-900 sm:text-4xl">{post.title}</h1>
      <time dateTime={post.date} className="mt-3 block text-sm text-muted">
        {formatDate(post.date)}
      </time>
      <CoverArt {...post.cover} className="mt-8 aspect-[16/8] rounded-2xl" />
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/90">
        <p className="font-medium">{post.excerpt}</p>
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
