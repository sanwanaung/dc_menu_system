import WelcomeMsg from "@/components/auth/welcome-msg";
import type { ReactNode } from "react";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="relative min-h-dvh">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 via-background to-background" />
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-stretch px-4 py-8 lg:py-12">
          <WelcomeMsg />
          {children}
        </div>
      </div>
    </div>
  );
}
