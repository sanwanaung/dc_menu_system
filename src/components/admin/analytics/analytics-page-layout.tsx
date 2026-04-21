import type { ReactNode } from "react";

import type { AnalyticsRange } from "@/components/admin/analytics/analytics-range";
import { AnalyticsHeader } from "@/components/admin/analytics/analytics-header";
import type { AnalyticsNavItem } from "@/components/admin/analytics/analytics-nav";

export function AnalyticsPageLayout({
  title,
  description,
  range,
  navItems,
  children,
}: {
  title: string;
  description?: string;
  range: AnalyticsRange;
  navItems: AnalyticsNavItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <AnalyticsHeader
        title={title}
        description={description}
        range={range}
        navItems={navItems}
      />
      {children}
    </div>
  );
}

