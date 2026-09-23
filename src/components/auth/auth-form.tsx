import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { splitRedirect } from "@/lib/auth/redirect";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { DEMO_ACCOUNT, DEMO_PASSWORD, ensureDemoAdmin, resolveAccountEmail } from "@/lib/demo-admin";
import { Grain } from "@/components/layout/grain";
import { OrbCanvas } from "@/components/orb/orb-canvas";
import { PageVeil } from "@/components/layout/page-veil";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { FoytonBrand } from "@/components/layout/foyton-brand";

type Mode = "login" | "register";

/** Bilingual copy for the gate pages; defaults to Chinese via LanguageProvider. */
const AUTH_COPY = {
  zh: {
    preparing: "正在准备入口…",
    kicker: { login: "登录", register: "创建账户" },
    title: { login: "欢迎回来。", register: "开始构建。" },
    accountLabel: { login: "账号或邮箱", register: "邮箱" },
    passwordLabel: "密码",
    emailPlaceholder: "",
    continue: "继续…",
    submit: { login: "登录", register: "创建账户" },
    demoPrefix: "演示工作区 — 使用",
    continueWith: (label: string) => `使用 ${label} 继续`,
    newHere: "第一次来？",
    createAccount: "创建账户",
    alreadyBuilding: "已经在构建了？",
    signIn: "登录",
    backHome: "返回主页",
  },
  en: {
    preparing: "Preparing the gate…",
    kicker: { login: "Sign in", register: "Create account" },
    title: { login: "Welcome back.", register: "Start building." },
    accountLabel: { login: "Account or email", register: "Email" },
    passwordLabel: "Password",
    emailPlaceholder: "",
    continue: "Continuing…",
    submit: { login: "Sign in", register: "Create account" },
    demoPrefix: "Demo workspace — use",
    continueWith: (label: string) => `Continue with ${label}`,
    newHere: "New here?",
    createAccount: "Create an account",
    alreadyBuilding: "Already building?",
    signIn: "Sign in",
    backHome: "Back to home",
  },
} as const;

/**
 * `redirect` is where to go once signed in, already validated as a same-origin
 * path by the route (see `readRedirect`). It carries a plan choice through the
 * sign-in detour: a visitor who picked a credit pack on the marketing page
 * lands on that pack's checkout, not on the console overview.
 */
export function AuthForm({ mode, redirect }: { mode: Mode; redirect?: string }) {
  return (
    <LanguageProvider>
      <AuthFormInner mode={mode} redirect={redirect} />
    </LanguageProvider>
  );
}

function AuthFormInner({ mode, redirect }: { mode: Mode; redirect?: string }) {
  const { language } = useLanguage();
  const t = AUTH_COPY[language];
  const navigate = useNavigate();
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

  // Already signed in — this is the second half of the marketing page's plan
  // handoff, for a visitor whose session resolved after they were sent here.
  // A client-side navigation keeps the query intact; `<Navigate to="…?plan=x">`
  // would swallow it into the pathname.
  useEffect(() => {
    if (!user) return;
    const target = splitRedirect(redirect ?? "/console");
    void navigate({ to: target.to, search: target.search, replace: true });
  }, [user, redirect, navigate]);

  if (isPending || user) {
    return (
      <>
        <Grain />
        <OrbCanvas />
        <PageVeil />
        <main className="auth-page">
          <div className="auth-void" />
          <div className="auth-panel">
            <p className="section-kicker">FYT</p>
            <p className="console-muted">{t.preparing}</p>
          </div>
        </main>
      </>
    );
  }
  /** Where the session lands: the carried redirect, or the console. */
  const destination = redirect ?? "/console";

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
          callbackURL: destination,
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email: resolveAccountEmail(email),
          password,
          callbackURL: destination,
        });
        if (err) throw new Error(err.message);
      }
      // A full reload, not a router navigation: the session cookie was just set
      // by this request, and the gates read it on a fresh boot.
      window.location.href = destination;
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
          <div className="auth-topbar">
            <Link to="/" className="auth-back" data-cursor="hover" aria-label={t.backHome} title={t.backHome}>
              <ArrowLeft size={18} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <Link to="/" className="auth-brand" data-cursor="hover">
              <FoytonBrand />
            </Link>
          </div>
          <p className="section-kicker">{t.kicker[mode]}</p>
          <h1 className="auth-title">
            {t.title[mode]}
          </h1>
          <form className="auth-form" onSubmit={onSubmit}>
            <label htmlFor="email">
              {t.accountLabel[mode]}
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
              {t.passwordLabel}
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
              {busy ? t.continue : t.submit[mode]}
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
              {t.demoPrefix} <code>{DEMO_ACCOUNT}</code> / <code>{DEMO_PASSWORD}</code>
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
                  onClick={() => signIn(p.providerId, { callbackURL: destination })}
                >
                  {t.continueWith(p.label)}
                </button>
              ))}
            </div>
          ) : null}
          <p className="auth-switch">
            {mode === "login" ? (
              <>
                {t.newHere}{" "}
                <Link to="/register" data-cursor="hover">
                  {t.createAccount}
                </Link>
              </>
            ) : (
              <>
                {t.alreadyBuilding}{" "}
                <Link to="/login" data-cursor="hover">
                  {t.signIn}
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </>
  );
}
