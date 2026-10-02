import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  desc?: string;
  align?: "left" | "center";
  more?: { href: string; label: string };
  id?: string;
};

export function SectionHeader({ title, desc, align = "left", more, id }: Props) {
  if (align === "center") {
    return (
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 id={id} className="text-2xl font-extrabold text-brand-900 sm:text-3xl">
          {title}
        </h2>
        {desc && <p className="mt-3 text-muted">{desc}</p>}
      </div>
    );
  }
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 id={id} className="text-2xl font-extrabold text-brand-900 sm:text-3xl">
          {title}
        </h2>
        {desc && <p className="mt-2 text-muted">{desc}</p>}
      </div>
      {more && (
        <Link
          href={more.href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800"
        >
          {more.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
