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
  provider: string;
  category: Exclude<ModelCategory, "ALL">;
  latency: string;
  price: string;
  input: string;
  output: string;
  context: string;
  status: string;
  featured?: boolean;
};

export const MODEL_FILTERS: ModelCategory[] = [
  "ALL",
  "CHAT",
  "REASONING",
  "CODE",
  "VISION",
  "IMAGE",
  "AUDIO",
];

export const MODELS: ModelInfo[] = [
  {
    name: "GPT",
    full: "GPT-5",
    provider: "OpenAI",
    category: "CHAT",
    latency: "128 ms",
    price: "$2.50 / 1M",
    input: "$1.25",
    output: "$10.00",
    context: "1M",
    status: "Operational",
    featured: true,
  },
  {
    name: "Claude",
    full: "Claude 4",
    provider: "Anthropic",
    category: "REASONING",
    latency: "142 ms",
    price: "$3.00 / 1M",
    input: "$3.00",
    output: "$15.00",
    context: "1M",
    status: "Operational",
  },
  {
    name: "Gemini",
    full: "Gemini 2.5",
    provider: "Google",
    category: "VISION",
    latency: "156 ms",
    price: "$1.25 / 1M",
    input: "$0.30",
    output: "$2.50",
    context: "2M",
    status: "Operational",
  },
  {
    name: "DeepSeek",
    full: "DeepSeek V3",
    provider: "DeepSeek",
    category: "CODE",
    latency: "118 ms",
    price: "$0.27 / 1M",
    input: "$0.27",
    output: "$1.10",
    context: "128K",
    status: "Operational",
  },
  {
    name: "Grok",
    full: "Grok 3",
    provider: "xAI",
    category: "REASONING",
    latency: "121 ms",
    price: "$2.00 / 1M",
    input: "$2.00",
    output: "$10.00",
    context: "1M",
    status: "Operational",
    featured: true,
  },
  {
    name: "Qwen",
    full: "Qwen 3",
    provider: "Alibaba",
    category: "CHAT",
    latency: "134 ms",
    price: "$0.40 / 1M",
    input: "$0.40",
    output: "$1.60",
    context: "1M",
    status: "Operational",
  },
  {
    name: "Kimi",
    full: "Kimi K2",
    provider: "Moonshot",
    category: "CHAT",
    latency: "148 ms",
    price: "$0.60 / 1M",
    input: "$0.60",
    output: "$2.50",
    context: "2M",
    status: "Operational",
  },
  {
    name: "Flux",
    full: "Flux 1.1",
    provider: "Black Forest",
    category: "IMAGE",
    latency: "2.4 s",
    price: "$0.04 / img",
    input: "—",
    output: "$0.04",
    context: "—",
    status: "Operational",
  },
  {
    name: "Whisper",
    full: "Whisper Large",
    provider: "OpenAI",
    category: "AUDIO",
    latency: "890 ms",
    price: "$0.006 / min",
    input: "$0.006",
    output: "—",
    context: "25 min",
    status: "Operational",
  },
];

export const ORBIT_NODES = [
  { name: "OpenAI", angle: 8 },
  { name: "Anthropic", angle: 58 },
  { name: "Google", angle: 110 },
  { name: "DeepSeek", angle: 162 },
  { name: "xAI", angle: 214 },
  { name: "Qwen", angle: 266 },
  { name: "Kimi", angle: 318 },
] as const;
