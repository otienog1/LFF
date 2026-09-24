/**
 * The project archive was exported from WordPress. Body content arrives as HTML wrapped in
 * theme layout markup (nested divs, utility classes). We only want its substance:
 * paragraphs and images, in order.
 */
export type WpNode =
  | { kind: "p"; html: string }
  | { kind: "img"; src: string; alt: string; width?: number; height?: number };

const ALLOWED_INLINE = /<\/?(strong|em|b|i|a)(\s[^>]*)?>/gi;

export function parseWpContent(html: string | null | undefined): WpNode[] {
  if (!html) return [];
  const nodes: WpNode[] = [];
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>|<img\b([^>]*)>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) {
      // paragraph: keep simple inline formatting, drop everything else (including nested figures)
      const inner = m[1]
        .replace(/<img\b[^>]*>/gi, "")
        .replace(/<(?!\/?(strong|em|b|i|a)\b)[^>]+>/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      if (inner) nodes.push({ kind: "p", html: inner });
      // an <img> nested inside a <p> should still be surfaced, in place
      const nested = /<img\b([^>]*)>/gi;
      let n: RegExpExecArray | null;
      while ((n = nested.exec(m[1]))) nodes.push(imgNode(n[1]));
    } else if (m[2] !== undefined) {
      nodes.push(imgNode(m[2]));
    }
  }
  return dedupe(nodes);
}

function attr(attrs: string, name: string): string | undefined {
  const r = new RegExp(`\\b${name}=["']([^"']*)["']`, "i").exec(attrs);
  return r?.[1];
}

function imgNode(attrs: string): WpNode {
  const w = attr(attrs, "width"); const h = attr(attrs, "height");
  return { kind: "img", src: attr(attrs, "src") ?? "", alt: attr(attrs, "alt") ?? "", width: w ? +w : undefined, height: h ? +h : undefined };
}

function dedupe(nodes: WpNode[]): WpNode[] {
  const seen = new Set<string>();
  return nodes.filter((n) => {
    if (n.kind !== "img") return true;
    if (!n.src || seen.has(n.src)) return false;
    seen.add(n.src);
    return true;
  });
}

/**
 * A paragraph's HTML reduced to emphasis alone: <strong>, <em>, <b> and <i>, stripped of any attributes, and
 * nothing else (links included). What survives is safe to set as inner HTML; the copy's italics carry meaning
 * (species names, titles of campaigns), so plain text would lose it.
 */
export function inlineHtml(html: string | null | undefined): string {
  return (html ?? "")
    .replace(/<(\/?)(strong|em|b|i)\b[^>]*>/gi, "<$1$2>")
    .replace(/<(?!\/?(strong|em|b|i)>)[^>]+>/gi, "");
}

export function stripHtml(html: string | null | undefined): string {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// keep the regex referenced so the allow-list is documented in one place
void ALLOWED_INLINE;
