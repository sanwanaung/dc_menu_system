"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { adminNav } from "@/components/admin/nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  className,
  showCollapseToggle = true,
}: {
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
  className?: string;
  showCollapseToggle?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn("flex h-full flex-col border-r bg-background", className)}
    >
      <div
        className={cn(
          "flex h-14 items-center gap-2 border-b px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed && "justify-center",
          )}
        >
          <div className="grid size-9 place-items-center rounded-xl bg-muted ring-1 ring-border">
            <span className="text-sm font-semibold">HQ</span>
          </div>
          {!collapsed ? (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Hotel QR</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          ) : null}
        </div>

        {showCollapseToggle ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(collapsed && "hidden lg:inline-flex")}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        ) : null}
      </div>

      <nav className={cn("flex-1 overflow-y-auto p-2", collapsed && "px-1")}>
        <ul className="flex flex-col gap-1">
          {adminNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm ring-1 ring-transparent transition-colors hover:bg-muted",
                    active && "bg-muted ring-border",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <Icon className="size-4" />
                  {!collapsed ? <span>{item.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed ? (
        <div className="border-t p-3">
          <div className="rounded-xl bg-muted/50 p-2 text-xs text-muted-foreground ring-1 ring-border">
            Developed by San Wan Aung
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminSidebar;
