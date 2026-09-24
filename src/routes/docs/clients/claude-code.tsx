import { createFileRoute } from "@tanstack/react-router";
import { DocsArticle } from "@/components/docs/docs-article";

export const Route = createFileRoute("/docs/clients/claude-code")({
  head: () => ({ meta: [{ title: "Claude Code 接入 · FYT API 文档" }] }),
  component: () => <DocsArticle pageId="claude-code" />,
});
