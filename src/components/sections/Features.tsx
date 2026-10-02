import { Bot, Megaphone, PenLine, Search, UserRound, Video, type LucideIcon } from "lucide-react";
import { features, type FeatureIcon } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<FeatureIcon, LucideIcon> = {
  megaphone: Megaphone,
  pen: PenLine,
  search: Search,
  video: Video,
  user: UserRound,
  bot: Bot,
};

export function Features() {
  return (
    <section aria-labelledby="features-title" className="py-16 lg:py-20">
      <div className="container-x">
        <SectionHeader
          id="features-title"
          align="center"
          title="Học gì tại Cộng đồng Làm chủ AI?"
          desc="Trang bị đầy đủ kỹ năng và công cụ AI để tạo ra nội dung chất lượng, tăng trưởng kênh và xây dựng thương hiệu cá nhân vững mạnh."
        />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {features.map(({ icon, title, desc }) => {
            const Icon = icons[icon];
            return (
              <li key={title} className="card bg-gradient-to-b from-white to-brand-50/60 p-5 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-bold text-brand-900">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{desc}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
