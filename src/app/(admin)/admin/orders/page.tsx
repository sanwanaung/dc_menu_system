import { demoRoomServiceOrders, demoRooms } from "../../../../../demo";
import { RoomServicePageClient } from "@/components/admin/room-service/room-service-page-client";

export default function AdminOrdersPage() {
  return (
    <RoomServicePageClient initialOrders={demoRoomServiceOrders} rooms={demoRooms} />
  );
}
