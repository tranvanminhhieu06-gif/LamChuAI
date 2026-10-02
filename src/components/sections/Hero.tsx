import { Bot, FileText, Headphones, MonitorPlay, Play, Search, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

const badges = [
  { icon: Target, title: "Thực chiến", sub: "100%" },
  { icon: MonitorPlay, title: "Học online", sub: "linh hoạt" },
  { icon: Users, title: "Giảng viên", sub: "kinh nghiệm" },
  { icon: Headphones, title: "Hỗ trợ", sub: "trọn đời" },
];

const floatCards = [
  { icon: Search, label: "SEO AI", pos: "top-[6%] left-[22%]", anim: "animate-float" },
  { icon: FileText, label: "Content AI", pos: "top-[2%] right-[2%]", anim: "animate-float-slow" },
  { icon: Play, label: "Video AI", pos: "top-[40%] left-[0%]", anim: "animate-float-slow" },
  { icon: Bot, label: "Automation", pos: "top-[36%] right-[0%]", anim: "animate-float" },
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 text-white"
    >
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="absolute -top-40 right-0 -z-10 size-[520px] rounded-full bg-sky-300/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 -z-10 size-[420px] rounded-full bg-brand-900/40 blur-3xl" />

      <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <h1 id="hero-title" className="text-4xl leading-[1.1] font-black tracking-tight sm:text-5xl lg:text-[56px]">
            Làm Chủ
            <br />
            Marketing Trong
            <br />
            Kỷ Nguyên AI
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/90">
            Học Marketing AI thực chiến – xây hệ thống nội dung, SEO, video và thương hiệu cá nhân với AI.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/khoa-hoc" variant="white" arrow>
              Xem khóa học
            </Button>
            <Button href="/#lo-trinh" variant="outline">
              Khám phá lộ trình
            </Button>
          </div>
          <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {badges.map(({ icon: Icon, title, sub }) => (
              <li key={title} className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold">{title}</span>
                  <span className="text-white/75">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Minh họa. Khi có ảnh thật: đặt file vào public/images/hero.webp và dùng next/image ở đây. */}
        <div className="relative mx-auto aspect-[5/4] w-full max-w-xl" aria-hidden>
          <div className="absolute inset-x-[8%] top-[22%] bottom-[8%] rounded-[28px] bg-white/10 ring-1 ring-white/25 backdrop-blur-sm" />

          {/* Laptop */}
          <div className="absolute inset-x-[18%] top-[30%]">
            <div className="rounded-t-xl border-[6px] border-slate-800 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 shadow-2xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="grid-bg absolute inset-0" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative grid size-24 place-items-center rounded-2xl border-2 border-sky-300/80 bg-brand-900/60 shadow-[0_0_40px_rgba(142,188,255,0.8)] sm:size-28">
                    <span className="text-4xl font-black text-white sm:text-5xl">AI</span>
                    {/* chân chip */}
                    {[0, 1, 2, 3].map((i) => (
                      <span key={`t${i}`} className="absolute -top-3 h-3 w-0.5 bg-sky-300/80" style={{ left: `${22 + i * 18}%` }} />
                    ))}
                    {[0, 1, 2, 3].map((i) => (
                      <span key={`b${i}`} className="absolute -bottom-3 h-3 w-0.5 bg-sky-300/80" style={{ left: `${22 + i * 18}%` }} />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-1">
                  {[40, 64, 52, 80, 70].map((h, i) => (
                    <span key={i} className="w-2 rounded-sm bg-sky-300/70" style={{ height: h / 4 }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-[-8%] h-3 rounded-b-xl bg-gradient-to-b from-slate-300 to-slate-400" />
          </div>

          {/* Chậu cây */}
          <Plant className="absolute bottom-[10%] left-[4%] w-[12%]" />
          <Plant className="absolute right-[4%] bottom-[10%] w-[12%]" />

          {floatCards.map(({ icon: Icon, label, pos, anim }) => (
            <div
              key={label}
              className={`glass absolute flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-brand-800 shadow-card sm:px-3 sm:py-2 sm:text-sm ${pos} ${anim}`}
            >
              <span className="grid size-7 place-items-center rounded-lg bg-brand-600 text-white sm:size-8">
                <Icon className="size-4" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Plant({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" className={className}>
      <g fill="#34d399">
        <ellipse cx="30" cy="22" rx="10" ry="18" />
        <ellipse cx="16" cy="32" rx="8" ry="14" transform="rotate(-30 16 32)" />
        <ellipse cx="44" cy="32" rx="8" ry="14" transform="rotate(30 44 32)" />
      </g>
      <path d="M14 48 H46 L42 78 H18 Z" fill="#f8fafc" />
    </svg>
  );
}
