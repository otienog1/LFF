import { handleContact } from "../server/contact/handler";

/**
 * Vercel: this file deploys as a function at /api/contact next to the static
 * site; set NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact and the four variables
 * from server/contact/README.md in the project settings.
 */
export const config = { runtime: "edge" };

export default function handler(req: Request): Promise<Response> {
  return handleContact(req, {
    RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
    CONTACT_TO: process.env.CONTACT_TO ?? "",
    CONTACT_FROM: process.env.CONTACT_FROM ?? "",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  });
}
