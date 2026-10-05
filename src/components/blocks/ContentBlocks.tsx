"use client";

import { ChevronDown, CircleCheck, ImageIcon } from "lucide-react";
import { safeSrc } from "@/content/normalize";
import { BlockHeader, CtaButton, Paragraphs, type BlockProps } from "./shared";

export function TextBlock({ block, dark }: BlockProps<"text">) {
  const { id, props: p, layout } = block;
  const center = layout.align === "center";
  return (
    <div className={`container-x max-w-3xl ${center ? "text-center" : ""}`}>
      {p.eyebrow && <p className="t-eyebrow text-xs font-bold tracking-widest uppercase">{p.eyebrow}</p>}
      {p.title && (
        <h2 id={`${id}-title`} className="t-heading mt-2 text-2xl font-extrabold sm:text-3xl">
          {p.title}
        </h2>
      )}
      <div className="t-body mt-4 space-y-4 text-base leading-relaxed sm:text-lg">
        <Paragraphs text={p.body} />
      </div>
      <CtaButton link={p.cta} dark={dark} className="mt-8" />
    </div>
  );
}

export function CtaBlock({ block, dark }: BlockProps<"cta">) {
  const { id, props: p, layout } = block;
  const center = layout.align === "center";
  return (
    <div
      className={`container-x flex flex-col gap-6 ${
        center ? "items-center text-center" : "lg:flex-row lg:items-center lg:justify-between"
      }`}
    >
      <div className="max-w-2xl">
        <h2 id={`${id}-title`} className="t-heading text-2xl font-extrabold sm:text-4xl">
          {p.title}
        </h2>
        {p.desc && <p className="t-body mt-3 text-lg">{p.desc}</p>}
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        <CtaButton link={p.primary} dark={dark} />
        <CtaButton link={p.secondary} dark={dark} secondary />
      </div>
    </div>
  );
}

export function ImageTextBlock({ block, dark }: BlockProps<"imageText">) {
  const { id, props: p } = block;
  const image = safeSrc(p.image);
  return (
    <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={p.imageSide === "left" ? "lg:order-2" : ""}>
        {p.eyebrow && <p className="t-eyebrow text-xs font-bold tracking-widest uppercase">{p.eyebrow}</p>}
        <h2 id={`${id}-title`} className="t-heading mt-2 text-2xl font-extrabold sm:text-3xl">
          {p.title}
        </h2>
        <div className="t-body mt-4 space-y-4 leading-relaxed">
          <Paragraphs text={p.body} />
        </div>
        {p.bullets.length > 0 && (
          <ul className="mt-6 space-y-3">
            {p.bullets.map((b, i) => (
              <li key={i} className="t-heading flex items-start gap-3 font-medium">
                <CircleCheck className={`mt-0.5 size-5 shrink-0 ${dark ? "text-sky-200" : "text-brand-500"}`} aria-hidden />
                {b.text}
              </li>
            ))}
          </ul>
        )}
        <CtaButton link={p.cta} dark={dark} className="mt-8" />
      </div>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- site xuất tĩnh, ảnh do quản trị viên nhập
        <img src={image} alt={p.imageAlt} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card" />
      ) : (
        <div className="grid aspect-[4/3] w-full place-items-center rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50 text-brand-400">
          <ImageIcon className="size-12" aria-hidden />
        </div>
      )}
    </div>
  );
}

export function FaqBlock({ block }: BlockProps<"faq">) {
  const { id, props: p, layout } = block;
  return (
    <div className="container-x max-w-3xl">
      <BlockHeader id={id} title={p.title} desc={p.desc} align={layout.align} />
      <div className="space-y-3">
        {p.items.map((it, i) => (
          <details key={i} className="card group p-0 hover:translate-y-0">
            <summary className="t-heading flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold">
              {it.q}
              <ChevronDown className="size-5 shrink-0 text-brand-500 transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="t-body space-y-3 px-5 pb-5 text-sm leading-relaxed">
              <Paragraphs text={it.a} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
