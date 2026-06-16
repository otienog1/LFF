import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("/our-work");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function OurWorkPage() {
  const page = getPage("/our-work");
  if (!page) return null;
  return <BlockRenderer blocks={page.blocks} heroVariant="interior" />;
}
