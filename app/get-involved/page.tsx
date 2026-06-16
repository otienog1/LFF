import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

export function generateMetadata(): Metadata {
  const page = getPage("/get-involved");
  return { title: page?.seo.title, description: page?.seo.description };
}

export default function GetInvolvedPage() {
  const page = getPage("/get-involved");
  if (!page) return null;
  return <BlockRenderer blocks={page.blocks} heroVariant="interior" />;
}
