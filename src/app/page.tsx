"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();

  if (error) {
    return <div>Something went wrong! {error.message}</div>;
  }
  if (isPending) return <div>Loading....</div>;
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col w-100 gap-4">
        <div>
          <div>{data?.user.email}</div>
          <div>{data?.user.name}</div>
          <div>{data?.user.emailVerified}</div>
          <div>{data?.session.token}</div>
          <div>{data?.user.role}</div>
        </div>
        <Button
          variant="default"
          size="lg"
          className="cursor-pointer"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/auth/signin");
                },
              },
            });
          }}
        >
          Signout
        </Button>
        <Button
          variant="default"
          size="lg"
          className="cursor-pointer"
          onClick={async () => {
            router.push("/admin/dashboard");
          }}
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
}
