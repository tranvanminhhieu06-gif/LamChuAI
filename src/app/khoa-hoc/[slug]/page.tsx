import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, ChevronLeft } from "lucide-react";
import { getCourse, getCourses } from "@/lib/content";
import { formatVND, site } from "@/data/site";
import { CoverArt } from "@/components/ui/CoverArt";
import { Button } from "@/components/ui/Button";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/khoa-hoc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return { title: course.title, description: course.excerpt };
}

export default async function CourseDetail({ params }: PageProps<"/khoa-hoc/[slug]">) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.excerpt,
    provider: { "@type": "Organization", name: site.name, sameAs: site.url },
    offers: { "@type": "Offer", price: course.price, priceCurrency: "VND", category: "Paid" },
  };

  return (
    <article className="container-x py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link href="/khoa-hoc" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800">
        <ChevronLeft className="size-4" aria-hidden /> Tất cả khóa học
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <CoverArt {...course.cover} tag={course.tag} className="aspect-[16/8] rounded-2xl" />
          <h1 className="mt-8 text-3xl font-black text-brand-900 sm:text-4xl">{course.title}</h1>
          <p className="mt-3 text-lg text-muted">{course.excerpt}</p>

          <h2 className="mt-10 text-xl font-bold text-brand-900">Bạn sẽ đạt được</h2>
          <ul className="mt-4 space-y-3">
            {course.outcomes.map((o) => (
              <li key={o} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-sm text-muted">Học phí</p>
            <p className="mt-1 text-3xl font-black text-brand-600">{formatVND(course.price)}</p>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted">
              <CalendarDays className="size-4" aria-hidden /> {course.sessions}
            </p>
            {/* Giai đoạn 4: thay bằng form đăng ký gửi về webhook n8n */}
            <Button href={`tel:${site.phone.replace(/\s/g, "")}`} arrow className="mt-6 w-full">
              Đăng ký ngay
            </Button>
            <p className="mt-3 text-center text-xs text-muted">Tư vấn miễn phí qua {site.phone}</p>
          </div>
        </aside>
      </div>
    </article>
  );
}
