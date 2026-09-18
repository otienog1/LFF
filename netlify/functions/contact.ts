import { handleContact } from "../../server/contact/handler";

/**
 * Netlify: this file deploys as a function at /.netlify/functions/contact next
 * to the static site; set NEXT_PUBLIC_CONTACT_ENDPOINT to that path and the
 * four variables from server/contact/README.md in the site settings.
 */
export default function handler(req: Request): Promise<Response> {
  return handleContact(req, {
    RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
    CONTACT_TO: process.env.CONTACT_TO ?? "",
    CONTACT_FROM: process.env.CONTACT_FROM ?? "",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  });
}
