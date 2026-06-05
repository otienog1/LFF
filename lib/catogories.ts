export function categoryPathBySlug(slug: string): string {
  return `/categories/${slug}`
}

export function mapCategoryData(category: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...category }
}
