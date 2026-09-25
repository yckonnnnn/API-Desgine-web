import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate } from "@tanstack/react-router";
import { LogOut, Wallet } from "lucide-react";
import { formatUsd } from "@/lib/format";
import { PLANS, findPlan } from "@/lib/plans";
import { GROK_PROVIDERS, authEnabled, signIn, signOut } from "./client";
import { hasGateSessionMarker } from "./gate-session-marker";
import { resolveSignInGateState } from "./sign-in-gate";
import { useCurrentUser, useCurrentUserState } from "./use-current-user";

const subscribeToNothing = () => () => {};
const noGateSessionOnServer = () => false;

/**
 * Auth state components — plain wrappers around `useCurrentUserState()`.
 *
 * With auth on, visitors are signed out until they authenticate — in the sandbox
 * live preview too, which does real sign-in. The shared dev user appears only
 * when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
 * While the session is still resolving, gates that care about signed-out state
 * render nothing so there's no signed-out flash on hard reload.
 */

/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
export const SIGN_IN_PATH = "/login";

/** Render children only when a user is present (real session, or the disabled-auth dev user). */
export function SignedIn({ children }: { children: ReactNode }) {
  const { user } = useCurrentUserState();
  return user ? <>{children}</> : null;
}

/**
 * Render children only once we KNOW the visitor is signed out (`isPending` has
 * cleared and there is no user). Hidden while the session is still loading.
 */
export function SignedOut({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending || user) return null;
  return <>{children}</>;
}

/**
 * Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
 * `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
 * session loading, which feels like a second "Loading…" on /login.
 *
 * Guard routes by waiting out `isPending` first (see `use-current-user`), then
 * render this.
 */
export function RedirectToSignIn({ to = SIGN_IN_PATH }: { to?: string }) {
  return <Navigate to={to} />;
}

export function SignInGate({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const state = resolveSignInGateState({ isPending, hasUser: user !== null });
  if (state === "pending") return null;
  if (state === "signed_in") return <>{children}</>;
  return <>{fallback ?? <SignInButtons />}</>;
}

export function SignInButtons() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {GROK_PROVIDERS.map((p) => (
        <button
          key={p.providerId}
          type="button"
          onClick={() => signIn(p.providerId, { callbackURL: "/" })}
          className="w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Continue with {p.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Minimal signed-in identity chip + sign-out. Restyle freely (see the
 * `design-ui` skill). Sign-out is only shown when auth is enabled (the
 * disabled-auth dev user has nothing to sign out of) and the session is not
 * gate-materialized — behind the gate the next request signs the viewer
 * straight back in, so a sign-out control there is a broken loop.
 */
/**
 * Signed-in identity control: an avatar that opens a profile card.
 *
 * The card is portalled to `document.body` and positioned `fixed`. That is not
 * decoration — it is required. The navbar is a `.glass` surface, and `.glass`
 * carries `overflow: hidden` (the effect clips its own inner highlight), so a
 * card rendered inside the bar is cut off at the bar's edge. Portalling also
 * lifts it above the fixed orb canvas, which otherwise paints over the menu.
 *
 * Panel order follows the reference profile card: gradient header with the
 * avatar overlapping its lower edge, name + email, wallet balance, then the two
 * actions. Sign-out is hidden when auth is disabled or the session is
 * gate-materialized (behind the gate the next request signs you back in).
 */
export function UserButton({ language = "en" }: { language?: "zh" | "en" }) {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{
    left: number;
    top?: number;
    bottom?: number;
  } | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [planId, setPlanId] = useState<string | null | undefined>(undefined);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const gateSession = useSyncExternalStore(
    subscribeToNothing,
    hasGateSessionMarker,
    noGateSessionOnServer,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /**
   * Anchor the card to the avatar, then pull it back inside the viewport on
   * both axes. Right-aligning to the trigger only works while the trigger is
   * on the right (the navbar); the console sidebar puts it at the far left,
   * where the card has to hang off the other side instead.
   */
  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 12;
    const cardH = cardRef.current?.offsetHeight ?? 360;
    const cardW = cardRef.current?.offsetWidth ?? 288;

    // Horizontal: prefer right-aligned, else left-aligned, always clamped.
    let left = r.right - cardW;
    if (left < 16) left = r.left;
    left = Math.min(Math.max(16, left), window.innerWidth - cardW - 16);

    // Vertical: open downward unless the trigger is too close to the bottom.
    const below = window.innerHeight - r.bottom;
    const above = r.top;
    const flip = below < cardH + gap + 16 && above > cardH + gap + 16;

    setPos({
      left,
      ...(flip ? { bottom: window.innerHeight - r.top + gap } : { top: r.bottom + gap }),
    });
  }, []);

  // Position and dismissal. The card renders hidden until `pos` is set, so it
  // is measurable here on the first pass and never flashes at the corner.
  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    place();
    const onDoc = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || cardRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", place);
    // Capture phase: the card is fixed, so any ancestor scroll moves it.
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, place]);

  // Balance + plan load on open — a signed-in visitor browsing the marketing pages
  // shouldn't pay for a server call they never look at.
  useEffect(() => {
    if (!open) return;
    if (balance == null) {
      void import("@/lib/fyt")
        .then(({ getWallet }) => getWallet())
        .then((w) => setBalance(w.balanceCents))
        .catch(() => undefined);
    }
    if (planId === undefined) {
      void import("@/lib/fyt")
        .then(({ getUserPlan }) => getUserPlan())
        .then((p) => setPlanId(p.planId))
        .catch(() => setPlanId(null));
    }
  }, [open, balance, planId]);

  if (!user) return null;

  const zh = language === "zh";
  const name = user.displayName ?? user.primaryEmail ?? "Account";
  const email = user.primaryEmail ?? null;
  const avatarSrc = avatarSource(user.profileImageUrl ?? null, name, avatarFailed);

  // Tier: plan name if subscribed, Plus if balance > 0, Free otherwise.
  const activePlan = planId ? findPlan(planId) : null;
  const tierLabel = activePlan
    ? activePlan.name
    : balance != null && balance > 0
      ? (zh ? "Plus" : "Plus")
      : (zh ? "免费" : "Free");
  const tierAction = activePlan
    ? (zh ? "升级" : "Upgrade")
    : (zh ? "充值" : "Top up");

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="user-avatar-btn"
        data-cursor="hover"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={zh ? "账户菜单" : "Account menu"}
        onClick={() => setOpen((was) => !was)}
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt="" onError={() => setAvatarFailed(true)} />
        ) : (
          <span className="user-avatar-fallback" aria-hidden="true">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="user-card"
              role="menu"
              ref={cardRef}
              /* Kept mounted but invisible until `place()` has measured it —
                 a fixed card needs its own height to decide up vs down. */
              style={{ ...pos, visibility: pos ? "visible" : "hidden" }}
            >
              <div className="user-card-head">
                <span className="user-card-tier">
                  <span className="user-card-tier-label">{tierLabel}</span>
                  <Link
                    to="/console/wallet"
                    search={{ topup: true }}
                    className="user-card-tier-btn"
                    data-cursor="hover"
                    onClick={() => setOpen(false)}
                  >
                    {tierAction}
                  </Link>
                </span>
              </div>

              <div className="user-card-body">
                <div className="user-card-avatar">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="" onError={() => setAvatarFailed(true)} />
                  ) : (
                    <span className="user-avatar-fallback" aria-hidden="true">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 className="user-card-name">{name}</h3>
                {email ? <p className="user-card-email">{email}</p> : null}

                <div className="user-card-balance">
                  <span>{zh ? "钱包余额" : "Wallet balance"}</span>
                  <strong>
                    {balance == null
                      ? "—"
                      : formatUsd(balance)}
                  </strong>
                </div>

                <div className="user-card-actions">
                  <Link
                    to="/console/wallet"
                    role="menuitem"
                    data-cursor="hover"
                    onClick={() => setOpen(false)}
                  >
                    <Wallet size={15} strokeWidth={1.9} aria-hidden="true" />
                    {zh ? "钱包" : "Wallet"}
                  </Link>
                  {authEnabled && !gateSession ? (
                    <button
                      type="button"
                      role="menuitem"
                      className="user-card-signout"
                      data-cursor="hover"
                      disabled={signingOut}
                      onClick={() => {
                        setSigningOut(true);
                        void signOut().catch(() => setSigningOut(false));
                      }}
                    >
                      <LogOut size={15} strokeWidth={1.9} aria-hidden="true" />
                      {signingOut ? (zh ? "退出中…" : "Signing out…") : zh ? "退出登录" : "Sign out"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/**
 * Use the account's chosen image when available. Otherwise use a deterministic
 * cartoon portrait; if the remote avatar service fails, the caller falls back
 * to a monogram rather than a broken image.
 */
function avatarSource(
  profileImageUrl: string | null,
  name: string,
  failed: boolean,
): string | null {
  if (failed) return null;
  if (profileImageUrl) return profileImageUrl;
  const bg = "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,d1f4d9";
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    name,
  )}&backgroundColor=${bg}`;
}
