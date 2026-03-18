import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, subAdmin, user } from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        subAdmin,
        user,
      },
    }),
  ],
});

export const { signIn, signUp, useSession } = createAuthClient();
