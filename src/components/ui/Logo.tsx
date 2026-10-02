import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex flex-col leading-none" aria-label="Cộng Đồng Làm Chủ AI – Trang chủ">
      <span
        className={`self-start rounded-md px-2 py-0.5 text-[11px] font-extrabold tracking-wide uppercase ${
          light ? "bg-white text-brand-700" : "bg-brand-600 text-white"
        }`}
      >
        Cộng Đồng
      </span>
      <span
        className={`mt-0.5 text-xl font-black tracking-tight ${light ? "text-white" : "text-brand-900"}`}
      >
        LÀM CHỦ AI
      </span>
    </Link>
  );
}
