import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatVND, type Course } from "@/data/site";
import { CoverArt } from "@/components/ui/CoverArt";

export function CourseCard({ course }: { course: Course }) {
  const href = `/khoa-hoc/${course.slug}`;
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <Link href={href} tabIndex={-1}>
        <CoverArt {...course.cover} tag={course.tag} className="aspect-[16/10]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-brand-900">
          <Link href={href} className="hover:text-brand-600">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{course.excerpt}</p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
          <CalendarDays className="size-3.5" aria-hidden />
          {course.sessions}
        </p>
        <p className="mt-1 text-xl font-extrabold text-brand-600">{formatVND(course.price)}</p>
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
