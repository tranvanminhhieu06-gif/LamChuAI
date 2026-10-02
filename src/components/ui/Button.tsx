import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost-light" | "soft" | "white";

const styles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow hover:from-brand-700 hover:to-brand-600",
  outline:
    "border border-white/70 bg-white/10 text-white backdrop-blur hover:bg-white/20",
  "ghost-light":
    "border border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50",
  soft: "bg-brand-600 text-white hover:bg-brand-700",
  white: "bg-white text-brand-700 shadow-lg hover:bg-brand-50",
};

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: "sm" | "md";
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  arrow,
  className = "",
  children,
  ...rest
}: Props) {
  const sizing = size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-6 text-[15px]";
  return (
    <Link
      {...rest}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${sizing} ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowRight className="size-4" aria-hidden />}
    </Link>
  );
}
