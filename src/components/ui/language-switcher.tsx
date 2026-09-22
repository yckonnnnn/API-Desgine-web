import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Globe } from "lucide-react";
import { useLanguage, type Language } from "@/lib/language";

const OPTIONS: { value: Language; label: string; sub: string }[] = [
  { value: "zh", label: "中文", sub: "简体中文" },
  { value: "en", label: "English", sub: "English" },
];

/**
 * Globe-icon language switcher. Replaces the plain-text toggle in the navbar
 * and the segmented "中 / EN" control in the console sidebar with a single
 * icon button that opens a Radix dropdown listing the available locales.
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="language-dropdown-trigger"
          aria-label={language === "zh" ? "切换语言" : "Switch language"}
        >
          <Globe size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="language-dropdown-content"
          align="end"
          sideOffset={6}
          collisionPadding={16}
        >
          <DropdownMenu.RadioGroup
            value={language}
            onValueChange={(next) => setLanguage(next as Language)}
          >
            {OPTIONS.map((opt) => (
              <DropdownMenu.RadioItem
                key={opt.value}
                className="language-dropdown-item"
                value={opt.value}
              >
                <span className="language-dropdown-label">
                  <span className="language-dropdown-name">{opt.label}</span>
                  <span className="language-dropdown-sub">{opt.sub}</span>
                </span>
                <DropdownMenu.ItemIndicator>
                  <Check size={14} strokeWidth={2} aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
