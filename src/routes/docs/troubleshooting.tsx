import { createFileRoute } from "@tanstack/react-router";
import { DocsArticle } from "@/components/docs/docs-article";

export const Route = createFileRoute("/docs/troubleshooting")({
  head: () => ({ meta: [{ title: "错误排查 · FYT API 文档" }] }),
  component: () => <DocsArticle pageId="troubleshooting" />,
});
