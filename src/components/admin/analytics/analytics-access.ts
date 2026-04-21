import { allowedUserRole } from "@/lib";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type AnalyticsAccess =
  | { allowed: true; session: unknown }
  | { allowed: false; reason: "unauthenticated" | "forbidden" };

export async function getAnalyticsAccess(): Promise<AnalyticsAccess> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { allowed: false, reason: "unauthenticated" };

  const role = (session as { user?: { role?: string | null } }).user?.role;
  const allowed =
    role === allowedUserRole.ADMIN || role === allowedUserRole.SUBADMIN;

  if (!allowed) return { allowed: false, reason: "forbidden" };
  return { allowed: true, session };
}

