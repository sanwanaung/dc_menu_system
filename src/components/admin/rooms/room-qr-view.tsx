import QrPreview from "@/components/admin/rooms/qr-preview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

type RoomQrViewProps = {
  roomId: string;
  imgUrl?: string | null;
  name?: string | null;
  roomQR?: string | null;
  floor?: string | null;
  type?: string | null;
  backHref?: string;
  brandName?: string;
};

function PrintLogo({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-sm ring-1 ring-black/5">
        <svg
          viewBox="0 0 24 24"
          className="size-6 text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7.5c0-1.38 1.12-2.5 2.5-2.5h11C19.88 5 21 6.12 21 7.5v9c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 19 4 17.88 4 16.5v-9Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 10h8M8 14h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <div className="text-xs text-slate-500">Room QR • print-ready</div>
      </div>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-black/5">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}:
      </div>
      <div className="mt-0.5 truncate font-semibold text-slate-900">
        {value || "—"}
      </div>
    </div>
  );
}

export default function RoomQrView({
  roomId,
  imgUrl,
  name,
  roomQR,
  floor,
  type,
  backHref = "/admin/rooms",
  brandName = process.env.NEXT_PUBLIC_APP_NAME || "Diamond Crown",
}: RoomQrViewProps) {
  const title = name || "Room No.";
  const subtitle = [
    roomQR ? `RoomQR: ${roomQR}` : null,
    floor ? `Floor: Floor ${floor}` : null,
    type || null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white">
      <style>{`
        /* Hidden on screen; becomes the only visible element in print. */
        #print-area { display: none; }

        @media print {
          @page { margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          /* Print QR only */
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }

          #print-area {
            position: fixed;
            inset: 0;
            display: grid !important;
            place-items: center;
            padding: 12mm;
            background: #fff;
          }

          #print-card {
            width: min(92mm, 100%);
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 10mm;
          }

          #print-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8mm;
            margin-bottom: 6mm;
          }

          #print-brand {
            display: flex;
            align-items: center;
            gap: 3mm;
            min-width: 0;
          }

          #print-brand-name {
            font: 600 10.5pt ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            color: #000;
            line-height: 1.1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 56mm;
          }

          #print-room-meta {
            font: 400 8pt ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            color: rgba(0,0,0,0.7);
            margin-top: 1.5mm;
            max-width: 56mm;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          #print-logo {
            display: grid;
            place-items: center;
            width: 10mm;
            height: 10mm;
            border-radius: 3mm;
            background: linear-gradient(135deg, rgb(14 165 233), rgb(79 70 229));
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            border: 1px solid rgba(0,0,0,0.06);
          }

          #qr-img {
            display: block;
            width: 72mm;
            max-width: 100%;
            height: auto;
            margin: 0 auto;
            padding: 3mm;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
          }

          #print-caption {
            margin-top: 4mm;
            text-align: center;
            font: 500 8pt ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            color: rgba(0,0,0,0.75);
          }

          .no-print { display: none !important; }

        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-fuchsia-500/10"
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8">
        <div className="no-print mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PrintLogo label={brandName} />
          <div className="text-sm text-slate-600">Print room QR.</div>
        </div>

        <Card className="no-print overflow-hidden border border-slate-200 bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <CardHeader className="space-y-1 border-b bg-white/70">
            <CardTitle className="text-xl tracking-tight">{title}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-slate-700">Room ID:</span>
              <span className="font-mono text-[0.85em] text-slate-600">
                {roomId}
              </span>
              {subtitle ? (
                <span className="text-slate-500">{subtitle}</span>
              ) : null}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <QrPreview
                backHref={backHref}
                imgUrl={imgUrl}
                roomId={roomId}
                roomName={name}
                roomQR={roomQR}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <MetaField label="Room QR" value={roomQR} />
                <MetaField label="Type" value={type} />
                <MetaField label="Floor" value={`Floor ${floor}`} />
                <MetaField label="Brand" value={brandName} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-black/5">
                <div className="font-semibold text-slate-900">Print tips</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Use A4 paper, 100% scale, and portrait mode.</li>
                  <li>Keep a white margin around the QR.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-center justify-start gap-4">
              <Card className="w-full border border-slate-200 bg-white py-0 shadow-sm ring-1 ring-black/5">
                <CardHeader className="px-5 pb-0 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900 flex flex-col">
                      QR Preview
                    </div>
                    <div className="text-xs text-slate-500">
                      {roomQR || "—"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-4">
                  <div className="grid place-items-center">
                    {imgUrl ? (
                      <Image
                        width={1000}
                        height={1000}
                        src={imgUrl}
                        alt={`QR code for ${name || "room"}`}
                        className="h-auto w-[280px] rounded-xl border border-slate-200 bg-white p-2"
                        loading="eager"
                      />
                    ) : (
                      <div className="grid h-[280px] w-[280px] place-items-center rounded-xl border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500">
                        No QR image available.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* The only thing that will be visible in print */}
        <div id="print-area">
          {imgUrl ? (
            <div id="print-card">
              <div id="print-header">
                <div id="print-brand">
                  <div id="print-logo" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7.5c0-1.38 1.12-2.5 2.5-2.5h11C19.88 5 21 6.12 21 7.5v9c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 19 4 17.88 4 16.5v-9Z"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 10h8M8 14h8"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div id="print-brand-name">{brandName}</div>
                    <div id="print-room-meta">Room: {title}</div>
                  </div>
                </div>
              </div>

              <Image
                width={1000}
                height={1000}
                id="qr-img"
                src={imgUrl}
                alt={`QR code for ${name || "room"}`}
              />

              <div id="print-caption">{roomQR || roomId}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
