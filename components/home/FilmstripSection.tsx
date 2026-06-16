import Image from "next/image";

const IMAGES = [
  { url: "https://api.theluigifootprints.org/wp-content/uploads/2022/01/Luigi.webp", alt: "Luigi Francescon in the field" },
  { url: "https://api.theluigifootprints.org/wp-content/uploads/2021/12/Group-239-1.webp", alt: "Youth educational programmes" },
  { url: "https://api.theluigifootprints.org/wp-content/uploads/2022/01/Peter_Karanja.webp", alt: "The Olchani tree nursery" },
  { url: "https://api.theluigifootprints.org/wp-content/uploads/2021/12/Group-240.webp", alt: "Maasai women's enterprise" },
  { url: "https://api.theluigifootprints.org/wp-content/uploads/2021/11/DG.webp", alt: "Conservation ranger programme" },
  { url: "https://api.theluigifootprints.org/wp-content/uploads/2022/01/Tree-Planting.webp", alt: "Community tree planting" },
];

export function FilmstripSection() {
  return (
    <div className="border-b border-line overflow-x-auto scrollbar-hide">
      <div className="flex">
        {IMAGES.map((img, i) => (
          <div key={i} className="relative h-[44vh] w-[72vw] md:w-[36vw] lg:w-[22vw] shrink-0">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 72vw, (max-width: 1024px) 36vw, 22vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
