import { BookOpenCheck, Gift, Users } from "lucide-react";
import { stats } from "@/data/site";
import { Button } from "@/components/ui/Button";

const statIcons = [Users, BookOpenCheck, Gift];

export function Community() {
  return (
    <section
      id="cong-dong"
      aria-labelledby="community-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 text-white"
    >
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="absolute -right-24 -bottom-24 -z-10 size-96 rounded-full bg-sky-300/25 blur-3xl" />
      <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs font-bold tracking-widest text-sky-200 uppercase">Cộng đồng của chúng tôi</p>
          <h2 id="community-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Cùng nhau học hỏi – Cùng nhau phát triển
          </h2>
          <p className="mt-3 max-w-md text-white/85">
            Hàng nghìn học viên đã và đang làm chủ AI để tạo ra những thay đổi tích cực trong công việc và cuộc sống.
          </p>
          <Button href="/khoa-hoc" variant="white" arrow className="mt-6">
            Bắt đầu học ngay
          </Button>
        </div>
        <ul className="grid grid-cols-3 gap-3 sm:gap-5">
          {stats.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <li key={s.label} className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/25 backdrop-blur sm:p-6">
                <Icon className="mx-auto size-6 text-sky-200" aria-hidden />
                <p className="mt-2 text-2xl font-black sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-sm text-white/90">{s.label}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
