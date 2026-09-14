import { useState, type FormEvent } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Grain } from "@/components/layout/grain";
import { OrbCanvas } from "@/components/orb/orb-canvas";
import { PageVeil } from "@/components/layout/page-veil";
import { CustomCursor } from "@/components/cursor/custom-cursor";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
          email,
          password,
          name: email.split("@")[0] || "Builder",
          callbackURL: "/console",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
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
          <Link to="/" className="wordmark" data-cursor="hover">
            <span className="wordmark-mark" aria-hidden="true" />
            FYT
          </Link>
          <p className="section-kicker">{mode === "login" ? "Sign in" : "Create account"}</p>
          <h1 className="auth-title">
            {mode === "login" ? "Welcome back." : "Start building."}
          </h1>
          <form className="auth-form" onSubmit={onSubmit}>
            <label htmlFor="email">
              Email
              <input
                id="email"
                className="glass-input"
                type="email"
                autoComplete="email"
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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <button type="submit" className="btn-ink auth-submit" disabled={busy} data-cursor="hover">
              {busy ? "Continuing…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
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
