import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/projects";
import { getPage } from "@/lib/content";
import type { Locale } from "@/i18n/config";
import type { ProjectsHeroBlock } from "@/types/content";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "pt" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const page = getPage("/projects", loc);
  return { title: page?.seo.title, description: page?.seo.description };
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);

  const projects = getProjects(loc);
  const page = getPage("/projects", loc);
  const [hero] = (page?.blocks ?? []) as [ProjectsHeroBlock];

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-paper border-b border-paper/10 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container">
          <p className="eyebrow text-paper/50 mb-4">{hero?.subtitle ?? "Field Work"}</p>
          <h1 className="display-1 max-w-[16ch]">{hero?.title ?? "Projects & Programmes"}</h1>
          <p className="mt-5 text-paper/60 text-base md:text-lg max-w-[48ch] leading-relaxed">
            {hero?.content ?? "A record of conservation, community, and wildlife initiatives carried out across Kenya since the Foundation began."}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-paper border-b border-line py-20 md:py-28">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {projects.map((project, i) => (
              <Link href={`/${loc}/projects/${project.slug}`} key={project.id}>
                <article className="group flex flex-col">
                  {project.featuredImage && (
                    <div className="relative aspect-4/3 overflow-hidden mb-5">
                      <Image
                        src={project.featuredImage.sourceUrl}
                        alt={project.featuredImage.altText || project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={i < 3}
                      />
                    </div>
                  )}
                  <p className="eyebrow text-ink/40 mb-2">{formatDate(project.date, loc)}</p>
                  <h2 className="font-display font-medium text-lg leading-[1.3] text-ink capitalize group-hover:text-green transition-colors">
                    {project.title}
                  </h2>
                  {project.excerpt && (
                    <p className="mt-2 text-ink-soft text-sm leading-relaxed line-clamp-2">
                      {project.excerpt}
                    </p>
                  )}
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
