import Claude from "@lobehub/icons/es/Claude";
import DeepSeek from "@lobehub/icons/es/DeepSeek";
import Gemini from "@lobehub/icons/es/Gemini";
import Grok from "@lobehub/icons/es/Grok";
import Kimi from "@lobehub/icons/es/Kimi";
import OpenAI from "@lobehub/icons/es/OpenAI";
import Qwen from "@lobehub/icons/es/Qwen";
import Zhipu from "@lobehub/icons/es/Zhipu";
import Alibaba from "@lobehub/icons/es/Alibaba";
import Google from "@lobehub/icons/es/Google";
import Moonshot from "@lobehub/icons/es/Moonshot";

export function ModelLogo({ name, size = 36 }: { name: string; size?: number }) {
  const iconProps = { size };

  switch (name) {
    case "OpenAI":
    case "GPT":
      return <OpenAI {...iconProps} />;
    case "Anthropic":
      return <Claude.Color {...iconProps} />;
    case "Claude":
      return <Claude.Color {...iconProps} />;
    case "Google":
      return <Google.Color {...iconProps} />;
    case "Gemini":
      return <Gemini.Color {...iconProps} />;
    case "DeepSeek":
      return <DeepSeek.Color {...iconProps} />;
    case "xAI":
    case "Grok":
      return <Grok.Avatar {...iconProps} />;
    case "阿里巴巴":
    case "Alibaba":
      return <Alibaba.Color {...iconProps} />;
    case "Qwen":
      return <Qwen.Color {...iconProps} />;
    case "智谱":
    case "Zhipu":
    case "GLM":
      return <Zhipu.Color {...iconProps} />;
    case "Moonshot":
      return <Moonshot.Avatar {...iconProps} />;
    case "Kimi":
      return <Kimi.Color {...iconProps} />;
    default:
      return <OpenAI.Avatar {...iconProps} />;
  }
}
