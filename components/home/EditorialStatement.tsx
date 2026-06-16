export function EditorialStatement() {
  return (
    <section className="bg-green border-b border-green-deep py-20 md:py-28 overflow-hidden">
      <div className="container">
        <p className="eyebrow text-paper/50 mb-8">Our belief</p>
        <p className="font-display leading-[1] tracking-[-0.03em] text-[clamp(2.5rem,7vw,6.5rem)]">
          <span className="font-light text-paper/70">Every footprint</span>
          <br />
          <span className="font-medium text-paper">leaves a mark.</span>
        </p>
        <div className="mt-10 flex items-center gap-5">
          <div className="w-8 h-px bg-paper/30" />
          <p className="text-[11px] tracking-[0.2em] uppercase text-paper/40">
            Luigi Footprints Foundation &nbsp;&middot;&nbsp; Nairobi, Kenya
          </p>
        </div>
      </div>
    </section>
  );
}
