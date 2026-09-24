import { createFileRoute } from "@tanstack/react-router";
import { DocsHome } from "@/components/docs/docs-home";

export const Route = createFileRoute("/docs/")({ component: DocsHome });
