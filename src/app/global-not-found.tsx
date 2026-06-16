import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body
        suppressHydrationWarning
        className="min-h-dvh overflow-hidden bg-background"
      >
        <main className="relative flex min-h-dvh items-center justify-center p-6">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="w-full max-w-xl">
            <div className="rounded-3xl border bg-background/70 p-10 text-center shadow-xl backdrop-blur-xl">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted/50">
                  <SearchX className="h-8 w-8" />
                </div>
              </div>

              <div className="mb-2 text-7xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent">
                404
              </div>

              <h1 className="text-3xl font-bold">Page Not Found</h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                The page you're looking for may have been removed, renamed, or
                is temporarily unavailable.
              </p>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-medium bg-primary text-primary-foreground transition-all hover:scale-[1.02]"
                >
                  <Home className="h-4 w-4" />
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
