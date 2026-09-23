import { describe, it, expect } from "vitest";
import { getAllSlugs, getPage, getAllPages } from "./content";
import { getProjects, hasWriteup } from "./projects";
import { parseWpContent } from "./wp";

describe("content layer", () => {
  it("returns every page slug", () => {
    expect(getAllSlugs().sort()).toEqual(
      ["/", "/about", "/contact", "/donate", "/get-involved", "/impact", "/our-work", "/projects"].sort()
    );
  });
  it("getPage returns the home page with a hero first block", () => {
    const home = getPage("/");
    expect(home?.title).toBe("Home");
    expect(home?.blocks[0].type).toBe("hero");
  });
  it("getPage returns undefined for an unknown slug", () => {
    expect(getPage("/nope")).toBeUndefined();
  });
  it("every block has an id and every image has alt text", () => {
    for (const page of getAllPages()) {
      for (const block of page.blocks) {
        expect(block.id).toBeTruthy();
        if ("image" in block && block.image) expect(block.image.alt.length).toBeGreaterThan(3);
      }
    }
  });
  it("locale data mirrors English structure", async () => {
    const { getAllPages: all } = await import("./content");
    const en = all("en"); const es = all("es"); const pt = all("pt");
    expect(es.map((p) => p.slug)).toEqual(en.map((p) => p.slug));
    expect(pt.map((p) => p.slug)).toEqual(en.map((p) => p.slug));
    en.forEach((p, i) => {
      expect(es[i].blocks.map((b) => b.id)).toEqual(p.blocks.map((b) => b.id));
      expect(pt[i].blocks.map((b) => b.id)).toEqual(p.blocks.map((b) => b.id));
    });
  });
});

describe("projects", () => {
  // Ten entries came from the WordPress export; nine were written from the 2021 to 2026 field record.
  const LEGACY = 10;
  const FIELD = ["olchani-project", "ubuntu-hay", "ubuntu-smiles", "outdoor-classroom-series", "nanare-art-challenge", "living-safely-with-wildlife", "mazingira-day-nairobi-national-park", "the-elephant-den", "scholarships"];

  it("are sorted newest first and all carry alt text", () => {
    const ps = getProjects();
    expect(ps.length).toBe(LEGACY + FIELD.length);
    for (let i = 1; i < ps.length; i++) expect(ps[i - 1].date >= ps[i].date).toBe(true);
    for (const p of ps) expect(p.featuredImage?.altText?.length ?? 0).toBeGreaterThan(3);
  });
  it("legacy entries keep their WordPress identity; field entries use the slug as id", () => {
    for (const p of getProjects()) {
      expect(p.id).toBeTruthy();
      if (FIELD.includes(p.slug)) {
        expect(p.id).toBe(p.slug);
        expect(p.databaseId).toBeUndefined();
      } else {
        expect(typeof p.databaseId).toBe("number");
      }
    }
    expect(new Set(getProjects().map((p) => p.id)).size).toBe(LEGACY + FIELD.length);
  });
  it("every entry has a write-up; none is left empty", () => {
    expect(getProjects().every(hasWriteup)).toBe(true);
  });
  it("field entries carry a marked placeholder until the foundation supplies a photograph", () => {
    for (const slug of FIELD) {
      const p = getProjects().find((x) => x.slug === slug)!;
      expect(p.featuredImage?.sourceUrl).toBe("/projects/placeholder.svg");
      expect(p.featuredImage?.altText).toMatch(/^Photograph to come/);
    }
  });
  it("parses the Dignity Housing write-up into paragraphs and images in order", () => {
    const nodes = parseWpContent(getProjects().find((p) => p.slug === "dignity-housing-for-wildife-rangers")!.content);
    const kinds = nodes.map((n) => n.kind);
    // Eight paragraphs: the tents, the programme, the 2021 start under Senior Warden Dadacha, the first homes at Nairobi,
    // the 2025 handovers, the Samburu build, the Samburu opening, the cost.
    expect(kinds.filter((k) => k === "p").length).toBe(8);
    expect(kinds.filter((k) => k === "img").length).toBe(5);
    expect(nodes[0].kind).toBe("p");
    expect((nodes.find((n) => n.kind === "p") as { html: string }).html).toContain("Nairobi National Park");
    expect(nodes.some((n) => n.kind === "p" && n.html.includes("<strong>Dignity Housing</strong>"))).toBe(true);
    expect(nodes.some((n) => n.kind === "p" && n.html.includes("Samburu"))).toBe(true);
  });
  it("the housing figure is written once, on the Impact page, and the donate cause agrees with it", async () => {
    const dataEn = (await import("@/data/data.json")).default as { donate: { causes: { id: string; progress?: { done: number; total: number } }[] } };
    for (const locale of ["en", "es", "pt"] as const) {
      const stats = getPage("/impact", locale)?.blocks.find((b) => b.type === "impact") as { items: { title: string }[] } | undefined;
      expect(stats?.items.find((i) => i.title.includes("25"))?.title).toBe(locale === "en" ? "6 of 25" : "6 de 25");
    }
    const cause = dataEn.donate.causes.find((c) => c.id === "dignity-housing")!;
    expect(cause.progress).toMatchObject({ done: 6, total: 25 });
  });
});
