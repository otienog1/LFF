import Link from "next/link";
import ContactForm from "@/components/contact/ContactForm";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/our-work", label: "Our Work" },
  { href: "/impact", label: "Impact" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/donate", label: "Donate" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container py-16 md:py-24 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-display text-2xl">Luigi Footprints</p>
          <p className="mt-4 text-paper/70 max-w-[34ch] text-sm leading-relaxed">
            Protecting wildlife by empowering communities across Kenya&rsquo;s Amboseli ecosystem and beyond.
          </p>
          <div className="flex gap-4 mt-6 text-sm text-paper/70">
            <a href="https://www.facebook.com/ManiagoSafarisEastAfrica" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">Facebook</a>
            <a href="https://www.instagram.com/maniagosafaris/" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">Instagram</a>
            <a href="https://www.youtube.com/channel/UCVmNdFZ3SvfszacIMCfpPHg" target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">YouTube</a>
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 flex flex-col gap-3 text-sm text-paper/80">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-paper transition-colors">{l.label}</Link>
          ))}
          <Link href="/contact" className="hover:text-paper transition-colors">Contact</Link>
        </nav>
        <div className="md:col-span-5">
          <p className="eyebrow text-paper/70!">Get in touch</p>
          <div className="mt-4"><ContactForm /></div>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="container py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/55">
          <span>&copy; {new Date().getFullYear()} Luigi Footprints Foundation</span>
          <span>Protecting Wildlife. Empowering Communities. Inspiring Change.</span>
        </div>
      </div>
    </footer>
  );
}
