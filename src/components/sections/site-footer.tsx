import { Link } from "@tanstack/react-router";
import { FoytonBrand } from "@/components/layout/foyton-brand";
import { useLanguage } from "@/lib/language";

export function SiteFooter() {
  const { language } = useLanguage();
  const zh = language === "zh";
  return (
    <footer className="site-foot">
      <Link to="/" className="wordmark" data-cursor="hover">
        <FoytonBrand />
      </Link>
      <p>{zh ? "面向生产系统的 AI 基础设施。" : "AI infrastructure for production systems."}</p>
      <nav>
        <Link to="/models" data-cursor="hover">
          {zh ? "模型" : "Models"}
        </Link>
        <Link to="/login" data-cursor="hover">
          {zh ? "控制台" : "Console"}
        </Link>
        <Link to="/contact" data-cursor="hover">
          {zh ? "联系我们" : "Contact"}
        </Link>
      </nav>
    </footer>
  );
}
