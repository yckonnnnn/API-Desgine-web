/**
 * Money is stored everywhere as integer cents; this is the only place it
 * becomes a string. USD, because billing is priced and settled in dollars —
 * the site sells to overseas teams, and the model square already quotes per-1M
 * rates in the same currency.
 *
 * `en-US` grouping rather than the page's language: a Chinese-language reader
 * looking at a dollar price expects `$1,248.50`, not a localised separator that
 * would read as a different number.
 */
export const USD_SYMBOL = "$";

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function maskKey(last4: string) {
  return `sk-fyt-••••••••${last4}`;
}
