import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BedDouble,
  ClipboardList,
  LayoutDashboard,
  Layers,
  SlidersHorizontal,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Rooms", href: "/admin/rooms", icon: BedDouble },
  {
    label: "Room Service Orders",
    href: "/admin/room-services",
    icon: ClipboardList,
  },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Menu Categories", href: "/admin/menu-categories", icon: Layers },
  { label: "Menu Items", href: "/admin/menu-items", icon: UtensilsCrossed },
  {
    label: "Variants & Addons",
    href: "/admin/variants-addons",
    icon: SlidersHorizontal,
  },
  { label: "Ratings & Reviews", href: "/admin/ratings", icon: Star },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function getAdminTitle(pathname: string) {
  const found = adminNav.find(
    (i) => pathname === i.href || pathname.startsWith(`${i.href}/`),
  );
  return found?.label ?? "Admin";
}
