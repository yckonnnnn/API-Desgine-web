import { createFileRoute } from "@tanstack/react-router";
import { DocsArticle } from "@/components/docs/docs-article";

export const Route = createFileRoute("/docs/clients/codex")({
  head: () => ({ meta: [{ title: "Codex CLI 接入 · FYT API 文档" }] }),
  component: () => <DocsArticle pageId="codex" />,
});
