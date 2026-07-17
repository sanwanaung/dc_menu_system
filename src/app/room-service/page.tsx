import ClientLayout from "@/components/client/client-layout";
import ClientShell from "@/components/client/client-shell";
import { SCAN_SESSION_TOKEN } from "@/lib";
import { cookies } from "next/headers";
import RoomServiceInfos from "@/components/client/room-service/infos";
import RoomServiceCard from "@/components/client/room-service/room-service-card";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RoomServicePage({
  searchParams,
}: {
  searchParams: Promise<{ room: string; roomQR: string }>;
}) {
  const params = await searchParams;

  if (!params.room || !params.roomQR) {
    return (
      <ClientLayout>
        <div className="rounded-lg border bg-background p-4 text-sm">
          <div className="font-medium">Invalid URL parameters</div>
          <div className="mt-1 text-muted-foreground">
            Expected <span className="font-mono">room</span> and{" "}
            <span className="font-mono">roomQR</span>.
          </div>
        </div>
      </ClientLayout>
    );
  }

  const sessionCookie = (await cookies()).get(SCAN_SESSION_TOKEN);

  if (!sessionCookie) {
    const bootstrapParams = new URLSearchParams({
      room: params.room,
      roomQR: params.roomQR,
      next: `/room-service?${new URLSearchParams({
        room: params.room,
        roomQR: params.roomQR,
      }).toString()}`,
    });

    redirect(`/api/scan-session?${bootstrapParams.toString()}`);
  }

  return (
    <ClientShell roomQR={params.roomQR}>
      <ClientLayout>
        <RoomServiceInfos room={params.room} roomQR={params.roomQR} />
        <RoomServiceCard room={params.room} roomQR={params.roomQR} />
      </ClientLayout>
    </ClientShell>
  );
}
