import type { TagVariant } from "@/components/admin/shared/tag";
import { UserRoles } from "@/utils";
import { User } from "generated/prisma/client";

export function toRoleValue(role: User["role"]): UserRoles {
  if (!role) return "user";
  return role as UserRoles;
}

export function roleLabel(role: User["role"]) {
  const v = toRoleValue(role);
  switch (v) {
    case "admin":
      return "admin";
    case "subadmin":
      return "subadmin";
    default: {
      return "user";
    }
  }
}

export function roleVariant(role: User["role"]): TagVariant {
  const v = toRoleValue(role);
  switch (v) {
    case "admin":
      return "danger";
    case "subadmin":
      return "warning";
    default: {
      return "neutral";
    }
  }
}

export function isVerified(user: User) {
  return !!user.emailVerified;
}

export function isBanned(user: User) {
  return !!user.banned;
}

export function roleValueToRole(role: UserRoles): UserRoles | null {
  if (!role) return null;
  return role;
}
