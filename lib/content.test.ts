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
  it("are sorted newest first and all carry alt text", () => {
    const ps = getProjects();
    expect(ps.length).toBe(10);
    for (let i = 1; i < ps.length; i++) expect(ps[i - 1].date >= ps[i].date).toBe(true);
    for (const p of ps) expect(p.featuredImage?.altText?.length ?? 0).toBeGreaterThan(3);
  });
  it("only Dignity Housing has a write-up", () => {
    expect(getProjects().filter(hasWriteup).map((p) => p.slug)).toEqual(["dignity-housing-for-wildife-rangers"]);
  });
  it("parses WordPress HTML into paragraphs and images in order", () => {
    const nodes = parseWpContent(getProjects().find(hasWriteup)!.content);
    const kinds = nodes.map((n) => n.kind);
    expect(kinds.filter((k) => k === "p").length).toBe(4);
    expect(kinds.filter((k) => k === "img").length).toBe(5);
    expect(nodes[0].kind).toBe("p");
    expect((nodes.find((n) => n.kind === "p") as { html: string }).html).toContain("25 camps");
    expect(nodes.some((n) => n.kind === "p" && n.html.includes("<strong>Dignity Housing</strong>"))).toBe(true);
  });
});
