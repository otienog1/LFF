/**
 * Where the contact form sends its message: the small function described in
 * `server/contact/README.md`, which holds the Resend key and sends the mail.
 * The site is a static export and cannot keep a secret, so the address is
 * read at build time from NEXT_PUBLIC_CONTACT_ENDPOINT; by default it is
 * `/api/contact` on the site's own origin, which is where the Vercel adapter
 * deploys and where netlify.toml routes the Netlify one.
 */
export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/api/contact";

/** The reasons a visitor can pick; the same list is accepted by the server. */
export const CONTACT_REASONS = ["general", "partnership", "volunteer", "sponsor", "press"] as const;
export type ContactReason = (typeof CONTACT_REASONS)[number];
