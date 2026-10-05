"use client";

import { iconOf } from "@/content/icons";
import { safeSrc } from "@/content/normalize";
import { CtaButton, type BlockProps } from "./shared";

const CHIP_POS = [
  { pos: "top-[6%] left-[22%]", anim: "animate-float" },
  { pos: "top-[2%] right-[2%]", anim: "animate-float-slow" },
  { pos: "top-[40%] left-[0%]", anim: "animate-float-slow" },
  { pos: "top-[36%] right-[0%]", anim: "animate-float" },
];

export function HeroBlock({ block, dark }: BlockProps<"hero">) {
  const { id, props: p } = block;
  const image = safeSrc(p.image);
  const lines = p.title.split("\n");
  return (
    <div className="container-x grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
      <div>
        <h1 id={`${id}-title`} className="t-heading text-4xl leading-[1.1] font-black tracking-tight sm:text-5xl lg:text-[56px]">
          {lines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        {p.subtitle && <p className="t-body mt-5 max-w-md text-lg">{p.subtitle}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaButton link={p.primary} dark={dark} />
          <CtaButton link={p.secondary} dark={dark} secondary />
        </div>
        {p.badges.length > 0 && (
          <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {p.badges.map((b, i) => {
              const Icon = iconOf(b.icon);
              return (
                <li key={i} className="flex items-center gap-2 text-sm whitespace-nowrap">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full ring-1 ${
                      dark ? "bg-white/15 ring-white/30" : "bg-brand-50 text-brand-600 ring-brand-100"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="leading-tight">
                    <span className="t-heading block font-semibold">{b.title}</span>
                    <span className="t-body">{b.sub}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- site xuất tĩnh, ảnh do quản trị viên nhập
          <img src={image} alt="" className="absolute top-[12%] left-[6%] h-[84%] w-[88%] rounded-[28px] object-cover shadow-2xl" />
        ) : (
          <Illustration />
        )}
        {p.chips.slice(0, CHIP_POS.length).map((c, i) => {
          const Icon = iconOf(c.icon);
          return (
            <div
              key={i}
              aria-hidden
              className={`glass absolute flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-brand-800 shadow-card sm:px-3 sm:py-2 sm:text-sm ${CHIP_POS[i].pos} ${CHIP_POS[i].anim}`}
            >
              <span className="grid size-7 place-items-center rounded-lg bg-brand-600 text-white sm:size-8">
                <Icon className="size-4" />
              </span>
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Minh họa laptop + chip AI, dùng khi chưa có ảnh thật. */
function Illustration() {
  return (
    <div aria-hidden>
      <div className="absolute inset-x-[8%] top-[22%] bottom-[8%] rounded-[28px] bg-white/10 ring-1 ring-white/25 backdrop-blur-sm" />
      <div className="absolute inset-x-[18%] top-[30%]">
        <div className="rounded-t-xl border-[6px] border-slate-800 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 shadow-2xl">
          <div className="relative aspect-[16/10] overflow-hidden">
            <div className="grid-bg absolute inset-0" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative grid size-24 place-items-center rounded-2xl border-2 border-sky-300/80 bg-brand-900/60 shadow-[0_0_40px_rgba(142,188,255,0.8)] sm:size-28">
                <span className="text-4xl font-black text-white sm:text-5xl">AI</span>
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
      <Plant className="absolute bottom-[10%] left-[4%] w-[12%]" />
      <Plant className="absolute right-[4%] bottom-[10%] w-[12%]" />
    </div>
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
