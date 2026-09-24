import { Check, Copy } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";
import type { DocCodeSample } from "@/lib/docs-content";

/**
 * Docs code sample. Light glass rather than a dark terminal panel: the rest of
 * the marketing site has no dark surface except the console's balance card, and
 * a black block here would read as a different product.
 */
export function CodeBlock({
  sample,
  className,
}: {
  sample: DocCodeSample;
  className?: string;
}) {
  const { language } = useLanguage();
  const zh = language === "zh";
  const { copied, copy } = useCopy(1600);
  const isCopied = copied === sample.content;
  // "HTTP / http" and "TypeScript / typescript" read as a stutter, so the
  // language chip only shows when it adds information.
  const showLanguage = sample.label.toLowerCase() !== sample.language.toLowerCase();

  return (
    <figure className={cn("doc-code", className)}>
      <figcaption className="doc-code-head">
        <span className="doc-code-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="doc-code-label">{sample.label}</span>
        {showLanguage && <span className="doc-code-lang">{sample.language}</span>}
        <button
          type="button"
          className="doc-code-copy"
          onClick={() => void copy(sample.content)}
          aria-label={isCopied ? (zh ? "已复制" : "Copied") : zh ? "复制代码" : "Copy code"}
        >
          {isCopied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.8} />}
          <span>{isCopied ? (zh ? "已复制" : "Copied") : zh ? "复制" : "Copy"}</span>
        </button>
      </figcaption>
      <pre className="doc-code-body">
        <code>{sample.content}</code>
      </pre>
    </figure>
  );
}
