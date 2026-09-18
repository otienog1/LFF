/**
 * The contact form's mail sender. One function, written against the Web
 * Request/Response API so it runs unchanged as a Vercel function
 * (`api/contact.ts`), a Netlify function (`netlify/functions/contact.ts`) or
 * a Cloudflare Worker (`worker.ts`). It validates the message, drops what a
 * robot filled in, and sends one email to the foundation through Resend's
 * HTTP API with the visitor as reply-to. Nothing is stored.
 *
 * Environment (on the function's host, never in the site):
 *   RESEND_API_KEY   the Resend key (the same key is the SMTP password if mail is ever sent another way)
 *   CONTACT_TO       where messages go, e.g. info@theluigifootprints.org
 *   CONTACT_FROM     a sender on a domain verified in Resend, e.g. "Luigi Footprints website <contact@theluigifootprints.org>"
 *   ALLOWED_ORIGINS  optional, comma-separated; defaults to the site and localhost
 */
export interface ContactEnv {
  RESEND_API_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
  ALLOWED_ORIGINS?: string;
}

export const REASONS = {
  general: "General question",
  partnership: "Partnership",
  volunteer: "Volunteering",
  sponsor: "Sponsoring a project",
  press: "Press",
} as const;
export type Reason = keyof typeof REASONS;

const DEFAULT_ORIGINS = ["https://theluigifootprints.org", "https://www.theluigifootprints.org", "http://localhost:3000"];
const RESEND_URL = "https://api.resend.com/emails";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 5;

/** Best-effort rate limit per address, in the memory of one instance. */
const recent = new Map<string, number[]>();
function tooMany(ip: string, now = Date.now()): boolean {
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  times.push(now);
  recent.set(ip, times);
  return times.length > PER_WINDOW;
}

export interface ContactPayload {
  name: string;
  email: string;
  reason: Reason;
  message: string;
  locale: string;
}

/** Checks the fields the form sends; returns the clean payload or the names of the fields that failed. */
export function validate(input: unknown): { ok: true; value: ContactPayload } | { ok: false; fields: string[] } {
  const b = (input ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(b.name);
  const email = str(b.email);
  const reason = str(b.reason);
  const message = str(b.message);
  const locale = ["en", "es", "pt"].includes(str(b.locale)) ? str(b.locale) : "en";
  const fields: string[] = [];
  if (name.length < 2 || name.length > 120) fields.push("name");
  if (!EMAIL.test(email) || email.length > 200) fields.push("email");
  if (!(reason in REASONS)) fields.push("reason");
  if (message.length < 10 || message.length > 5000) fields.push("message");
  if (fields.length) return { ok: false, fields };
  return { ok: true, value: { name, email, reason: reason as Reason, message, locale } };
}

/** The email as the foundation will read it. */
export function composeEmail(p: ContactPayload, env: ContactEnv, page?: string) {
  const text = [
    "New message from the website contact form.",
    "",
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Reason: ${REASONS[p.reason]}`,
    `Language: ${p.locale}`,
    page ? `Page: ${page}` : null,
    "",
    "Message:",
    p.message,
  ].filter((l) => l !== null).join("\n");
  return {
    from: env.CONTACT_FROM,
    to: [env.CONTACT_TO],
    reply_to: p.email,
    subject: `[Website] ${REASONS[p.reason]}: ${p.name}`,
    text,
  };
}

function corsHeaders(origin: string | null, env: ContactEnv): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()) : DEFAULT_ORIGINS).filter(Boolean);
  const ok = origin !== null && allowed.includes(origin);
  return {
    ...(ok ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(status: number, body: unknown, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
}

export async function handleContact(req: Request, env: ContactEnv, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin, env);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json(405, { ok: false, error: "method" }, { ...cors, Allow: "POST, OPTIONS" });
  if (origin !== null && !cors["Access-Control-Allow-Origin"]) return json(403, { ok: false, error: "origin" }, cors);

  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (tooMany(ip)) return json(429, { ok: false, error: "rate" }, cors);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "json" }, cors);
  }

  // A filled honeypot is a robot: say yes and send nothing.
  const website = (body as Record<string, unknown> | null)?.website;
  if (typeof website === "string" && website.trim() !== "") return json(200, { ok: true }, cors);

  const checked = validate(body);
  if (checked.ok === false) return json(400, { ok: false, error: "invalid", fields: checked.fields }, cors);

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) return json(500, { ok: false, error: "config" }, cors);

  const email = composeEmail(checked.value, env, req.headers.get("referer") ?? undefined);
  const sent = await fetchImpl(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });
  if (!sent.ok) return json(502, { ok: false, error: "send_failed", status: sent.status }, cors);
  const result = (await sent.json().catch(() => ({}))) as { id?: string };
  return json(200, { ok: true, id: result.id ?? null }, cors);
}
