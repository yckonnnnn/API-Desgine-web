import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Clipboard copy with a self-clearing "copied" flag.
 *
 * The flag holds the copied *text* rather than a boolean so a page with several
 * copy targets (every code sample on a docs article) only lights up the button
 * that was actually pressed.
 */
export function useCopy(resetAfterMs = 1800) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      setCopied(text);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), resetAfterMs);
      return true;
    },
    [resetAfterMs],
  );

  return { copied, copy };
}
