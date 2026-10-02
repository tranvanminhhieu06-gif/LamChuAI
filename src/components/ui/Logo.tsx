import Link from "next/link";

// Chưa có logo: tạm hiển thị tên dạng chữ. Khi có logo, thay phần <span> bằng <Image>.
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`text-lg font-extrabold tracking-tight whitespace-nowrap sm:text-xl ${
        light ? "text-white" : "text-brand-900"
      }`}
    >
      <span>Cộng đồng Làm chủ AI</span>
    </Link>
  );
}
