import { describe, it, expect } from "vitest";
import { getAllSlugs, getPage, getAllPages } from "./content";

describe("content layer", () => {
  it("returns all five page slugs", () => {
    expect(getAllSlugs().sort()).toEqual(["/", "/about", "/get-involved", "/impact", "/our-work"]);
  });
  it("getPage returns the home page with a hero first block", () => {
    const home = getPage("/");
    expect(home?.title).toBe("Home");
    expect(home?.blocks[0].type).toBe("hero");
  });
  it("getPage returns undefined for an unknown slug", () => {
    expect(getPage("/nope")).toBeUndefined();
  });
  it("getAllPages returns 5 pages", () => {
    expect(getAllPages()).toHaveLength(5);
  });
});
