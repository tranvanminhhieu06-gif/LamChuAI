import { courses } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CourseCard } from "@/components/cards/CourseCard";

export function Courses() {
  return (
    <section aria-labelledby="courses-title" className="pb-16 lg:pb-20">
      <div className="container-x">
        <SectionHeader
          id="courses-title"
          title="Khóa học nổi bật"
          desc="Những khóa học được thiết kế bài bản, thực chiến, giúp bạn ứng dụng AI ngay vào công việc và kinh doanh."
          more={{ href: "/khoa-hoc", label: "Xem tất cả khóa học" }}
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <li key={c.slug}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
