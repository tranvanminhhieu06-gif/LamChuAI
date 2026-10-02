import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Courses } from "@/components/sections/Courses";
import { Roadmap } from "@/components/sections/Roadmap";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { Resources } from "@/components/sections/Resources";
import { Community } from "@/components/sections/Community";
import { site } from "@/data/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: "Hà Nội", addressCountry: "VN" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Features />
      <Courses />
      <Roadmap />
      <BlogPreview />
      <Resources />
      <Community />
    </>
  );
}
