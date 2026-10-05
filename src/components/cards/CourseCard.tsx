import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatVND, type Course } from "@/data/site";
import { safeHref, safeSrc } from "@/content/normalize";
import type { CourseItem } from "@/content/types";
import { CoverArt } from "@/components/ui/CoverArt";

export const courseToItem = (c: Course): CourseItem => ({
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
});

export function CourseCard({ course }: { course: CourseItem }) {
  const href = safeHref(course.href || "#");
  const image = safeSrc(course.image);
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <Link href={href} tabIndex={-1} className="relative block">
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- site xuất tĩnh */}
            <img src={image} alt="" className="aspect-[16/10] w-full object-cover" />
            {course.tag && (
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-700">
                {course.tag}
              </span>
            )}
          </>
        ) : (
          <CoverArt
            title={course.coverTitle}
            from={course.coverFrom}
            to={course.coverTo}
            tag={course.tag}
            className="aspect-[16/10]"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="t-heading font-bold">
          <Link href={href} className="hover:text-brand-600">
            {course.title}
          </Link>
        </h3>
        <p className="t-body mt-2 line-clamp-3 text-sm">{course.excerpt}</p>
        {course.sessions && (
          <p className="t-body mt-4 flex items-center gap-1.5 text-xs">
            <CalendarDays className="size-3.5" aria-hidden />
            {course.sessions}
          </p>
        )}
        {course.price > 0 && <p className="mt-1 text-xl font-extrabold text-brand-600">{formatVND(course.price)}</p>}
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Xem chi tiết <ArrowRight className="size-4" aria-hidden />
            <span className="sr-only">khóa {course.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
