import { describe, it, expect } from "vitest";
import { resolveTransitionTarget } from "./navigation";

const at = (path: string) => ({ origin: "https://theluigifootprints.org", pathname: path });

describe("resolveTransitionTarget", () => {
  it("returns the path for a same-origin relative link", () => {
    expect(resolveTransitionTarget("/about", at("/"))).toBe("/about");
  });
  it("keeps the locale prefix and query string", () => {
    expect(resolveTransitionTarget("/es/projects?tag=water", at("/es"))).toBe("/es/projects?tag=water");
  });
  it("returns the path for an absolute same-origin link", () => {
    expect(resolveTransitionTarget("https://theluigifootprints.org/impact", at("/"))).toBe("/impact");
  });
  it("ignores links to other origins", () => {
    expect(resolveTransitionTarget("https://www.instagram.com/x", at("/"))).toBeNull();
    expect(resolveTransitionTarget("//cdn.example.com/file", at("/"))).toBeNull();
  });
  it("ignores mailto, tel and empty hrefs", () => {
    expect(resolveTransitionTarget("mailto:info@example.org", at("/"))).toBeNull();
    expect(resolveTransitionTarget("tel:+254700000000", at("/"))).toBeNull();
    expect(resolveTransitionTarget("", at("/"))).toBeNull();
    expect(resolveTransitionTarget(null, at("/"))).toBeNull();
  });
  it("ignores in-page hash links and links to the current page", () => {
    expect(resolveTransitionTarget("#team", at("/about"))).toBeNull();
    expect(resolveTransitionTarget("/about#team", at("/about"))).toBeNull();
    expect(resolveTransitionTarget("/about", at("/about"))).toBeNull();
    expect(resolveTransitionTarget("/about/", at("/about"))).toBeNull();
  });
  it("keeps a hash when navigating to a different page", () => {
    expect(resolveTransitionTarget("/our-work#education", at("/"))).toBe("/our-work#education");
  });
});
