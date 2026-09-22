import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/auth-form";
import { readRedirect } from "@/lib/auth/redirect";

/** Same `?redirect=` contract as `/login` — see the note there. */
export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => readRedirect(search.redirect),
  component: Register,
});

function Register() {
  const { redirect } = Route.useSearch();
  return <AuthForm mode="register" redirect={redirect} />;
}
