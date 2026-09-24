/**
 * Typographic quotes for display type. The copy in data/data.json is typed with straight quotes, which
 * pass unnoticed in body text but show as typewriter ticks in a heading set at 50px and up ("We'd").
 * Applied at render time to headings only, so the copy and its translation tables stay as written.
 */
export function typeset(text: string): string {
  return text
    .replace(/(\p{L})'(\p{L})/gu, "$1’$2") // an apostrophe inside a word: we’d, Kenya’s, d’água
    .replace(/(^|[\s([{“])'/g, "$1‘") // an opening single quote
    .replace(/'/g, "’") // any other single quote closes, or is a trailing apostrophe
    .replace(/(^|[\s([{‘])"/g, "$1“") // an opening double quote
    .replace(/"/g, "”");
}
