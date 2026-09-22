/**
 * Validate a `?redirect=` search param.
 *
 * Only same-origin absolute paths survive. The param is set from the marketing
 * page today, but it is also readable and writable from the URL bar, and a
 * redirect target taken straight from there is an open redirect: an attacker
 * could hand out a link to the real sign-in page that drops the freshly
 * authenticated user on their own site.
 *
 * `//evil.com` is rejected alongside absolute URLs — browsers read it as
 * protocol-relative, so it is an off-site target wearing a leading slash.
 */
export function readRedirect(value: unknown): { redirect?: string } {
  if (typeof value !== "string") return {};
  if (!value.startsWith("/") || value.startsWith("//")) return {};
  return { redirect: value };
}

/**
 * Split a redirect target into the pieces the router needs. `<Navigate
 * to="/console/wallet?plan=max">` would take the whole string as a pathname, so
 * the query has to be handed over separately to survive the trip.
 */
export function splitRedirect(target: string): { to: string; search: Record<string, string> } {
  const url = new URL(target, "http://localhost");
  return { to: url.pathname, search: Object.fromEntries(url.searchParams) };
}
