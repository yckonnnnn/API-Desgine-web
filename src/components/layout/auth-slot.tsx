import { Link } from "@tanstack/react-router";
import { SignedIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function AuthSlot({ language = "en" }: { language?: "zh" | "en" }) {
  const { isPending } = useCurrentUserState();
  if (isPending) {
    return null;
  }
  return (
    <SignedIn>
      <Link to="/console" className="nav-ghost" data-cursor="hover">
        {language === "zh" ? "控制台" : "Console"}
      </Link>
      <div className="user-chip">
        <UserButton />
      </div>
    </SignedIn>
  );
}

export function StartCta({ className, language = "en" }: { className: string; language?: "zh" | "en" }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <span className={className}>{language === "zh" ? "开始使用" : "Start building"}</span>;
  }
  return (
    <Link to={user ? "/console" : "/login"} className={className} data-cursor="hover">
      {language === "zh" ? "开始使用" : "Start building"}
    </Link>
  );
}
