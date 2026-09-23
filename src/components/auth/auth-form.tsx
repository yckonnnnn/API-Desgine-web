import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { authClient } from "@/lib/auth/client";
import { splitRedirect } from "@/lib/auth/redirect";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { resolveAccountEmail } from "@/lib/demo-admin";
import { Grain } from "@/components/layout/grain";
import { OrbCanvas } from "@/components/orb/orb-canvas";
import { PageVeil } from "@/components/layout/page-veil";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { FoytonBrand } from "@/components/layout/foyton-brand";

type Mode = "login" | "register";

const COPY = {
  zh: {
    preparing: "正在准备入口…",
    kicker: { login: "账户登录", register: "创建账户" },
    title: { login: "欢迎回来。", register: "从这里开始。" },
    intro: { login: "登录 FYT API，继续管理你的模型与用量。", register: "创建一个账户，开始使用统一的模型 API。" },
    username: "用户名", email: "邮箱地址", account: "账号或邮箱", password: "密码", confirm: "确认密码", code: "邮箱验证码",
    usernamePlaceholder: "你的称呼", emailPlaceholder: "name@example.com", accountPlaceholder: "and me", passwordPlaceholder: "and me", codePlaceholder: "输入邮件中的验证码",
    login: "登录", register: "创建账户", continue: "正在处理…", sending: "发送验证码", sent: "已发送",
    emailNote: "验证邮件服务尚未配置，暂时无法发送验证码。",
    mismatch: "两次输入的密码不一致。", needCode: "请输入邮箱验证码。", setup: "邮件验证尚未配置，暂时不能完成注册。",
    newHere: "还没有账户？", create: "立即注册", already: "已经有账户？", signIn: "返回登录", back: "返回主页",
    emailCheck: "请检查邮箱格式。", usernameNeed: "请输入用户名。", passwordNeed: "密码至少需要 8 位。",
  },
  en: {
    preparing: "Preparing your workspace…", kicker: { login: "ACCOUNT ACCESS", register: "NEW ACCOUNT" },
    title: { login: "Welcome back.", register: "Make it yours." },
    intro: { login: "Sign in to continue with your models and usage.", register: "Create an account to get started with FYT API." },
    username: "Username", email: "Email address", account: "Username or email", password: "Password", confirm: "Confirm password", code: "Email verification code",
    usernamePlaceholder: "How should we call you?", emailPlaceholder: "name@example.com", accountPlaceholder: "and me", passwordPlaceholder: "and me", codePlaceholder: "Enter the code from your email",
    login: "Sign in", register: "Create account", continue: "Please wait…", sending: "Send code", sent: "Sent",
    emailNote: "Email delivery is not configured yet, so verification codes cannot be sent.",
    mismatch: "The passwords do not match.", needCode: "Enter the verification code from your email.", setup: "Email verification is not configured yet, so registration cannot be completed.",
    newHere: "New to FYT?", create: "Create an account", already: "Already have an account?", signIn: "Sign in", back: "Back to home",
    emailCheck: "Enter a valid email address.", usernameNeed: "Enter a username.", passwordNeed: "Use at least 8 characters.",
  },
} as const;

export function AuthForm({ mode, redirect }: { mode: Mode; redirect?: string }) {
  return <LanguageProvider><AuthFormInner mode={mode} redirect={redirect} /></LanguageProvider>;
}

function AuthFormInner({ mode, redirect }: { mode: Mode; redirect?: string }) {
  const { language } = useLanguage();
  const t = COPY[language];
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!user) return;
    const target = splitRedirect(redirect ?? "/console");
    void navigate({ to: target.to, search: target.search, replace: true });
  }, [user, redirect, navigate]);

  if (isPending || user) return <><Grain /><OrbCanvas appearance="auth" /><PageVeil /><main className="auth-page"><div className="auth-void" /><div className="auth-panel"><p className="section-kicker">FYT</p><p className="console-muted">{t.preparing}</p></div></main></>;

  const destination = redirect ?? "/console";
  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (mode === "register") {
      if (!username.trim()) return setError(t.usernameNeed);
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError(t.emailCheck);
      if (password.length < 8) return setError(t.passwordNeed);
      if (password !== confirmPassword) return setError(t.mismatch);
      if (!code.trim()) return setError(t.needCode);
      // The prototype's code endpoint belongs to a different backend. Never claim
      // the code was sent or complete account creation without server verification.
      return setNotice(t.setup);
    }
    setBusy(true);
    try {
      const { error: err } = await authClient.signIn.email({
        email: resolveAccountEmail(email), password, callbackURL: destination,
      });
      if (err) throw new Error(err.message);
      window.location.href = destination;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue");
      setBusy(false);
    }
  }

  return <>
    <Grain /><OrbCanvas appearance="auth" /><CustomCursor /><PageVeil />
    <main className="auth-page">
      <div className="auth-void" />
      <section className={`auth-panel${mode === "register" ? " auth-panel--register" : ""}`} aria-labelledby="auth-heading">
        <div className="auth-topbar">
          <Link to="/" className="auth-back" data-cursor="hover" aria-label={t.back} title={t.back}><ArrowLeft size={18} strokeWidth={1.8} aria-hidden="true" /></Link>
          <Link to="/" className="auth-brand" data-cursor="hover"><FoytonBrand /></Link>
        </div>
        <p className="section-kicker">{t.kicker[mode]}</p>
        <h1 id="auth-heading" className="auth-title">{t.title[mode]}</h1>
        <p className="auth-intro">{t.intro[mode]}</p>
        <form className="auth-form" onSubmit={onSubmit}>
          {mode === "register" ? <label htmlFor="username">{t.username}<input id="username" className="glass-input" type="text" autoComplete="name" placeholder={t.usernamePlaceholder} required value={username} onChange={(e) => setUsername(e.target.value)} /></label> : null}
          <label htmlFor="email">{mode === "login" ? t.account : t.email}<input id="email" className="glass-input" type={mode === "login" ? "text" : "email"} inputMode={mode === "login" ? "text" : "email"} autoComplete={mode === "login" ? "username" : "email"} placeholder={mode === "login" ? t.accountPlaceholder : t.emailPlaceholder} spellCheck={false} required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label htmlFor="password">{t.password}<span className="auth-password-wrap"><input id="password" className="glass-input" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 8 : 1} placeholder={mode === "login" ? t.passwordPlaceholder : undefined} required value={password} onChange={(e) => setPassword(e.target.value)} /><button className="auth-password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
          {mode === "register" ? <>
            <label htmlFor="confirm-password">{t.confirm}<input id="confirm-password" className="glass-input" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
            <div className="auth-code-field"><label htmlFor="verification-code">{t.code}<input id="verification-code" className="glass-input" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder={t.codePlaceholder} required value={code} onChange={(e) => setCode(e.target.value)} /></label><button type="button" className="btn-ghost auth-send-code" onClick={() => setNotice(t.emailNote)}><Mail size={15} />{t.sending}</button></div>
          </> : null}
          {error ? <p className="auth-error" role="alert">{error}</p> : null}
          {notice ? <p className="auth-notice" role="status">{notice}</p> : null}
          <button type="submit" className="btn-ink auth-submit" disabled={busy} data-cursor="hover">{busy ? t.continue : t[mode]}</button>
        </form>
        <p className="auth-switch">{mode === "login" ? <>{t.newHere} <Link to="/register" data-cursor="hover">{t.create}</Link></> : <>{t.already} <Link to="/login" data-cursor="hover">{t.signIn}</Link></>}</p>
      </section>
    </main>
  </>;
}
