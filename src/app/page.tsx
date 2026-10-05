import { BlockRenderer } from "@/components/blocks/BlockRenderer";
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

// Các khối của trang chủ được chỉnh trong /admin; bản dựng sẵn dùng nội dung mặc định
// và tự cập nhật theo bản đã xuất bản khi tải trang.
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BlockRenderer />
    </>
  );
}
