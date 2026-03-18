"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAdminTitle } from "@/components/admin/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AdminTopbar({
  onOpenMobileNav,
}: {
  onOpenMobileNav: () => void;
}) {
  const pathname = usePathname();
  const title = getAdminTitle(pathname);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex items-center gap-x-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onOpenMobileNav}
          aria-label="Open sidebar"
        >
          <Menu />
        </Button>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
        </div>
      </div>

      <div className="flex min-w-0 md:flex-1 items-center gap-3">
        <div className="relative ml-auto hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="pl-9"
            onChange={() => {
              // Intentionally not wired yet (dashboard-only scope).
            }}
          />
        </div>

        <div className="gap-2 sm:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full shadow cursor-pointer bg-muted ring-1 ring-border">
              <div className="rounded-full shadow cursor-pointer bg-muted ring-1 ring-border">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Admin Avatar"
                  />
                  <AvatarFallback>Ad</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 rounded-md">
              <DropdownMenuItem
                className="hover:rounded-sm cursor-pointer"
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
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
