import type { Metadata } from "next";
import { getCourses } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { CourseCard } from "@/components/cards/CourseCard";

export const metadata: Metadata = {
  title: "Khóa học",
  description: "Các khóa học Marketing AI thực chiến: Content AI, SEO AI, Video AI và Automation.",
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <>
      <PageHero
        eyebrow="Khóa học"
        title="Tất cả khóa học"
        desc="Chọn khóa học phù hợp với mục tiêu của bạn. Mỗi khóa đều có bài tập thực hành và hỗ trợ trọn đời."
      />
      <div className="container-x py-14">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <li key={c.slug}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
