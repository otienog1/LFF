export function DatelinePanel() {
  return (
    <section className="bg-white border-b border-line py-20 md:py-28">
      <div className="container">
        <div className="grid md:grid-cols-[1fr_320px] gap-12 lg:gap-20 items-end">
          <div>
            <p className="font-display font-medium leading-[0.92] tracking-[-0.03em] text-ink text-[clamp(3rem,9vw,8rem)]">
              Amboseli,<br />Kenya
            </p>
            <p className="mt-5 eyebrow text-ink/40">2.5° S &nbsp;&middot;&nbsp; 37.3° E</p>
          </div>
          <div className="md:pb-2">
            <p className="body-lg text-ink-soft leading-[1.7]">
              Home to one of Africa&rsquo;s largest elephant populations, Amboseli is where
              breathtaking landscapes meet an urgent conservation story — and where every
              programme the Foundation runs begins.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
