import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { useLanguage } from "@/lib/language";

/**
 * Bell-icon notification button. Opens a dropdown with the cooperation
 * announcement — the default notice every visitor sees. More entries can be
 * appended to `NOTICES` later as the product grows.
 */
export function NotificationBell() {
  const { language } = useLanguage();
  const zh = language === "zh";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="notification-bell-trigger"
          aria-label={zh ? "通知" : "Notifications"}
        >
          <Bell size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="notification-dropdown-content"
          align="end"
          sideOffset={6}
          collisionPadding={16}
        >
          <div className="notification-item">
            <span className="notification-icon" aria-hidden="true">📢</span>
            <div className="notification-body">
              <h4 className="notification-title">
                {zh ? "合作招商公告" : "Partnership Announcement"}
              </h4>
              <p className="notification-text">
                {zh
                  ? "欢迎算力供应商、模型服务商、渠道伙伴洽谈入驻合作。"
                  : "We welcome compute providers, model service providers and channel partners to discuss cooperation."}
              </p>
              <p className="notification-contact">
                {zh ? "合作咨询邮箱" : "Contact"}：
                <a href="mailto:support@fytapi.com" className="notification-link">
                  support@fytapi.com
                </a>
              </p>
              <p className="notification-contact">
                {zh ? "微信" : "WeChat"}：
                <span className="notification-link">YCKONNNNN</span>
              </p>
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
