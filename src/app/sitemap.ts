import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getCourses, getPosts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([getCourses(), getPosts()]);
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/khoa-hoc`, priority: 0.9 },
    { url: `${site.url}/blog`, priority: 0.8 },
    ...courses.map((c) => ({ url: `${site.url}/khoa-hoc/${c.slug}`, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}
