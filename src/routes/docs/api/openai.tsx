import { createFileRoute } from "@tanstack/react-router";
import { DocsArticle } from "@/components/docs/docs-article";

export const Route = createFileRoute("/docs/api/openai")({
  head: () => ({ meta: [{ title: "OpenAI 兼容 API · FYT API 文档" }] }),
  component: () => <DocsArticle pageId="openai" />,
});
