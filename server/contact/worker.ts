import { handleContact, type ContactEnv } from "./handler";

/**
 * Cloudflare Worker: deploy with `wrangler deploy` from a wrangler.toml whose
 * `main` points here, put the four variables from README.md in its secrets,
 * and set NEXT_PUBLIC_CONTACT_ENDPOINT to the worker's URL.
 */
export default {
  fetch(req: Request, env: ContactEnv): Promise<Response> {
    return handleContact(req, env);
  },
};
