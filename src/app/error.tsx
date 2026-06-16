"use client";

import { AlertCircle, RefreshCcw, HomeIcon } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 text-destructive w-14 items-center justify-center rounded-full bg-muted">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="text-xl font-semibold">Session Verification Failed</h1>

        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={unstable_retry}
            className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <HomeIcon className="h-4 w-4" />
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
