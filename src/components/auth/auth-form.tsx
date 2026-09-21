import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { DEMO_ACCOUNT, DEMO_PASSWORD, ensureDemoAdmin, resolveAccountEmail } from "@/lib/demo-admin";
import { Grain } from "@/components/layout/grain";
import { OrbCanvas } from "@/components/orb/orb-canvas";
import { PageVeil } from "@/components/layout/page-veil";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { FoytonBrand } from "@/components/layout/foyton-brand";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // True once we know the demo account exists — i.e. this is a PGLite workspace
  // (local dev / live preview) rather than a deployment with a real database.
  const [demoReady, setDemoReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void ensureDemoAdmin()
      .then((result) => {
        if (cancelled) return;
        // Both PGLite outcomes mean the demo account is usable; only a managed
        // database (a real deployment) reports it as unavailable.
        setDemoReady(result.seeded || result.reason === "already-present");
      })
      .catch(() => {
        /* seeding is a convenience — a failure just means no demo hint */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isPending) {
    return (
      <>
        <Grain />
        <OrbCanvas />
        <PageVeil />
        <main className="auth-page">
          <div className="auth-void" />
          <div className="auth-panel">
            <p className="section-kicker">FYT</p>
            <p className="console-muted">Preparing the gate…</p>
          </div>
        </main>
      </>
    );
  }
  if (user) {
    return <Navigate to="/console" />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "register") {
        const { error: err } = await authClient.signUp.email({
          email: resolveAccountEmail(email),
          password,
          name: email.split("@")[0] || "Builder",
          callbackURL: "/console",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email: resolveAccountEmail(email),
          password,
          callbackURL: "/console",
        });
        if (err) throw new Error(err.message);
      }
      window.location.href = "/console";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue");
      setBusy(false);
    }
  }

  return (
    <>
      <Grain />
      <OrbCanvas />
      <CustomCursor />
      <PageVeil />
      <main className="auth-page">
        <div className="auth-void" />
        <div className="auth-panel">
          <Link to="/" className="auth-brand" data-cursor="hover">
            <FoytonBrand />
          </Link>
          <p className="section-kicker">{mode === "login" ? "Sign in" : "Create account"}</p>
          <h1 className="auth-title">
            {mode === "login" ? "Welcome back." : "Start building."}
          </h1>
          <form className="auth-form" onSubmit={onSubmit}>
            <label htmlFor="email">
              {mode === "login" ? "Account or email" : "Email"}
              <input
                id="email"
                className="glass-input"
                /* Login accepts the bare demo account, which `type="email"` would
                   reject before the request is ever sent. */
                type={mode === "login" ? "text" : "email"}
                inputMode={mode === "login" ? "text" : "email"}
                autoComplete={mode === "login" ? "username" : "email"}
                spellCheck={false}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                id="password"
                className="glass-input"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                /* Sign-in has no server-side length floor (only sign-up does), and
                   the demo password is shorter than the sign-up minimum. */
                minLength={mode === "register" ? 8 : 1}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <button type="submit" className="btn-ink auth-submit" disabled={busy} data-cursor="hover">
              {busy ? "Continuing…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
          {mode === "login" && demoReady ? (
            <button
              type="button"
              className="auth-demo"
              data-cursor="hover"
              onClick={() => {
                setEmail(DEMO_ACCOUNT);
                setPassword(DEMO_PASSWORD);
              }}
            >
              Demo workspace — use <code>{DEMO_ACCOUNT}</code> / <code>{DEMO_PASSWORD}</code>
            </button>
          ) : null}
          {authEnabled ? (
            <div className="auth-alt">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  className="btn-ghost auth-oauth"
                  data-cursor="hover"
                  onClick={() => signIn(p.providerId, { callbackURL: "/console" })}
                >
                  Continue with {p.label}
                </button>
              ))}
            </div>
          ) : null}
          <p className="auth-switch">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link to="/register" data-cursor="hover">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already building?{" "}
                <Link to="/login" data-cursor="hover">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </>
  );
}
