import { createFileRoute } from "@tanstack/react-router";
import { DocsArticle } from "@/components/docs/docs-article";

export const Route = createFileRoute("/docs/models")({
  head: () => ({ meta: [{ title: "模型与计费 · FYT API 文档" }] }),
  component: () => <DocsArticle pageId="models" />,
});
