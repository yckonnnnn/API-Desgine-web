/**
 * Documentation content for the developer centre.
 *
 * Ported from the prototype's `web/src/features/docs/docs-content.ts`, which
 * kept English copy in the data and looked translations up in a flat
 * `ZH_DOC_TEXT` dictionary. This site pairs both languages inline instead —
 * the same shape `MODELS` and the console copy already use — so a page renders
 * correctly without a lookup table and a missing translation is a type error
 * rather than an English string leaking into the Chinese UI.
 *
 * Model identifiers match `src/lib/models.ts` so a reader can copy an example
 * into the playground without renaming the model.
 */

export type DocLang = { zh: string; en: string };

export type DocPageId =
  | "quickstart"
  | "models"
  | "openai"
  | "anthropic"
  | "claude-code"
  | "codex"
  | "troubleshooting";

export type DocGroupId = "start" | "api" | "clients" | "support";

export type DocCodeSample = {
  language: string;
  label: string;
  content: string;
};

export type DocTable = {
  head: DocLang[];
  rows: DocLang[][];
};

export type DocSection = {
  id: string;
  title: DocLang;
  paragraphs?: DocLang[];
  bullets?: DocLang[];
  note?: DocLang;
  code?: DocCodeSample;
  table?: DocTable;
};

export type DocPage = {
  id: DocPageId;
  href: string;
  group: DocGroupId;
  title: DocLang;
  description: DocLang;
  eyebrow: DocLang;
  sections: DocSection[];
  previous?: DocPageId;
  next?: DocPageId;
};

export const DOC_GROUPS: { id: DocGroupId; label: DocLang }[] = [
  { id: "start", label: { zh: "快速入门", en: "Getting started" } },
  { id: "api", label: { zh: "API 参考", en: "API reference" } },
  { id: "clients", label: { zh: "客户端接入", en: "Client guides" } },
  { id: "support", label: { zh: "问题排查", en: "Support" } },
];

/** The one host every example points at. */
export const DOC_BASE_URL = "https://fytapi.com";

export const DOC_OPENAI_BASE_URL = `${DOC_BASE_URL}/v1`;
export const DOC_ANTHROPIC_BASE_URL = `${DOC_BASE_URL}/anthropic/v1`;

export const DOC_PAGES: DocPage[] = [
  {
    id: "quickstart",
    href: "/docs/quickstart",
    group: "start",
    title: { zh: "快速开始", en: "Quick start" },
    description: {
      zh: "几分钟内创建 API Key，发出第一个请求。",
      en: "Create an API key and send your first request in a few minutes.",
    },
    eyebrow: { zh: "从这里开始", en: "Start here" },
    sections: [
      {
        id: "before-you-start",
        title: { zh: "开始之前", en: "Before you start" },
        paragraphs: [
          {
            zh: "Foyton API 为多个 AI 提供商提供统一网关。大多数 OpenAI 兼容工具只需要替换 API Key 和 Base URL，不需要改动业务代码。",
            en: "Foyton API is a unified gateway in front of several AI providers. Most OpenAI-compatible tools only need a new API key and Base URL — no application changes.",
          },
        ],
        bullets: [
          { zh: "登录 Foyton API 控制台。", en: "Sign in to the Foyton API console." },
          {
            zh: "在「密钥」页面创建一个 API Key。",
            en: "Create an API key from the keys page.",
          },
          {
            zh: "选择账号所属分组可用的模型。",
            en: "Pick a model that is enabled for your account group.",
          },
        ],
      },
      {
        id: "base-url",
        title: { zh: "配置 Base URL", en: "Configure the Base URL" },
        paragraphs: [
          {
            zh: "除非客户端指南明确要求其他协议端点，否则请使用下面的 OpenAI 兼容端点。",
            en: "Unless a client guide asks for a different protocol endpoint, use the OpenAI-compatible endpoint below.",
          },
        ],
        code: {
          language: "text",
          label: "Base URL",
          content: DOC_BASE_URL,
        },
        table: {
          head: [
            { zh: "协议", en: "Protocol" },
            { zh: "端点", en: "Endpoint" },
            { zh: "鉴权方式", en: "Authentication" },
          ],
          rows: [
            [
              { zh: "OpenAI 兼容", en: "OpenAI-compatible" },
              { zh: DOC_OPENAI_BASE_URL, en: DOC_OPENAI_BASE_URL },
              { zh: "Authorization: Bearer", en: "Authorization: Bearer" },
            ],
            [
              { zh: "Anthropic Messages", en: "Anthropic Messages" },
              { zh: DOC_ANTHROPIC_BASE_URL, en: DOC_ANTHROPIC_BASE_URL },
              { zh: "x-api-key", en: "x-api-key" },
            ],
          ],
        },
        note: {
          zh: "请妥善保管 API Key，绝不要将其放进前端代码、公开仓库、截图或客服消息中。",
          en: "Keep your API key private. Never place it in frontend code, public repositories, screenshots, or support messages.",
        },
      },
      {
        id: "first-request",
        title: { zh: "发送第一个请求", en: "Send your first request" },
        paragraphs: [
          {
            zh: "运行命令前请替换示例中的 Key 和模型名。请求成功时，响应会在 choices 中包含助手消息。",
            en: "Replace the placeholder key and model before running the command. A successful response carries the assistant message in choices.",
          },
        ],
        code: {
          language: "bash",
          label: "cURL",
          content: `curl ${DOC_OPENAI_BASE_URL}/chat/completions \\
  -H "Authorization: Bearer <FYTAPI_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5",
    "messages": [{"role": "user", "content": "Hello, Foyton API"}]
  }'`,
        },
      },
      {
        id: "next-step",
        title: { zh: "选择下一步", en: "Choose your next step" },
        bullets: [
          {
            zh: "通过 OpenAI API 指南了解请求参数与流式响应。",
            en: "Use the OpenAI API guide for request parameters and streaming.",
          },
          {
            zh: "根据 Claude Code 或 Codex 指南配置编程智能体。",
            en: "Use the Claude Code or Codex guide for coding-agent setup.",
          },
          {
            zh: "打开「模型列表」确认模型可用性与价格。",
            en: "Open the model list to confirm availability and pricing.",
          },
        ],
      },
    ],
    next: "models",
  },
  {
    id: "models",
    href: "/docs/models",
    group: "start",
    title: { zh: "模型与计费", en: "Models and billing" },
    description: {
      zh: "在投入生产前了解模型可用性、分组、额度与用量规则。",
      en: "Understand model availability, groups, quota, and usage before production rollout.",
    },
    eyebrow: { zh: "平台基础", en: "Platform basics" },
    sections: [
      {
        id: "model-availability",
        title: { zh: "模型可用性", en: "Model availability" },
        paragraphs: [
          {
            zh: "模型列表由当前账号可用的渠道与分组生成。其他服务展示的模型名，不一定已在你的分组中启用。",
            en: "The model list is generated from the channels and groups available to your account. A model name shown by another service may not be enabled for your Foyton API group.",
          },
        ],
        bullets: [
          { zh: "在模型列表查看当前可用模型。", en: "Check the model list for currently available models." },
          { zh: "使用控制台中显示的完整模型标识。", en: "Use the exact model identifier shown in the console." },
          { zh: "确认 API Key 可以访问所选分组。", en: "Confirm your API key can reach the selected group." },
        ],
      },
      {
        id: "billing",
        title: { zh: "计费与额度", en: "Billing and quota" },
        paragraphs: [
          {
            zh: "用量由所选模型、请求类型、Token 消耗以及平台配置的计价规则共同计算，账单按美元结算。",
            en: "Usage is calculated from the selected model, request type, token consumption, and the platform's pricing rules. Balances settle in USD.",
          },
          {
            zh: "控制台的「用量」与「账单」页面可以查看实时消耗、余额和充值记录。",
            en: "The console's usage and billing pages show live consumption, balance, and top-up history.",
          },
        ],
        note: {
          zh: "请使用具有代表性的真实请求估算生产成本，不要只依赖一个短提示词。",
          en: "Estimate production cost with real representative requests instead of relying on a single short prompt.",
        },
      },
      {
        id: "production-checklist",
        title: { zh: "生产环境检查清单", en: "Production checklist" },
        bullets: [
          { zh: "设置请求超时和有次数上限的重试。", en: "Set request timeouts and bounded retries." },
          {
            zh: "记录请求标识，但不要记录 API Key 或私密提示词。",
            en: "Record request identifiers without logging API keys or private prompts.",
          },
          { zh: "正确处理限流与上游临时故障。", en: "Handle rate limits and transient upstream failures." },
          { zh: "监控剩余额度，在余额耗尽前充值。", en: "Monitor quota and top up before the balance is exhausted." },
        ],
      },
    ],
    previous: "quickstart",
    next: "openai",
  },
  {
    id: "openai",
    href: "/docs/api/openai",
    group: "api",
    title: { zh: "OpenAI 兼容 API", en: "OpenAI-compatible API" },
    description: {
      zh: "用常见的 OpenAI SDK 和工具调用对话补全接口。",
      en: "Call chat completions with the common OpenAI SDKs and tools.",
    },
    eyebrow: { zh: "API 协议", en: "API protocol" },
    sections: [
      {
        id: "endpoint",
        title: { zh: "端点与鉴权", en: "Endpoint and authentication" },
        paragraphs: [
          {
            zh: "在 Authorization 请求头中发送 Bearer Token，并使用 Foyton API 的 OpenAI 兼容 Base URL。",
            en: "Send a bearer token in the Authorization header and point your client at the Foyton API OpenAI-compatible Base URL.",
          },
        ],
        code: {
          language: "http",
          label: "HTTP",
          content: `POST /v1/chat/completions HTTP/1.1
Host: fytapi.com
Authorization: Bearer <FYTAPI_API_KEY>
Content-Type: application/json`,
        },
      },
      {
        id: "javascript",
        title: { zh: "JavaScript SDK 示例", en: "JavaScript SDK example" },
        paragraphs: [
          {
            zh: "OpenAI 官方 SDK 只需替换 apiKey 与 baseURL，其余调用方式保持不变。",
            en: "With the official OpenAI SDK you only replace apiKey and baseURL; everything else stays the same.",
          },
        ],
        code: {
          language: "typescript",
          label: "TypeScript",
          content: `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.FYTAPI_API_KEY,
  baseURL: '${DOC_OPENAI_BASE_URL}',
})

const response = await client.chat.completions.create({
  model: 'gpt-5',
  messages: [{ role: 'user', content: 'Hello' }],
})

console.log(response.choices[0].message.content)`,
        },
      },
      {
        id: "streaming",
        title: { zh: "流式响应", en: "Streaming responses" },
        paragraphs: [
          {
            zh: "将 stream 设为 true 并逐步消费 SSE 事件。客户端需要处理断开连接、部分输出以及流结束标记。",
            en: "Set stream to true and consume server-sent events incrementally. Your client must handle disconnects, partial output, and the end-of-stream marker.",
          },
        ],
        code: {
          language: "json",
          label: "Request fragment",
          content: `{
  "model": "gpt-5",
  "messages": [{"role": "user", "content": "Explain streaming"}],
  "stream": true
}`,
        },
      },
      {
        id: "compatibility",
        title: { zh: "兼容性说明", en: "Compatibility notes" },
        bullets: [
          {
            zh: "可选参数是否生效取决于所选上游模型。",
            en: "Optional parameters depend on the selected upstream model.",
          },
          {
            zh: "不要假设所有模型都支持工具调用、图片、JSON 模式或流式选项。",
            en: "Do not assume every model supports tools, images, JSON mode, or streaming options.",
          },
          {
            zh: "以代码构建请求时，应保留显式传入的 0 与 false。",
            en: "Preserve explicit zero and false values when building requests programmatically.",
          },
        ],
      },
    ],
    previous: "models",
    next: "anthropic",
  },
  {
    id: "anthropic",
    href: "/docs/api/anthropic",
    group: "api",
    title: { zh: "Anthropic Messages API", en: "Anthropic Messages API" },
    description: {
      zh: "在 Claude 兼容客户端中使用 Anthropic Messages 格式。",
      en: "Use the Anthropic message format with Claude-compatible clients.",
    },
    eyebrow: { zh: "API 协议", en: "API protocol" },
    sections: [
      {
        id: "endpoint",
        title: { zh: "协议端点", en: "Protocol endpoint" },
        paragraphs: [
          {
            zh: "Anthropic 原生客户端需要使用对应协议端点，并通过 x-api-key 请求头发送 API Key。",
            en: "Anthropic-native clients use a protocol-specific endpoint and send the API key through the x-api-key header.",
          },
        ],
        code: {
          language: "text",
          label: "Base URL",
          content: DOC_ANTHROPIC_BASE_URL,
        },
      },
      {
        id: "request",
        title: { zh: "消息请求", en: "Message request" },
        code: {
          language: "bash",
          label: "cURL",
          content: `curl ${DOC_ANTHROPIC_BASE_URL}/messages \\
  -H "x-api-key: <FYTAPI_API_KEY>" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-4-sonnet",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
        },
      },
      {
        id: "model-support",
        title: { zh: "模型支持", en: "Model support" },
        paragraphs: [
          {
            zh: "请使用模型列表中已启用的 Claude 模型标识。提供商特有的 Beta 请求头与功能可能需要兼容渠道。",
            en: "Use a Claude model identifier enabled in the model list. Provider-specific beta headers and features may require a compatible channel.",
          },
        ],
        note: {
          zh: "如果请求通过 OpenAI 兼容协议可以成功、但通过 Anthropic Messages 失败，请先检查所选渠道协议与 Base URL。",
          en: "If a request succeeds through the OpenAI-compatible protocol but fails through Anthropic Messages, verify the channel protocol and Base URL first.",
        },
      },
    ],
    previous: "openai",
    next: "claude-code",
  },
  {
    id: "claude-code",
    href: "/docs/clients/claude-code",
    group: "clients",
    title: { zh: "Claude Code", en: "Claude Code" },
    description: {
      zh: "通过环境变量将 Claude Code 接入 Foyton API。",
      en: "Connect Claude Code to Foyton API with environment variables.",
    },
    eyebrow: { zh: "编程客户端", en: "Coding client" },
    sections: [
      {
        id: "configuration",
        title: { zh: "环境变量配置", en: "Environment configuration" },
        paragraphs: [
          {
            zh: "请在可信的本地终端中配置 Claude Code。不要把真实 API Key 保存到代码仓库，也不要通过截图分享。",
            en: "Configure Claude Code in a trusted local shell. Do not save a real API key in a repository or share it in a screenshot.",
          },
        ],
        code: {
          language: "powershell",
          label: "PowerShell",
          content: `$env:ANTHROPIC_BASE_URL = "${DOC_ANTHROPIC_BASE_URL}"
$env:ANTHROPIC_API_KEY = "<FYTAPI_API_KEY>"
$env:ANTHROPIC_MODEL = "claude-4-sonnet"
claude`,
        },
      },
      {
        id: "persistent-configuration",
        title: { zh: "持久化配置", en: "Persistent configuration" },
        paragraphs: [
          {
            zh: "如需持久化配置，请使用操作系统的密钥存储，或使用已排除在版本控制之外的私有环境文件。",
            en: "For persistent configuration, use your operating system's secret storage or a private environment file excluded from version control.",
          },
        ],
        note: {
          zh: "修改环境变量后，请重新启动终端或客户端。",
          en: "Restart the terminal or client after changing environment variables.",
        },
      },
      {
        id: "verification",
        title: { zh: "验证连接", en: "Verify the connection" },
        bullets: [
          {
            zh: "确认客户端启动时没有身份验证错误。",
            en: "Confirm the client starts without an authentication error.",
          },
          {
            zh: "发送一个简短提示词，并确认用量记录出现在控制台。",
            en: "Send a short prompt and verify usage appears in the console.",
          },
          {
            zh: "如果模型不可用，请选择账号已启用的 Claude 模型。",
            en: "If the model is unavailable, select a Claude model enabled for your account.",
          },
        ],
      },
    ],
    previous: "anthropic",
    next: "codex",
  },
  {
    id: "codex",
    href: "/docs/clients/codex",
    group: "clients",
    title: { zh: "Codex CLI", en: "Codex CLI" },
    description: {
      zh: "为 Codex 工作流配置 OpenAI 兼容服务。",
      en: "Configure an OpenAI-compatible provider for Codex workflows.",
    },
    eyebrow: { zh: "编程客户端", en: "Coding client" },
    sections: [
      {
        id: "requirements",
        title: { zh: "配置前准备", en: "Before configuration" },
        bullets: [
          { zh: "安装当前可用的 Codex CLI 版本。", en: "Install a current Codex CLI release." },
          {
            zh: "为本地开发创建专用的 Foyton API Key。",
            en: "Create a dedicated Foyton API key for local development.",
          },
          { zh: "选择当前分组可用的兼容模型。", en: "Choose a compatible model available to your group." },
        ],
      },
      {
        id: "provider",
        title: { zh: "服务提供方配置", en: "Provider configuration" },
        paragraphs: [
          {
            zh: "将 OpenAI 兼容服务指向 Foyton API Base URL。不同 Codex CLI 版本使用的具体配置字段可能不同。",
            en: "Point the OpenAI-compatible provider at the Foyton API Base URL. Exact configuration fields vary by Codex CLI release.",
          },
        ],
        code: {
          language: "toml",
          label: "Configuration example",
          content: `model = "gpt-5"
model_provider = "fytapi"

[model_providers.fytapi]
name = "Foyton API"
base_url = "${DOC_OPENAI_BASE_URL}"
env_key = "FYTAPI_API_KEY"
wire_api = "responses"`,
        },
        note: {
          zh: "请使用当前客户端版本支持的配置格式，不要把真实 Key 直接写入配置文件。",
          en: "Use the configuration schema supported by your installed client version. Do not paste your real key into the configuration file.",
        },
      },
      {
        id: "run",
        title: { zh: "启动会话", en: "Start a session" },
        code: {
          language: "powershell",
          label: "PowerShell",
          content: `$env:FYTAPI_API_KEY = "<FYTAPI_API_KEY>"
codex`,
        },
      },
    ],
    previous: "claude-code",
    next: "troubleshooting",
  },
  {
    id: "troubleshooting",
    href: "/docs/troubleshooting",
    group: "support",
    title: { zh: "错误排查", en: "Troubleshooting" },
    description: {
      zh: "排查身份验证、限流、上游故障与超时问题。",
      en: "Diagnose authentication, rate-limit, upstream, and timeout errors.",
    },
    eyebrow: { zh: "错误诊断", en: "Diagnostics" },
    sections: [
      {
        id: "status-codes",
        title: { zh: "状态码速查", en: "Status code reference" },
        paragraphs: [
          {
            zh: "先看状态码，再定位具体原因，通常能省掉一轮来回排查。",
            en: "Start from the status code; it usually narrows the cause faster than reading logs first.",
          },
        ],
        table: {
          head: [
            { zh: "状态码", en: "Status" },
            { zh: "含义", en: "Meaning" },
            { zh: "首要排查方向", en: "First thing to check" },
          ],
          rows: [
            [
              { zh: "401", en: "401" },
              { zh: "身份验证失败", en: "Authentication failed" },
              { zh: "Key 完整性、请求头格式", en: "Key integrity, header format" },
            ],
            [
              { zh: "403", en: "403" },
              { zh: "权限不足", en: "Permission denied" },
              { zh: "模型/分组权限、Key 状态", en: "Model and group access, key state" },
            ],
            [
              { zh: "429", en: "429" },
              { zh: "请求频率受限", en: "Rate limited" },
              { zh: "并发量与退避策略", en: "Concurrency and backoff" },
            ],
            [
              { zh: "5xx", en: "5xx" },
              { zh: "上游服务故障", en: "Upstream failure" },
              { zh: "请求标识、模型与时间点", en: "Request id, model, timestamp" },
            ],
          ],
        },
      },
      {
        id: "authentication",
        title: { zh: "401 身份验证失败", en: "401 authentication failed" },
        bullets: [
          { zh: "确认 API Key 完整且没有多余空格。", en: "Verify the API key is complete and has no extra spaces." },
          {
            zh: "确认请求头格式与所选 API 协议一致。",
            en: "Confirm the header format matches the selected API protocol.",
          },
          {
            zh: "如果当前 Key 已被删除、禁用或泄露，请创建新 Key。",
            en: "Create a new key if the current one was deleted, disabled, or exposed.",
          },
        ],
      },
      {
        id: "permission",
        title: { zh: "403 权限不足", en: "403 permission denied" },
        bullets: [
          {
            zh: "确认 API Key 有权访问请求的模型与分组。",
            en: "Confirm the API key can access the requested model and group.",
          },
          {
            zh: "检查账号、Key 或所选渠道是否被禁用。",
            en: "Check whether the account, key, or selected channel is disabled.",
          },
          { zh: "如果 Key 启用了 IP 限制，请检查相关配置。", en: "Review IP restrictions if they are enabled for the key." },
        ],
      },
      {
        id: "rate-limit",
        title: { zh: "429 请求频率受限", en: "429 rate limited" },
        paragraphs: [
          {
            zh: "降低并发，并使用带随机抖动的指数退避进行重试。不要让所有失败请求同时立即重试。",
            en: "Reduce concurrency and retry with exponential backoff plus jitter. Do not immediately retry every failed request at the same time.",
          },
        ],
        code: {
          language: "typescript",
          label: "Backoff",
          content: `const delay = (attempt: number) =>
  Math.min(2 ** attempt * 250, 8_000) * (0.5 + Math.random())`,
        },
      },
      {
        id: "upstream",
        title: { zh: "5xx 与上游服务故障", en: "5xx and upstream failures" },
        paragraphs: [
          {
            zh: "上游提供商的临时故障可能表现为 500、502 或 503 响应。联系客服前，请记录请求标识、模型、时间以及已脱敏的错误信息。",
            en: "Transient provider failures surface as 500, 502, or 503 responses. Before contacting support, record the request identifier, model, timestamp, and a sanitized error.",
          },
        ],
        note: {
          zh: "提交问题证据时，绝不要包含 API Key、Authorization 请求头、完整私密提示词或支付凭据。",
          en: "Never include API keys, authorization headers, full private prompts, or payment credentials in support evidence.",
        },
      },
      {
        id: "timeout",
        title: { zh: "请求超时与流中断", en: "Timeouts and interrupted streams" },
        bullets: [
          {
            zh: "对于长时间推理或媒体请求，请适当增加客户端超时时间。",
            en: "Increase the client timeout for long reasoning or media requests.",
          },
          {
            zh: "确认反向代理不会缓冲或提前终止 SSE 流。",
            en: "Confirm reverse proxies do not buffer or terminate server-sent events.",
          },
          { zh: "仅对幂等操作执行自动重试。", en: "Retry only idempotent operations automatically." },
        ],
      },
    ],
    previous: "codex",
  },
];

export const DOC_PAGE_BY_ID = Object.fromEntries(
  DOC_PAGES.map((page) => [page.id, page]),
) as Record<DocPageId, DocPage>;

/** Picks the string for the active language. */
export function docText(value: DocLang, zh: boolean) {
  return zh ? value.zh : value.en;
}
