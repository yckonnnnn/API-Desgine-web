import { createFileRoute } from "@tanstack/react-router";
import { DocsArticle } from "@/components/docs/docs-article";

export const Route = createFileRoute("/docs/api/anthropic")({
  head: () => ({ meta: [{ title: "Anthropic Messages API · FYT API 文档" }] }),
  component: () => <DocsArticle pageId="anthropic" />,
});
