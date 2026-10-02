import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";

const socials = [
  { label: "YouTube", short: "YT" },
  { label: "Facebook", short: "f" },
  { label: "Zalo", short: "Zalo" },
  { label: "Telegram", short: "TG" },
  { label: "TikTok", short: "TT" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Kiến thức AI – Kỹ năng thực chiến – Cộng đồng đồng hành cùng bạn làm chủ tương lai.
          </p>
          <ul className="mt-5 flex gap-2" aria-label="Mạng xã hội">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-lg bg-white/10 text-xs font-bold text-white transition hover:bg-brand-500"
                >
                  {s.short}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">Menu</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">Liên hệ</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-brand-300" aria-hidden />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-brand-300" aria-hidden />
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-brand-300" aria-hidden />
              {site.address}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 shrink-0 text-brand-300" aria-hidden />
              {site.hours}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">Đăng ký nhận tin</h3>
          <p className="mt-4 text-sm">Nhận thông tin khóa học mới, bài viết hay và tài nguyên miễn phí.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-white">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
