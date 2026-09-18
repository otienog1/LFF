/**
 * Decide whether a clicked link should go through the page transition.
 *
 * Returns the in-app path (path + search + hash) to push, or null when the
 * browser should handle the link itself: other origins, mailto/tel, in-page
 * anchors, or a link to the page already on screen.
 */
export function resolveTransitionTarget(
  href: string | null | undefined,
  current: { origin: string; pathname: string },
): string | null {
  if (!href) return null;
  if (href.startsWith("#")) return null;

  let url: URL;
  try {
    url = new URL(href, current.origin + current.pathname);
  } catch {
    return null;
  }
  if (url.origin !== current.origin) return null;

  if (trimSlash(url.pathname) === trimSlash(current.pathname)) return null;

  return url.pathname + url.search + url.hash;
}

function trimSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}
