import Claude from "@lobehub/icons/es/Claude";
import DeepSeek from "@lobehub/icons/es/DeepSeek";
import Gemini from "@lobehub/icons/es/Gemini";
import Grok from "@lobehub/icons/es/Grok";
import Kimi from "@lobehub/icons/es/Kimi";
import OpenAI from "@lobehub/icons/es/OpenAI";
import Qwen from "@lobehub/icons/es/Qwen";

export function ModelLogo({ name }: { name: string }) {
  const iconProps = { size: 44 };

  switch (name) {
    case "GPT":
      return <OpenAI.Avatar {...iconProps} />;
    case "Claude":
      return <Claude.Color {...iconProps} />;
    case "Gemini":
      return <Gemini.Color {...iconProps} />;
    case "DeepSeek":
      return <DeepSeek.Color {...iconProps} />;
    case "Grok":
      return <Grok.Avatar {...iconProps} />;
    case "Qwen":
      return <Qwen.Color {...iconProps} />;
    case "Kimi":
      return <Kimi.Color {...iconProps} />;
    default:
      return null;
  }
}
