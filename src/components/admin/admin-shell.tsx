"use client";

import * as React from "react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "admin.sidebarCollapsed";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "1") setCollapsed(true);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="min-h-dvh bg-zinc-50 text-foreground dark:bg-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1000px_circle_at_0%_0%,rgba(24,24,27,0.06),transparent_45%),radial-gradient(900px_circle_at_100%_0%,rgba(24,24,27,0.06),transparent_45%)] dark:bg-[radial-gradient(1000px_circle_at_0%_0%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(900px_circle_at_100%_0%,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="mx-auto grid min-h-dvh max-w-[1600px] grid-cols-1 lg:grid-cols-[auto_1fr]">
        <aside
          className={cn(
            "hidden h-dvh border-r lg:sticky lg:top-0 lg:block",
            collapsed ? "w-[76px]" : "w-[268px]",
          )}
        >
          <AdminSidebar
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((v) => !v)}
          />
        </aside>

        <Drawer
          direction="left"
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          dismissible={true}
        >
          <DrawerContent className="h-dvh p-0">
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
            </DrawerHeader>
            <AdminSidebar
              collapsed={false}
              showCollapseToggle={false}
              onNavigate={() => setMobileOpen(false)}
              className="border-r-0"
            />
          </DrawerContent>
        </Drawer>

        <div className="flex min-w-0 flex-col">
          <AdminTopbar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AdminShell;
