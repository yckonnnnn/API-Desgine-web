export type ModelCategory =
  | "ALL"
  | "CHAT"
  | "REASONING"
  | "CODE"
  | "VISION"
  | "IMAGE"
  | "AUDIO";

export type ModelInfo = {
  name: string;
  full: string;
  id: string;
  provider: string;
  category: Exclude<ModelCategory, "ALL">;
  latency: string;
  price: string;
  input: string;
  output: string;
  context: string;
  status: string;
  featured?: boolean;

  // Comparison fields matching prototype
  officialInput1K?: string;
  officialOutput1K?: string;
  foytonInput1K?: string;
  foytonOutput1K?: string;
  officialInput1M?: string;
  officialOutput1M?: string;
  foytonInput1M?: string;
  foytonOutput1M?: string;
  discount?: string;
  cached1K?: string;
  cached1M?: string;
  availability?: number;
  description?: string;
  tags?: string[];
};

type ModelSeed = {
  name: string;
  full: string;
  id: string;
  provider: string;
  category: Exclude<ModelCategory, "ALL">;
  context: string;
  latency: string;
  availability: number;
  /** FOYTON API price per 1M tokens (USD), taken from the cheapest tier the prototype shows. */
  input: number;
  output: number;
  /** Official vendor list price per 1M tokens (USD) for the same tier. */
  officialInput: number;
  officialOutput: number;
  /** FOYTON cached-input price per 1M tokens (USD). */
  cached?: number;
  featured?: boolean;
  description: string;
  tags: string[];
};

function usd(value: number, decimals: number): string {
  const fixed = value.toFixed(decimals);
  const trimmed = fixed.includes(".")
    ? fixed.replace(/0+$/, "").replace(/\.$/, "")
    : fixed;
  return `$${trimmed}`;
}

const perK = (perMillion: number) => usd(perMillion / 1000, 9);
const perM = (perMillion: number) => usd(perMillion, 6);

/**
 * Model names, IDs and prices mirror the prototype model square
 * (fytapi-go `/api/pricing`), where each model shows its cheapest tier.
 */
const MODEL_SEEDS: ModelSeed[] = [
  {
    name: "GPT",
    full: "GPT-6 Astra",
    id: "gpt-6-astra",
    provider: "OpenAI",
    category: "CHAT",
    context: "1M",
    latency: "801ms",
    availability: 100,
    input: 3,
    output: 15,
    officialInput: 10,
    officialOutput: 50,
    cached: 0.3,
    featured: true,
    description: "新一代全模态旗舰模型，面向复杂智能体任务、代码工程与实时协作。",
    tags: ["旗舰通用", "智能体", "全模态"],
  },
  {
    name: "GPT",
    full: "GPT-5.6 Sol",
    id: "gpt-5.6-sol",
    provider: "OpenAI",
    category: "CHAT",
    context: "1M",
    latency: "82ms",
    availability: 99.92,
    input: 1.2,
    output: 6,
    officialInput: 4,
    officialOutput: 20,
    cached: 0.12,
    featured: true,
    description: "兼顾速度、成本与工具调用能力，适合高频日常任务和批量处理。",
    tags: ["快速响应", "工具调用", "高吞吐"],
  },
  {
    name: "GPT",
    full: "GPT-5.6 Terra",
    id: "gpt-5.6-terra",
    provider: "OpenAI",
    category: "CHAT",
    context: "1M",
    latency: "5.52s",
    availability: 100,
    input: 0.6,
    output: 3.6,
    officialInput: 2,
    officialOutput: 12,
    cached: 0.06,
    description: "平衡推理深度与响应速度，适合企业知识问答与复杂指令执行。",
    tags: ["均衡性能", "企业问答", "指令遵循"],
  },
  {
    name: "GPT",
    full: "GPT-5.6 Luna",
    id: "gpt-5.6-luna",
    provider: "OpenAI",
    category: "CHAT",
    context: "1M",
    latency: "23.5s",
    availability: 100,
    input: 0.06,
    output: 0.36,
    officialInput: 0.2,
    officialOutput: 1.2,
    cached: 0.006,
    description: "轻量高性价比版本，适合大规模批处理、内容生成与实时对话。",
    tags: ["极速轻量", "高性价比", "批量处理"],
  },
  {
    name: "Claude",
    full: "Claude Fable 5.1",
    id: "claude-fable-5-1",
    provider: "Anthropic",
    category: "REASONING",
    context: "1M",
    latency: "4.27s",
    availability: 100,
    input: 3,
    output: 15,
    officialInput: 10,
    officialOutput: 50,
    cached: 0.075,
    featured: true,
    description: "适合长链路智能体、复杂代码改造、文档分析与严谨写作。",
    tags: ["深度推理", "代码工程", "长上下文"],
  },
  {
    name: "Claude",
    full: "Claude Opus 5",
    id: "claude-opus-5",
    provider: "Anthropic",
    category: "REASONING",
    context: "1M",
    latency: "718ms",
    availability: 100,
    input: 1.5,
    output: 7.5,
    officialInput: 5,
    officialOutput: 25,
    cached: 0.15,
    description: "面向高难度研究、软件架构和多阶段任务规划的旗舰模型。",
    tags: ["复杂规划", "研究分析", "代码架构"],
  },
  {
    name: "Claude",
    full: "Claude Opus 4.8",
    id: "claude-opus-4-8",
    provider: "Anthropic",
    category: "REASONING",
    context: "1M",
    latency: "1.1s",
    availability: 99.9,
    input: 1.5,
    output: 7.5,
    officialInput: 5,
    officialOutput: 25,
    cached: 0.15,
    description: "高性价比旗舰推理模型，兼顾长程任务规划与稳定输出质量。",
    tags: ["深度推理", "长程任务", "稳定输出"],
  },
  {
    name: "Claude",
    full: "Claude Sonnet 5",
    id: "claude-sonnet-5",
    provider: "Anthropic",
    category: "CODE",
    context: "1M",
    latency: "680ms",
    availability: 99.89,
    input: 0.6,
    output: 3,
    officialInput: 2,
    officialOutput: 10,
    cached: 0.06,
    description: "速度与成本均衡的主力模型，适合高频智能体、代码补全与内容生产。",
    tags: ["高性价比", "代码补全", "智能体"],
  },
  {
    name: "DeepSeek",
    full: "DeepSeek V4 Pro",
    id: "deepseek-v4-pro",
    provider: "DeepSeek",
    category: "REASONING",
    context: "1M",
    latency: "112ms",
    availability: 99.87,
    input: 0.198,
    output: 0.594,
    officialInput: 0.66,
    officialOutput: 1.98,
    cached: 0.00165,
    featured: true,
    description: "强化复杂推理、数学分析与代码规划，适合高要求生产任务。",
    tags: ["深度思考", "数学推导", "代码规划"],
  },
  {
    name: "DeepSeek",
    full: "DeepSeek Flash",
    id: "deepseek-flash",
    provider: "DeepSeek",
    category: "CODE",
    context: "1M",
    latency: "9.58s",
    availability: 100,
    input: 0.045,
    output: 0.18,
    officialInput: 0.15,
    officialOutput: 0.6,
    cached: 0.0009,
    description: "低延迟高吞吐版本，适合客服、内容处理与高并发自动化流程。",
    tags: ["极速吞吐", "成本友好", "高并发"],
  },
  {
    name: "Qwen",
    full: "Qwen3.8-27B",
    id: "Qwen3.8-27B",
    provider: "阿里巴巴",
    category: "CHAT",
    context: "1M",
    latency: "96ms",
    availability: 99.86,
    input: 0.024,
    output: 0.105,
    officialInput: 0.08,
    officialOutput: 0.35,
    cached: 0.015,
    description: "面向中文知识、企业问答、编程与多语言内容生产的旗舰模型。",
    tags: ["中文理解", "企业知识", "多语言"],
  },
  {
    name: "Zhipu",
    full: "GLM-5.3",
    id: "glm-5.3",
    provider: "智谱",
    category: "CHAT",
    context: "1M",
    latency: "117.7s",
    availability: 100,
    input: 0.42,
    output: 1.32,
    officialInput: 1.4,
    officialOutput: 4.4,
    cached: 0.063,
    description: "智谱新一代旗舰模型，长文本处理、工具调用与 Agent 自治能力深度优化。",
    tags: ["工具调用", "Agent", "长文本"],
  },
  {
    name: "Moonshot",
    full: "Kimi K3",
    id: "kimi-k3",
    provider: "Moonshot",
    category: "CHAT",
    context: "1M",
    latency: "128ms",
    availability: 99.82,
    input: 0.9,
    output: 4.5,
    officialInput: 3,
    officialOutput: 15,
    cached: 0.1125,
    description: "擅长超长文档、联网研究与复杂任务拆解，适合知识密集型场景。",
    tags: ["超长上下文", "研究分析", "任务规划"],
  },
  {
    name: "Grok",
    full: "Grok-4.6",
    id: "grok-4.6",
    provider: "xAI",
    category: "REASONING",
    context: "1M",
    latency: "943ms",
    availability: 100,
    input: 0.6,
    output: 1.8,
    officialInput: 2,
    officialOutput: 6,
    cached: 0.15,
    description: "xAI 前沿智能模型，兼具实时知识与科学级数理推演能力。",
    tags: ["实时信息", "数理推演", "超大算力"],
  },
];

function discountLabel(input: number, officialInput: number): string | undefined {
  if (!officialInput || input >= officialInput) return undefined;
  const zhe = Math.round((input / officialInput) * 10 * 10) / 10;
  return `${zhe}折优惠`;
}

export const MODELS: ModelInfo[] = MODEL_SEEDS.map((seed) => ({
  name: seed.name,
  full: seed.full,
  id: seed.id,
  provider: seed.provider,
  category: seed.category,
  latency: seed.latency,
  price: `${perM(seed.input)} / 1M`,
  input: perM(seed.input),
  output: perM(seed.output),
  context: seed.context,
  status: "Operational",
  featured: seed.featured,
  officialInput1K: perK(seed.officialInput),
  officialOutput1K: perK(seed.officialOutput),
  foytonInput1K: perK(seed.input),
  foytonOutput1K: perK(seed.output),
  officialInput1M: perM(seed.officialInput),
  officialOutput1M: perM(seed.officialOutput),
  foytonInput1M: perM(seed.input),
  foytonOutput1M: perM(seed.output),
  discount: discountLabel(seed.input, seed.officialInput),
  cached1K: seed.cached === undefined ? undefined : perK(seed.cached),
  cached1M: seed.cached === undefined ? undefined : perM(seed.cached),
  availability: seed.availability,
  description: seed.description,
  tags: seed.tags,
}));
