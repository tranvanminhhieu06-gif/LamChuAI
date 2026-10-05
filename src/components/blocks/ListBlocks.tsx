"use client";

import { ChevronRight } from "lucide-react";
import { iconOf } from "@/content/icons";
import { safeHref } from "@/content/normalize";
import { BlockHeader, CtaButton, GRID_COLS, type BlockProps } from "./shared";

export function FeaturesBlock({ block }: BlockProps<"features">) {
  const { id, props: p, layout } = block;
  return (
    <div className="container-x">
      <BlockHeader id={id} title={p.title} desc={p.desc} align={layout.align} />
      <ul className={`grid gap-4 ${GRID_COLS[layout.columns] ?? GRID_COLS[6]}`}>
        {p.items.map((it, i) => {
          const Icon = iconOf(it.icon);
          return (
            <li key={i} className="card bg-gradient-to-b from-white to-brand-50/60 p-5 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="t-heading mt-4 font-bold">{it.title}</h3>
              <p className="t-body mt-1.5 text-sm">{it.desc}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RoadmapBlock({ block }: BlockProps<"roadmap">) {
  const { id, props: p, layout } = block;
  const cols = layout.columns === 6 ? 4 : layout.columns;
  return (
    <div className="container-x">
      <BlockHeader id={id} title={p.title} desc={p.desc} align={layout.align} />
      <ol className={`grid gap-6 lg:gap-8 ${GRID_COLS[cols] ?? GRID_COLS[4]}`}>
        {p.items.map((s, i) => {
          const Icon = iconOf(s.icon);
          return (
            <li key={i} className="relative">
              <div className="card relative h-full p-6 pt-8 text-center">
                <span className="absolute -top-4 left-6 grid size-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-glow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white">
                  <Icon className="size-7" aria-hidden />
                </span>
                <h3 className="t-heading mt-4 font-bold">{s.title}</h3>
                <p className="t-body mt-2 text-sm">{s.desc}</p>
                {s.time && (
                  <span className="mt-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {s.time}
                  </span>
                )}
              </div>
              {i < p.items.length - 1 && cols === 4 && (
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
  );
}

export function ResourcesBlock({ block }: BlockProps<"resources">) {
  const { id, props: p, layout } = block;
  return (
    <div className="container-x">
      <BlockHeader id={id} title={p.title} desc={p.desc} align={layout.align} more={p.more} />
      <ul className={`grid gap-5 ${GRID_COLS[layout.columns] ?? GRID_COLS[4]}`}>
        {p.items.map((r, i) => {
          const Icon = iconOf(r.icon);
          return (
            <li key={i} className="card flex gap-4 p-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white">
                <Icon className="size-6" aria-hidden />
              </span>
              <div className="flex flex-col">
                <h3 className="t-heading font-bold">{r.title}</h3>
                <p className="t-body mt-1 text-sm">{r.desc}</p>
                {r.button.label && (
                  <a
                    href={safeHref(r.button.href || "#")}
                    className="mt-3 inline-flex h-11 w-fit items-center rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    {r.button.label}
                    <span className="sr-only"> {r.title}</span>
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const STAT_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  6: "grid-cols-3",
};

export function StatsBlock({ block, dark }: BlockProps<"stats">) {
  const { id, props: p, layout } = block;
  const center = layout.align === "center";
  return (
    <div className={`container-x grid items-center gap-10 ${center ? "text-center" : "lg:grid-cols-[1fr_1.2fr]"}`}>
      <div className={center ? "mx-auto max-w-2xl" : ""}>
        {p.eyebrow && <p className="t-eyebrow text-xs font-bold tracking-widest uppercase">{p.eyebrow}</p>}
        <h2 id={`${id}-title`} className="t-heading mt-2 text-2xl font-extrabold sm:text-3xl">
          {p.title}
        </h2>
        {p.desc && <p className={`t-body mt-3 ${center ? "" : "max-w-md"}`}>{p.desc}</p>}
        <CtaButton link={p.cta} dark={dark} className="mt-6" />
      </div>
      <ul className={`grid gap-3 sm:gap-5 ${STAT_COLS[layout.columns] ?? STAT_COLS[3]}`}>
        {p.items.map((s, i) => {
          const Icon = iconOf(s.icon);
          return (
            <li
              key={i}
              className={`rounded-2xl p-4 text-center ring-1 sm:p-6 ${
                dark ? "bg-white/10 ring-white/25 backdrop-blur" : "bg-white ring-brand-100 shadow-card"
              }`}
            >
              <Icon className={`mx-auto size-6 ${dark ? "text-sky-200" : "text-brand-500"}`} aria-hidden />
              <p className="t-heading mt-2 text-2xl font-black sm:text-3xl">{s.value}</p>
              <p className="t-body mt-1 text-sm">{s.label}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
