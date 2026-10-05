export function PageHero({ title, desc, eyebrow }: { title: string; desc?: string; eyebrow?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="container-x py-14 lg:py-16">
        {eyebrow && <p className="text-xs font-bold tracking-widest text-sky-200 uppercase">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl leading-tight font-black sm:text-4xl">{title}</h1>
        {desc && <p className="mt-3 max-w-2xl text-white/90">{desc}</p>}
      </div>
    </section>
  );
}
