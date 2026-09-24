import { createFileRoute } from "@tanstack/react-router";
import { DocsArticle } from "@/components/docs/docs-article";

export const Route = createFileRoute("/docs/quickstart")({
  head: () => ({ meta: [{ title: "快速开始 · FYT API 文档" }] }),
  component: () => <DocsArticle pageId="quickstart" />,
});
