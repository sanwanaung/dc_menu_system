import { getRoom } from "@/actions/room";
import RoomQrView from "@/components/admin/rooms/room-qr-view";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoomDTO } from "@/types/room";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RoomQrPage({
  roomId,
  backHref = "/admin/rooms",
}: {
  roomId: string;
  backHref?: string;
}) {
  const result = await getRoom({ id: roomId });

  if (result.error) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <Card className="border border-red-200 bg-red-50 text-red-800 ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Unable to load room</CardTitle>
            <CardDescription className="text-red-700">
              {result.error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="bg-white">
              <Link href={backHref}>Back to rooms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const room = result.data as RoomDTO | null | undefined;
  if (!room) notFound();

  return (
    <RoomQrView
      roomId={roomId}
      imgUrl={room.imgUrl}
      name={room.name}
      roomQR={room.roomQR}
      floor={room.floor}
      type={room.type}
      backHref={backHref}
    />
  );
}
