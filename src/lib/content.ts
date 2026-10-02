// Lớp truy cập dữ liệu. Các trang chỉ gọi những hàm này.
// Khi chuyển sang CMS, chỉ cần sửa phần thân hàm (fetch từ Sanity/Strapi…), giao diện giữ nguyên.
import { courses, posts, type Course, type Post } from "@/data/site";

export async function getCourses(): Promise<Course[]> {
  return courses;
}

export async function getCourse(slug: string): Promise<Course | undefined> {
  return courses.find((c) => c.slug === slug);
}

export async function getPosts(): Promise<Post[]> {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return posts.find((p) => p.slug === slug);
}
