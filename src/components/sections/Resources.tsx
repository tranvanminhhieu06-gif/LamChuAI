import { BookOpen, ClipboardCheck, FileText, MessageSquareText, type LucideIcon } from "lucide-react";
import { resources } from "@/data/site";
import { SectionHeader } from "@/components/ui/SectionHeader";

const icons: Record<(typeof resources)[number]["icon"], LucideIcon> = {
  message: MessageSquareText,
  check: ClipboardCheck,
  file: FileText,
  book: BookOpen,
};

export function Resources() {
  return (
    <section id="tai-nguyen" aria-labelledby="resources-title" className="scroll-mt-20 pb-16 lg:pb-20">
      <div className="container-x">
        <SectionHeader
          id="resources-title"
          title="Tài nguyên miễn phí"
          desc="Những công cụ và tài liệu hữu ích, giúp bạn bắt đầu và tiến xa hơn trong hành trình làm chủ AI."
          more={{ href: "/#tai-nguyen", label: "Xem tất cả tài nguyên" }}
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r) => {
            const Icon = icons[r.icon];
            return (
              <li key={r.title} className="card flex gap-4 p-5">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                  <Icon className="size-6" aria-hidden />
                </span>
                <div className="flex flex-col">
                  <h3 className="font-bold text-brand-900">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted">{r.desc}</p>
                  <a
                    href="#"
                    className="mt-3 inline-flex h-11 w-fit items-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Tải ngay<span className="sr-only"> {r.title}</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
