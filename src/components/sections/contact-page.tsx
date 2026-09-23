import { useState, useCallback } from "react";
import { Mail, Copy, Check, Send, Clock3, ShieldCheck, ArrowRight, MessageSquare } from "lucide-react";
import { useLanguage } from "@/lib/language";

const SUPPORT_EMAIL = "support@fytapi.com";

const EMAILS = [
  { label: { zh: "官方邮箱", en: "Official email" }, email: "info@fytapi.com" },
  { label: { zh: "商务合作", en: "Business cooperation" }, email: "Jenny@fytapi.com" },
  { label: { zh: "技术支持", en: "Technical support" }, email: "support@fytapi.com" },
];

type Category = "technical" | "account" | "billing" | "business" | "other";

const CATEGORIES: { value: Category; label: { zh: string; en: string } }[] = [
  { value: "technical", label: { zh: "API 与技术问题", en: "API & Technical" } },
  { value: "account", label: { zh: "账号与登录", en: "Account & Sign-in" } },
  { value: "billing", label: { zh: "计费与支付", en: "Billing & Payments" } },
  { value: "business", label: { zh: "商务合作", en: "Business inquiry" } },
  { value: "other", label: { zh: "其他", en: "Other" } },
];

function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);
  return { copied, copy };
}

export function ContactPage() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const { copied, copy } = useCopyToClipboard();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "technical" as Category,
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = zh ? "请输入姓名" : "Name is required";
    if (!form.email.trim()) next.email = zh ? "请输入邮箱" : "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = zh ? "请输入有效邮箱" : "Enter a valid email";
    if (!form.subject.trim()) next.subject = zh ? "请输入主题" : "Subject is required";
    if (!form.message.trim()) next.message = zh ? "请输入详情" : "Details are required";
    else if (form.message.trim().length < 10)
      next.message = zh ? "至少输入 10 个字符" : "At least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section className="contact-page">
      <div className="contact-bg-blur" aria-hidden="true" />

      {submitted ? (
        <div className="contact-success">
          <div className="contact-success-inner glass">
            <div className="contact-success-icon">
              <Check size={28} />
            </div>
            <h2 className="contact-success-title">
              {zh ? "消息已发送" : "Message sent"}
            </h2>
            <p className="contact-success-desc">
              {zh
                ? "我们的支持团队已收到你的消息，将尽快回复到你提供的邮箱。"
                : "Our support team has received your message and will reply to your email shortly."}
            </p>
            <button
              className="btn-ghost"
              onClick={() => {
                setSubmitted(false);
                setForm({ name: "", email: "", category: "technical", subject: "", message: "" });
              }}
              data-cursor="hover"
            >
              {zh ? "再发一条" : "Send another"} <ArrowRight size={15} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="contact-grid">
            <div className="contact-sidebar">
              <div className="contact-card glass">
                <div className="contact-card-head">
                  <span className="contact-card-icon">
                    <Mail size={18} strokeWidth={1.8} />
                  </span>
                  <h3>{zh ? "官方支持邮箱" : "Support email"}</h3>
                </div>
                <div className="contact-email-list">
                  {EMAILS.map(({ label, email }) => (
                    <div className="contact-email-row" key={email}>
                      <div className="contact-email-info">
                        <span className="contact-email-label">
                          {zh ? label.zh : label.en}
                        </span>
                        <a href={`mailto:${email}`} className="contact-email-address" data-cursor="hover">
                          {email}
                        </a>
                      </div>
                      <button
                        className="contact-copy-btn"
                        onClick={() => copy(email)}
                        data-cursor="hover"
                        aria-label={zh ? `复制 ${email}` : `Copy ${email}`}
                      >
                        {copied === email ? (
                          <>
                            <Check size={14} /> {zh ? "已复制" : "Copied"}
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> {zh ? "复制" : "Copy"}
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="contact-card glass">
                <div className="contact-card-head">
                  <span className="contact-card-icon">
                    <MessageSquare size={18} strokeWidth={1.8} />
                  </span>
                  <h3>{zh ? "微信联系" : "WeChat"}</h3>
                </div>
                <div className="contact-wechat-qr">
                  <img
                    src="/assets/contact/wechat-qr.jpg"
                    alt={zh ? "官方微信二维码" : "Official WeChat QR code"}
                    className="contact-qr-img"
                  />
                </div>
                <a
                  className="contact-email-link"
                  href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("FYT API support")}`}
                  data-cursor="hover"
                >
                  {zh ? "发送邮件" : "Send an email"} <ArrowRight size={14} />
                </a>
              </div>

              <div className="contact-tips">
                <div className="contact-tip">
                  <Clock3 size={16} strokeWidth={1.7} />
                  <div>
                    <p className="contact-tip-title">{zh ? "工作日优先" : "Business days"}</p>
                    <p className="contact-tip-desc">
                      {zh ? "工作日内优先处理，请保持邮箱畅通。" : "Priority response on business days. Keep your email accessible."}
                    </p>
                  </div>
                </div>
                <div className="contact-tip">
                  <ShieldCheck size={16} strokeWidth={1.7} />
                  <div>
                    <p className="contact-tip-title">{zh ? "保护密钥安全" : "Keep keys safe"}</p>
                    <p className="contact-tip-desc">
                      {zh ? "请勿在消息中发送完整 API Key，提供请求 ID 即可。" : "Never send full API keys. Share the request ID instead."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap">
              <div className="contact-form-card glass">
                <div className="contact-form-head">
                  <p className="section-kicker contact-form-kicker">
                    <span>{zh ? "联系我们" : "Contact us"}</span>
                  </p>
                  <h2 className="contact-form-title">
                    {zh ? "有问题？我们来帮你解决。" : "Need help? We've got you."}
                  </h2>
                  <p className="contact-form-desc">
                    {zh
                      ? "无论是账号、计费还是 API 对接问题，随时联系我们的支持团队。"
                      : "Account, billing, or API integration — reach out and our team will get back to you."}
                  </p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-form-row">
                    <div className="contact-field">
                      <label>{zh ? "姓名" : "Name"}</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder={zh ? "你的姓名" : "Your name"}
                        maxLength={80}
                      />
                      {errors.name && <span className="contact-field-error">{errors.name}</span>}
                    </div>
                    <div className="contact-field">
                      <label>{zh ? "邮箱" : "Email"}</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@company.com"
                        maxLength={160}
                      />
                      {errors.email && <span className="contact-field-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="contact-field">
                    <label>{zh ? "问题类型" : "Topic"}</label>
                    <select
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {zh ? cat.label.zh : cat.label.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="contact-field">
                    <label>{zh ? "主题" : "Subject"}</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      placeholder={zh ? "一句话描述问题" : "Describe the issue in one line"}
                      maxLength={160}
                    />
                    {errors.subject && <span className="contact-field-error">{errors.subject}</span>}
                  </div>

                  <div className="contact-field">
                    <label>{zh ? "详情" : "Details"}</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder={
                        zh
                          ? "发生了什么、你期望的结果，以及相关的请求 ID。"
                          : "What happened, what you expected, and any relevant request ID."
                      }
                      rows={5}
                      maxLength={5000}
                    />
                    <span className="contact-field-count">{form.message.length}/5000</span>
                    {errors.message && <span className="contact-field-error">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="contact-submit"
                    disabled={sending}
                    data-cursor="hover"
                  >
                    {sending ? (
                      <>{zh ? "发送中..." : "Sending..."}</>
                    ) : (
                      <>
                        {zh ? "发送" : "Send"} <Send size={15} />
                      </>
                    )}
                  </button>
                </form>

                <p className="contact-form-footer">
                  <Mail size={14} /> {SUPPORT_EMAIL}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
