# Contact form delivery

The site is a static export, so it cannot hold the Resend key or send mail itself. The contact form posts a small JSON message to a function that runs anywhere Web-standard functions run; the function validates it and sends one email to the foundation through Resend, with the visitor's address as reply-to. The form always sends this way: if the function is missing or fails, the message stays in the fields and the page shows the foundation's address to write to instead.

## What the function needs

| Variable | Meaning | Example |
| --- | --- | --- |
| `RESEND_API_KEY` | A Resend API key with sending permission (Resend → API Keys). | `re_…` |
| `CONTACT_TO` | Where messages go. | `info@theluigifootprints.org` |
| `CONTACT_FROM` | The sender. Its domain must be verified in Resend (Resend → Domains → add `theluigifootprints.org`, create the DNS records it shows). | `Luigi Footprints website <contact@theluigifootprints.org>` |
| `ALLOWED_ORIGINS` | Optional. Sites allowed to post, comma-separated. Defaults to `https://theluigifootprints.org`, `https://www.theluigifootprints.org` and `http://localhost:3000`. | |

These live on the function's host only. The site needs one public value, `NEXT_PUBLIC_CONTACT_ENDPOINT`, the function's URL, set before `next build` (see `.env.example`). Its default is `/api/contact` on the site's own origin, which the Vercel and Netlify adapters below both answer.

## Where to run it

All three adapters call the same `handler.ts`; pick the one for wherever the site is hosted.

- **Vercel**: `api/contact.ts` at the repository root deploys automatically with the site as `/api/contact`, the default endpoint. Set the variables in Project → Settings → Environment Variables. Locally, `vercel dev` serves the site and the function together.
- **Netlify**: `netlify/functions/contact.ts` deploys as `/.netlify/functions/contact`, and `netlify.toml` routes `/api/contact` to it, so the default endpoint works. Set the variables in Site configuration → Environment variables. Locally, `netlify dev` serves both.
- **Cloudflare Workers** (for a site hosted anywhere else, including plain static hosting): deploy `worker.ts` with Wrangler (`main = "server/contact/worker.ts"`), add the variables as secrets (`wrangler secret put RESEND_API_KEY` and so on), and set `NEXT_PUBLIC_CONTACT_ENDPOINT` to the worker's URL.

Unit tests for the handler: `yarn vitest run server` (validation, honeypot, CORS, the Resend request, failure and rate limiting).

## Resend

The function sends through Resend's HTTP API (`POST https://api.resend.com/emails`) with the API key as a bearer token; no SMTP and no extra dependency. The sender's domain has to be verified in Resend, and the key needs sending permission.

## Checking it works

1. Deploy the function with the variables set; open its URL in a browser: a `405` JSON answer means it is up.
2. Build the site with `NEXT_PUBLIC_CONTACT_ENDPOINT` set and send a real message from the contact page. It should arrive at `CONTACT_TO` within a minute, from `CONTACT_FROM`, with reply-to set to the address typed in the form.
3. Reply from the mailbox: the reply must go to the visitor.

If Resend rejects the send, the function answers `502`; the page keeps the message in the fields and shows the foundation's address, so nothing is lost. Resend's dashboard (Emails) shows every attempt. On the plain `next dev` server there is no function behind `/api/contact`, so a submit there shows that failure state; use `vercel dev`, `netlify dev`, or point `NEXT_PUBLIC_CONTACT_ENDPOINT` at a deployed function to send from development.
