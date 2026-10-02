import { Cpu, PenLine, Settings, Video, ChevronRight, type LucideIcon } from "lucide-react";
import { roadmap } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<(typeof roadmap)[number]["icon"], LucideIcon> = {
  chip: Cpu,
  pen: PenLine,
  video: Video,
  gear: Settings,
};

export function Roadmap() {
  return (
    <section
      id="lo-trinh"
      aria-labelledby="roadmap-title"
      className="scroll-mt-20 bg-gradient-to-b from-brand-50 to-brand-100/60 py-16 lg:py-20"
    >
      <div className="container-x">
        <SectionHeader
          id="roadmap-title"
          align="center"
          title="Lộ trình Làm Chủ AI"
          desc="Học theo lộ trình bài bản, từ cơ bản đến nâng cao, giúp bạn tự tin làm chủ AI trong marketing."
        />
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {roadmap.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <li key={s.step} className="relative">
                <div className="card relative h-full p-6 pt-8 text-center">
                  <span className="absolute -top-4 left-6 grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-glow">
                    {s.step}
                  </span>
                  <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white">
                    <Icon className="size-7" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold text-brand-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.desc}</p>
                  <span className="mt-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {s.time}
                  </span>
                </div>
                {i < roadmap.length - 1 && (
                  <ChevronRight
                    aria-hidden
                    className="absolute top-1/2 -right-7 hidden size-6 -translate-y-1/2 text-brand-400 lg:block"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
