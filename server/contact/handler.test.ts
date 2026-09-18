import { describe, expect, it, vi } from "vitest";
import { composeEmail, handleContact, validate, type ContactEnv } from "./handler";

const env: ContactEnv = {
  RESEND_API_KEY: "re_test",
  CONTACT_TO: "info@theluigifootprints.org",
  CONTACT_FROM: "Luigi Footprints website <contact@theluigifootprints.org>",
};
const ORIGIN = "https://theluigifootprints.org";
const good = { name: "Asha Otieno", email: "asha@example.com", reason: "sponsor", message: "I would like to sponsor a Dignity House.", locale: "en" };

function post(body: unknown, headers: Record<string, string> = {}, ip = "203.0.113.1") {
  return new Request("https://example.org/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN, "x-forwarded-for": ip, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
const okResend = () => vi.fn(async () => new Response(JSON.stringify({ id: "email_123" }), { status: 200 }));

describe("validate", () => {
  it("accepts a proper message", () => {
    const r = validate(good);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.reason).toBe("sponsor");
  });
  it("names every failing field", () => {
    const r = validate({ name: "A", email: "nope", reason: "other", message: "short" });
    expect(r).toEqual({ ok: false, fields: ["name", "email", "reason", "message"] });
  });
  it("falls back to English for an unknown language", () => {
    const r = validate({ ...good, locale: "fr" });
    if (r.ok) expect(r.value.locale).toBe("en");
  });
});

describe("composeEmail", () => {
  it("addresses the foundation with the visitor as reply-to and names the reason", () => {
    const e = composeEmail({ ...good, reason: "sponsor" }, env, "https://theluigifootprints.org/contact");
    expect(e.to).toEqual(["info@theluigifootprints.org"]);
    expect(e.reply_to).toBe("asha@example.com");
    expect(e.subject).toBe("[Website] Sponsoring a project: Asha Otieno");
    expect(e.text).toContain("Page: https://theluigifootprints.org/contact");
    expect(e.text).toContain("I would like to sponsor a Dignity House.");
  });
});

describe("handleContact", () => {
  it("answers a preflight from the site with CORS headers", async () => {
    const res = await handleContact(new Request("https://x/api/contact", { method: "OPTIONS", headers: { Origin: ORIGIN } }), env, okResend());
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(ORIGIN);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });
  it("refuses other origins and other methods", async () => {
    expect((await handleContact(post(good, { Origin: "https://evil.example" }), env, okResend())).status).toBe(403);
    expect((await handleContact(new Request("https://x/api/contact", { method: "GET" }), env, okResend())).status).toBe(405);
  });
  it("rejects bad JSON and invalid fields without sending", async () => {
    const send = okResend();
    expect((await handleContact(post("{not json"), env, send)).status).toBe(400);
    const res = await handleContact(post({ ...good, email: "nope" }), env, send);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "invalid", fields: ["email"] });
    expect(send).not.toHaveBeenCalled();
  });
  it("says yes to a robot that filled the hidden field, and sends nothing", async () => {
    const send = okResend();
    const res = await handleContact(post({ ...good, website: "http://spam.example" }), env, send);
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });
  it("sends the message through Resend and reports the id", async () => {
    const send = okResend();
    const res = await handleContact(post(good, { Referer: "https://theluigifootprints.org/es/contact" }), env, send);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, id: "email_123" });
    expect(send).toHaveBeenCalledTimes(1);
    const [url, init] = send.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
    const sent = JSON.parse(init.body as string);
    expect(sent.from).toBe(env.CONTACT_FROM);
    expect(sent.to).toEqual([env.CONTACT_TO]);
    expect(sent.reply_to).toBe("asha@example.com");
    expect(sent.subject).toBe("[Website] Sponsoring a project: Asha Otieno");
    expect(sent.text).toContain("Page: https://theluigifootprints.org/es/contact");
  });
  it("reports a Resend failure as 502", async () => {
    const send = vi.fn(async () => new Response("no", { status: 500 }));
    const res = await handleContact(post(good, {}, "203.0.113.2"), env, send);
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: "send_failed", status: 500 });
  });
  it("refuses when the function is not configured", async () => {
    const res = await handleContact(post(good, {}, "203.0.113.3"), { ...env, RESEND_API_KEY: "" }, okResend());
    expect(res.status).toBe(500);
  });
  it("slows a flood from one address", async () => {
    const send = okResend();
    let last = 200;
    for (let i = 0; i < 7; i++) last = (await handleContact(post(good, {}, "203.0.113.99"), env, send)).status;
    expect(last).toBe(429);
    expect(send).toHaveBeenCalledTimes(5);
  });
});
