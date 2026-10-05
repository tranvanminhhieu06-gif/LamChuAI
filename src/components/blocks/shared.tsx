"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { usePreview } from "@/content/ContentProvider";
import { safeHref } from "@/content/normalize";
import type { AnyBlock, Background, Columns, LinkValue, Spacing } from "@/content/types";
import { Button } from "@/components/ui/Button";

const BG: Record<Background, string> = {
  white: "bg-white",
  soft: "bg-gradient-to-b from-brand-50 to-brand-100/60",
  brand: "bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 tone-dark",
  deep: "bg-gradient-to-r from-brand-900 via-brand-700 to-brand-600 tone-dark",
  dark: "bg-navy tone-dark",
};

const PAD: Record<Spacing, [string, string]> = {
  sm: ["pt-10 lg:pt-14", "pb-10 lg:pb-14"],
  md: ["pt-14 lg:pt-20", "pb-14 lg:pb-20"],
  lg: ["pt-20 lg:pt-28", "pb-20 lg:pb-28"],
};

export const GRID_COLS: Record<Columns, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
};

export const isDarkBg = (bg: Background) => bg === "brand" || bg === "deep" || bg === "dark";

export type BlockProps<T extends AnyBlock["type"]> = {
  block: Extract<AnyBlock, { type: T }>;
  dark: boolean;
};

/** Khung chung của mọi khối: nền, khoảng cách, id neo, đánh dấu khi xem trước. */
export function BlockShell({
  block,
  flushTop,
  children,
}: {
  block: AnyBlock;
  /** Bỏ khoảng trên khi khối liền trước cùng nền, tránh khoảng trống gấp đôi. */
  flushTop: boolean;
  children: ReactNode;
}) {
  const { selectedId } = usePreview();
  const { background, spacing, anchor } = block.layout;
  const bg = BG[background] ?? BG.white;
  const [pt, pb] = PAD[spacing] ?? PAD.md;
  const decorated = background === "brand" || background === "deep";
  return (
    <section
      id={anchor || undefined}
      aria-labelledby={`${block.id}-title`}
      data-block-id={block.id}
      data-selected={selectedId === block.id || undefined}
      className={`relative isolate scroll-mt-20 overflow-hidden ${bg} ${flushTop ? "pt-0" : pt} ${pb}`}
    >
      {decorated && (
        <>
          <div className="grid-bg absolute inset-0 -z-10" />
          <div className="absolute -top-40 right-0 -z-10 size-[520px] rounded-full bg-sky-300/25 blur-3xl" />
        </>
      )}
      {children}
    </section>
  );
}

export function BlockHeader({
  id,
  title,
  desc,
  align,
  more,
}: {
  id: string;
  title: string;
  desc?: string;
  align: "left" | "center";
  more?: LinkValue;
}) {
  if (!title && !desc) return null;
  const showMore = more?.label && more.href;
  if (align === "center") {
    return (
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={`${id}-title`} className="t-heading text-2xl font-extrabold sm:text-3xl">
          {title}
        </h2>
        {desc && <p className="t-body mt-3">{desc}</p>}
        {showMore && (
          <Link href={safeHref(more.href)} className="t-eyebrow mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:underline">
            {more.label} <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 id={`${id}-title`} className="t-heading text-2xl font-extrabold sm:text-3xl">
          {title}
        </h2>
        {desc && <p className="t-body mt-2">{desc}</p>}
      </div>
      {showMore && (
        <Link
          href={safeHref(more.href)}
          className="t-eyebrow inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline"
        >
          {more.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** Nút hành động; tự bỏ qua khi chưa nhập nhãn hoặc link. */
export function CtaButton({
  link,
  dark,
  secondary,
  className,
}: {
  link: LinkValue;
  dark: boolean;
  secondary?: boolean;
  className?: string;
}) {
  if (!link.label || !link.href) return null;
  const variant = secondary ? (dark ? "outline" : "ghost-light") : dark ? "white" : "primary";
  return (
    <Button href={safeHref(link.href)} variant={variant} arrow={!secondary} className={className}>
      {link.label}
    </Button>
  );
}

/** Văn bản nhiều đoạn: dòng trống tách đoạn, xuống dòng giữ nguyên. */
export function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return text
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p, i) => (
      <p key={i} className={className}>
        {p.split("\n").map((line, j) => (
          <span key={j}>
            {j > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    ));
}
