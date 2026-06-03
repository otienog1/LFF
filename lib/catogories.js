export function categoryPathBySlug(slug) {
    return `/categories/${slug}`
}

export function mapCategoryData(category = {}) {
    const data = { ...category }
    return data
}
