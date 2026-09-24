import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Code2,
  Copy,
  Gauge,
  Info,
  KeyRound,
  Layers3,
  X,
} from "lucide-react";
import { ModelLogo } from "@/components/models/model-logo";
import type { ModelInfo } from "@/lib/models";

type Props = {
  model: ModelInfo;
  tokenUnit: "1K" | "1M";
  language: string;
  onClose: () => void;
};

type CodeLanguage = "curl" | "python" | "typescript" | "javascript";

const BASE_URL = "https://fytapi.com/v1";

function exampleFor(modelId: string, language: CodeLanguage) {
  const body = JSON.stringify({
    model: modelId,
    messages: [{ role: "user", content: "Hello, Foyton API" }],
  }, null, 2);
  if (language === "curl") {
    return `curl ${BASE_URL}/chat/completions \\\n  -H "Authorization: Bearer <FYTAPI_API_KEY>" \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`;
  }
  if (language === "python") {
    return `from openai import OpenAI\n\nclient = OpenAI(\n    api_key="<FYTAPI_API_KEY>",\n    base_url="${BASE_URL}",\n)\n\nresponse = client.chat.completions.create(\n    model="${modelId}",\n    messages=[{"role": "user", "content": "Hello, Foyton API"}],\n)\nprint(response.choices[0].message.content)`;
  }
  if (language === "typescript") {
    return `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.FYTAPI_API_KEY,\n  baseURL: "${BASE_URL}",\n});\n\nconst response = await client.chat.completions.create({\n  model: "${modelId}",\n  messages: [{ role: "user", content: "Hello, Foyton API" }],\n});\nconsole.log(response.choices[0].message.content);`;
  }
  return `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  apiKey: process.env.FYTAPI_API_KEY,\n  baseURL: "${BASE_URL}",\n});\n\nconst response = await client.chat.completions.create({\n  model: "${modelId}",\n  messages: [{ role: "user", content: "Hello, Foyton API" }],\n});\nconsole.log(response.choices[0].message.content);`;
}

function DetailMetric({ icon, label, value, note }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="model-detail-metric">
      <div className="model-detail-metric-label">{icon}<span>{label}</span></div>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

export function ModelDetailsDialog({ model, tokenUnit, language, onClose }: Props) {
  const zh = language === "zh";
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("curl");
  const [copied, setCopied] = useState<"id" | "code" | null>(null);
  const oneK = tokenUnit === "1K";
  const input = oneK ? model.foytonInput1K ?? model.input : model.foytonInput1M ?? model.input;
  const output = oneK ? model.foytonOutput1K ?? model.output : model.foytonOutput1M ?? model.output;
  const officialInput = oneK ? model.officialInput1K : model.officialInput1M;
  const officialOutput = oneK ? model.officialOutput1K : model.officialOutput1M;
  const cached = oneK ? model.cached1K : model.cached1M;
  const sample = exampleFor(model.id, codeLanguage);

  const copy = async (value: string, kind: "id" | "code") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      window.setTimeout(() => setCopied((current) => current === kind ? null : current), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="model-detail-overlay" />
        <Dialog.Content className="model-detail-dialog">
          <header className="model-detail-header">
            <div className="model-detail-heading">
              <span className="model-detail-logo"><ModelLogo name={model.provider} size={28} /></span>
              <div className="model-detail-title-group">
                <p className="model-detail-eyebrow">MODEL PROFILE <span>／</span> {model.provider}</p>
                <Dialog.Title className="model-detail-title">{model.full}</Dialog.Title>
                <Dialog.Description className="model-detail-description">
                  {model.description || (zh ? "模型定价与接入信息" : "Model pricing and integration details")}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="model-detail-close" aria-label={zh ? "关闭详情" : "Close details"}><X size={20} /></Dialog.Close>
          </header>

          <div className="model-detail-id-line">
            <span>{zh ? "模型 ID" : "Model ID"}</span>
            <code>{model.id}</code>
            <button type="button" onClick={() => copy(model.id, "id")} aria-label={zh ? "复制模型 ID" : "Copy model ID"}>
              {copied === "id" ? <Check size={15} /> : <Copy size={15} />}
              {copied === "id" ? (zh ? "已复制" : "Copied") : (zh ? "复制" : "Copy")}
            </button>
          </div>

          <Tabs.Root defaultValue="overview" className="model-detail-tabs">
            <Tabs.List className="model-detail-tab-list" aria-label={zh ? "模型详情页面" : "Model detail pages"}>
              <Tabs.Trigger value="overview"><Info size={17} />{zh ? "概览" : "Overview"}</Tabs.Trigger>
              <Tabs.Trigger value="performance"><Activity size={17} />{zh ? "性能" : "Performance"}</Tabs.Trigger>
              <Tabs.Trigger value="api"><Code2 size={17} />API</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="overview" className="model-detail-content">
              <div className="model-detail-section-heading">
                <div><p className="model-detail-kicker">01 / PRICING</p><h3>{zh ? "价格概览" : "Pricing overview"}</h3></div>
                <span className="model-detail-unit">USD / {tokenUnit} TOKENS</span>
              </div>
              <div className="model-detail-prices">
                <div><span>{zh ? "输入" : "Input"}</span><strong>{input}</strong><small>{zh ? "每" : "per"} {tokenUnit} tokens</small></div>
                <div><span>{zh ? "输出" : "Output"}</span><strong>{output}</strong><small>{zh ? "每" : "per"} {tokenUnit} tokens</small></div>
                <div><span>{zh ? "缓存读取" : "Cache read"}</span><strong>{cached ?? "—"}</strong><small>{cached ? `${zh ? "每" : "per"} ${tokenUnit} tokens` : (zh ? "暂无价格" : "Unavailable")}</small></div>
              </div>
              <div className="model-detail-section-heading model-detail-section-heading-lower">
                <div><p className="model-detail-kicker">02 / COMPARISON</p><h3>{zh ? "价格对照" : "Price comparison"}</h3></div>
              </div>
              <div className="model-detail-price-table-wrap"><table className="model-detail-price-table">
                <thead><tr><th>{zh ? "渠道" : "Source"}</th><th>{zh ? "输入" : "Input"}</th><th>{zh ? "输出" : "Output"}</th></tr></thead>
                <tbody>
                  <tr className="is-highlight"><th>FOYTON API</th><td>{input}</td><td>{output}</td></tr>
                  <tr><th>{zh ? "官方参考价" : "Official reference"}</th><td>{officialInput ?? "—"}</td><td>{officialOutput ?? "—"}</td></tr>
                </tbody>
              </table></div>
              <p className="model-detail-footnote">{zh ? `当前显示每 ${tokenUnit} Token 的参考价。实际结算以控制台账单为准。` : `Reference prices per ${tokenUnit} tokens. Your console bill is authoritative.`}</p>
              <div className="model-detail-next"><span>{zh ? "准备开始使用？" : "Ready to use this model?"}</span><Link to="/console/keys">{zh ? "获取 API 密钥" : "Get API key"}<ArrowRight size={16} /></Link></div>
            </Tabs.Content>

            <Tabs.Content value="performance" className="model-detail-content">
              <div className="model-detail-section-heading"><div><p className="model-detail-kicker">02 / PERFORMANCE</p><h3>{zh ? "性能概览" : "Performance overview"}</h3></div><span className="model-detail-unit">{zh ? "模型参考信息" : "MODEL REFERENCE"}</span></div>
              <div className="model-detail-metrics">
                <DetailMetric icon={<Clock3 size={17} />} label={zh ? "典型延迟" : "Typical latency"} value={model.latency || "—"} note={zh ? "当前模型参考值" : "Model reference value"} />
                <DetailMetric icon={<Gauge size={17} />} label={zh ? "参考可用性" : "Reference availability"} value={model.availability == null ? "—" : `${model.availability.toFixed(2)}%`} note={zh ? "当前模型参考值" : "Model reference value"} />
                <DetailMetric icon={<Layers3 size={17} />} label={zh ? "上下文窗口" : "Context window"} value={model.context || "—"} note={zh ? "模型规格" : "Model specification"} />
              </div>
              <div className="model-detail-performance-grid">
                <section className="model-detail-empty-card"><div className="model-detail-empty-icon"><Activity size={20} /></div><h4>{zh ? "分组性能" : "Performance by group"}</h4><p>{zh ? "暂无可展示的 TPS、首 Token 延迟和分组测速记录。" : "No TPS, first-token latency, or group measurement records are available yet."}</p></section>
                <section className="model-detail-empty-card"><div className="model-detail-empty-icon"><Clock3 size={20} /></div><h4>{zh ? "近 24 小时趋势" : "Last 24 hours"}</h4><p>{zh ? "暂无历史延迟数据，后续有记录时可在此展示趋势。" : "Historical latency data is not available yet."}</p></section>
              </div>
            </Tabs.Content>

            <Tabs.Content value="api" className="model-detail-content">
              <div className="model-detail-section-heading"><div><p className="model-detail-kicker">03 / INTEGRATION</p><h3>{zh ? "调用示例" : "API example"}</h3></div><span className="model-detail-unit">OPENAI COMPATIBLE</span></div>
              <div className="model-detail-code-toolbar"><div className="model-detail-code-tabs" role="group" aria-label={zh ? "代码语言" : "Code language"}>{(["curl", "python", "typescript", "javascript"] as const).map((item) => <button key={item} type="button" className={codeLanguage === item ? "is-active" : ""} onClick={() => setCodeLanguage(item)}>{item === "curl" ? "cURL" : item === "typescript" ? "TypeScript" : item === "javascript" ? "JavaScript" : "Python"}</button>)}</div><button type="button" className="model-detail-copy-code" onClick={() => copy(sample, "code")}>{copied === "code" ? <Check size={15} /> : <Copy size={15} />}{copied === "code" ? (zh ? "已复制" : "Copied") : (zh ? "复制代码" : "Copy code")}</button></div>
              <pre className="model-detail-code"><code>{sample}</code></pre>
              <div className="model-detail-api-notes">
                <div><KeyRound size={19} /><div><h4>{zh ? "身份验证" : "Authentication"}</h4><p>{zh ? "将示例中的 <FYTAPI_API_KEY> 替换为你在控制台创建的密钥。请求使用 Authorization: Bearer 请求头。" : "Replace <FYTAPI_API_KEY> with a key from the console. Requests use the Authorization: Bearer header."}</p></div></div>
                <div><Info size={19} /><div><h4>{zh ? "请求参数" : "Request parameters"}</h4><p>{zh ? "model 填写上方模型 ID，messages 包含对话内容。其他参数和流式响应请查看接入文档。" : "Use the model ID above for model and pass conversation content in messages. See the guide for other parameters and streaming."}</p></div></div>
              </div>
              <div className="model-detail-next"><span>{zh ? "需要更多接入说明？" : "Need more integration details?"}</span><Link to="/docs/api/openai">{zh ? "查看接入文档" : "Open API guide"}<ArrowRight size={16} /></Link></div>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
