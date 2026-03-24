"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2, Printer } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type QrPreviewProps = {
  backHref?: string;
  imgUrl?: string | null;
  roomId: string;
  roomName?: string | null;
  roomQR?: string | null;
};

type BannerKind = "info" | "warn" | "error";
type BannerState = { kind: BannerKind; url: string | null; text: string };

function canPrint() {
  return typeof window !== "undefined" && typeof window.print === "function";
}

function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function StatusPill({
  status,
}: {
  status: "idle" | "loading" | "ready" | "error";
}) {
  const ui = (() => {
    switch (status) {
      case "ready":
        return {
          label: "Ready",
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
          icon: null,
        };
      case "loading":
        return {
          label: "Loading…",
          className: "border-sky-200 bg-sky-50 text-sky-700",
          icon: <Loader2 className="size-3.5 animate-spin" />,
        };
      case "error":
        return {
          label: "Image error",
          className: "border-red-200 bg-red-50 text-red-700",
          icon: null,
        };
      default:
        return {
          label: "No image",
          className: "border-slate-200 bg-white text-slate-600",
          icon: null,
        };
    }
  })();

  return (
    <div
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        ui.className,
      ].join(" ")}
    >
      {ui.icon}
      <span>{ui.label}</span>
    </div>
  );
}

export default function QrPreview({
  backHref = "/admin/rooms",
  imgUrl,
  roomId,
  roomName,
  roomQR,
}: QrPreviewProps) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [errorUrl, setErrorUrl] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerState | null>(null);

  const status = useMemo(() => {
    if (!imgUrl) return "idle";
    if (errorUrl === imgUrl) return "error";
    if (loadedUrl === imgUrl) return "ready";
    return "loading";
  }, [errorUrl, imgUrl, loadedUrl]);

  const visibleBanner = useMemo(() => {
    if (!banner) return null;
    const key = imgUrl ?? null;
    return banner.url === key ? banner : null;
  }, [banner, imgUrl]);

  const log = useCallback(
    (event: "requested" | "afterprint") => {
      try {
        console.info(
          event === "requested"
            ? "[RoomQR] Print requested"
            : "[RoomQR] Print dialog closed",
          {
            roomId,
            roomName: roomName || "",
            roomQR: roomQR || "",
            imgUrl: imgUrl || "",
            ts: new Date().toISOString(),
          },
        );
      } catch {}
    },
    [imgUrl, roomId, roomName, roomQR],
  );

  useEffect(() => {
    if (!imgUrl) return;

    let isActive = true;
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = imgUrl;

    img.onload = () => {
      if (!isActive) return;
      setLoadedUrl(imgUrl);
      setErrorUrl((prev) => (prev === imgUrl ? null : prev));
    };
    img.onerror = () => {
      if (!isActive) return;
      setErrorUrl(imgUrl);
      setBanner({
        kind: "error",
        url: imgUrl,
        text: "QR image failed to load. Please refresh and try again.",
      });
    };

    return () => {
      isActive = false;
    };
  }, [imgUrl]);

  useEffect(() => {
    const onAfterPrint = () => log("afterprint");
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, [log]);

  const onPrint = useCallback(() => {
    log("requested");

    if (!imgUrl) {
      setBanner({ kind: "warn", url: null, text: "No QR image available." });
      return;
    }

    if (!canPrint()) {
      try {
        openInNewTab(imgUrl);
      } catch {}
      setBanner({
        kind: "warn",
        url: imgUrl,
        text: "Your browser doesn't support printing here. The QR image was opened in a new tab — print from there.",
      });
      return;
    }

    if (status === "loading") {
      setBanner({
        kind: "info",
        url: imgUrl,
        text: "QR image is still loading. If the print preview is blank, wait a moment and click Print again.",
      });
    } else {
      setBanner(null);
    }

    try {
      window.print();
    } catch {
      try {
        openInNewTab(imgUrl);
      } catch {}
      setBanner({
        kind: "error",
        url: imgUrl,
        text: "Printing failed. The QR image was opened in a new tab.",
      });
    }
  }, [imgUrl, log, status]);

  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" className="bg-white">
          <Link href={backHref} className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>

        {imgUrl ? (
          <Button asChild variant="outline" className="bg-white">
            <a
              href={imgUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="size-4" />
              Open image
            </a>
          </Button>
        ) : (
          <Button variant="outline" className="bg-white" disabled>
            <ExternalLink className="size-4" />
            Open image
          </Button>
        )}

        <Button
          type="button"
          onClick={onPrint}
          disabled={!imgUrl || status === "error"}
          className="gap-2"
        >
          <Printer className="size-4" />
          Print QR
        </Button>

        <StatusPill status={status} />
      </div>

      {visibleBanner ? (
        <div
          className={[
            "max-w-[28rem] rounded-lg border px-3 py-2 text-xs shadow-sm ring-1 ring-black/5",
            visibleBanner.kind === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : visibleBanner.kind === "warn"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-white text-slate-700",
          ].join(" ")}
          aria-live="polite"
        >
          {visibleBanner.text}
        </div>
      ) : null}
    </div>
  );
}
