import { Resend } from "resend";

let client: Resend | undefined;

/**
 * The Resend client, created on first use rather than when a route module
 * loads. Constructing it at module level throws "Missing API key" during
 * `next build` wherever the build has no runtime secrets (the container image
 * for the Coolify server is built without them by design), and it hid a
 * missing key behind a build failure instead of a clear request-time error.
 */
export function getResend(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set; email cannot be sent.");
  }
  client = new Resend(apiKey);
  return client;
}
