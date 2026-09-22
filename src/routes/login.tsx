import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/auth-form";
import { readRedirect } from "@/lib/auth/redirect";

/**
 * `?redirect=` is where to land after signing in. The marketing page sets it
 * when a signed-out visitor picks a credit pack, so the choice survives the
 * detour instead of dumping them on the console overview.
 */
export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => readRedirect(search.redirect),
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  return <AuthForm mode="login" redirect={redirect} />;
}
