import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { LiquidGlass } from "@/components/glass/liquid-glass";
import { useLanguage } from "@/lib/language";

const API_BASE_URL = "https://fytapi.com";

export function ApiPanel() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const [copied, setCopied] = useState(false);

  async function copyBaseUrl() {
    try {
      await navigator.clipboard.writeText(API_BASE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="api-panel-rig">
      <LiquidGlass className="api-panel" data-cursor="hover">
        <div className="api-panel-head">
          <span className="api-panel-index">FYT API <i aria-hidden="true" /> {zh ? "连接地址" : "ENDPOINT"}</span>
          <span className="api-panel-secure">HTTPS</span>
        </div>
        <p className="api-panel-label">API Base URL</p>
        <div className="api-url-row">
          <code>{API_BASE_URL}</code>
          <button className="api-copy" type="button" onClick={copyBaseUrl} aria-label={copied ? (zh ? "已复制" : "Copied") : (zh ? "复制 API 地址" : "Copy API base URL")}>
            {copied ? <Check size={16} strokeWidth={1.8} /> : <Copy size={16} strokeWidth={1.8} />}
            <span>{copied ? (zh ? "已复制" : "Copied") : (zh ? "复制" : "Copy")}</span>
          </button>
        </div>
        <p className="api-panel-note">
          {zh ? "在 SDK 或客户端中填入此地址，即可开始调用。" : "Use this address in your SDK or client to get started."}
        </p>
      </LiquidGlass>
    </div>
  );
}
