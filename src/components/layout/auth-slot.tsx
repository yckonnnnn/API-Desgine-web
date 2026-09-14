import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AuthSlot() {
  const { isPending } = useCurrentUserState();
  if (isPending) {
    return <span className="auth-skel" aria-hidden="true" />;
  }
  return (
    <>
      <SignedOut>
        <Link to="/login" className="nav-ghost" data-cursor="hover">
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <Link to="/console" className="nav-ghost" data-cursor="hover">
          Console
        </Link>
        <div className="user-chip">
          <UserButton />
        </div>
      </SignedIn>
    </>
  );
}

export function StartCta({ className }: { className: string }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <span className={className}>Start building</span>;
  }
  return (
    <Link to={user ? "/console" : "/login"} className={className} data-cursor="hover">
      Start building
    </Link>
  );
}
