import type { ReactNode } from "react";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { Grain } from "@/components/layout/grain";
import { Navbar } from "@/components/layout/navbar";
import { OrbCanvas } from "@/components/orb/orb-canvas";
import { PageVeil } from "@/components/layout/page-veil";
import { LanguageProvider } from "@/lib/language";

type Props = {
  children: ReactNode;
  orb?: boolean;
};

export function SiteChrome({ children, orb = true }: Props) {
  return (
    <LanguageProvider>
      <Grain />
      {orb ? <OrbCanvas /> : null}
      <Navbar />
      <CustomCursor />
      <PageVeil />
      {children}
    </LanguageProvider>
  );
}
