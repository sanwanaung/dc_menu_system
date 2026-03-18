import { demoRooms } from "../../../../../demo";
import { RoomsPageClient } from "@/components/admin/rooms/rooms-page-client";

export default function AdminRoomsPage() {
  return <RoomsPageClient initialRooms={demoRooms} />;
}
