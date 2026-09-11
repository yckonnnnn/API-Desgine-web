export type ModelInfo = {
  name: string;
  full: string;
  latency: string;
  price: string;
  context: string;
  status: string;
};

export const MODELS: ModelInfo[] = [
  {
    name: "GPT",
    full: "GPT-5",
    latency: "128 ms",
    price: "$2.50 / 1M",
    context: "1M",
    status: "Operational",
  },
  {
    name: "Claude",
    full: "Claude 4",
    latency: "142 ms",
    price: "$3.00 / 1M",
    context: "1M",
    status: "Operational",
  },
  {
    name: "Gemini",
    full: "Gemini 2.5",
    latency: "156 ms",
    price: "$1.25 / 1M",
    context: "2M",
    status: "Operational",
  },
  {
    name: "DeepSeek",
    full: "DeepSeek V3",
    latency: "118 ms",
    price: "$0.27 / 1M",
    context: "128K",
    status: "Operational",
  },
  {
    name: "Grok",
    full: "Grok 3",
    latency: "121 ms",
    price: "$2.00 / 1M",
    context: "1M",
    status: "Operational",
  },
  {
    name: "Qwen",
    full: "Qwen 3",
    latency: "134 ms",
    price: "$0.40 / 1M",
    context: "1M",
    status: "Operational",
  },
  {
    name: "Kimi",
    full: "Kimi K2",
    latency: "148 ms",
    price: "$0.60 / 1M",
    context: "2M",
    status: "Operational",
  },
];
