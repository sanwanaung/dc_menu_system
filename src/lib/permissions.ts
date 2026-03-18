import { createAccessControl } from "better-auth/plugins/access";

const statements = {
  project: ["create", "update", "delete"],
  user: ["ban"],
} as const;

export const ac = createAccessControl(statements);

export const user = ac.newRole({
  project: ["create"],
});

export const subAdmin = ac.newRole({
  project: ["update"],
});

export const admin = ac.newRole({
  project: ["create", "update", "delete"],
  user: ["ban"],
});
