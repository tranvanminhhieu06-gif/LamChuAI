// Ảnh bìa tạm bằng CSS cho khóa học / bài viết.
// Khi có ảnh thật, thay component này bằng <Image src=... /> của next/image.

type Props = {
  title: string;
  from: string;
  to: string;
  tag?: string;
  className?: string;
};

export function CoverArt({ title, from, to, tag, className = "" }: Props) {
  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="absolute -right-10 -bottom-12 size-44 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -top-8 -left-8 size-32 rounded-full bg-brand-300/30 blur-2xl" />
      {/* Vòng mạch AI */}
      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 h-full w-full opacity-30"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="white" strokeWidth="0.8">
          <path d="M0 90 H60 L75 75 H120" />
          <path d="M200 30 H150 L135 45 H95" />
          <path d="M30 0 V25 L45 40" />
          <path d="M170 120 V95 L155 80" />
        </g>
        <g fill="white">
          <circle cx="120" cy="75" r="2" />
          <circle cx="95" cy="45" r="2" />
          <circle cx="45" cy="40" r="2" />
          <circle cx="155" cy="80" r="2" />
        </g>
      </svg>
      <div className="relative flex h-full items-center justify-center p-4">
        <span className="text-center text-3xl leading-none font-black tracking-tight text-white drop-shadow-[0_0_18px_rgba(142,188,255,0.9)] sm:text-4xl">
          {title}
        </span>
      </div>
      {tag && (
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700">
          {tag}
        </span>
      )}
    </div>
  );
}
