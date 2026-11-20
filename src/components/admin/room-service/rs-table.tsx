"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime, statusVariant, toStatusLabel } from "@/utils";
//@ts-ignore
import { format } from "date-fns";
import { Tag } from "../shared/tag";
import Actions from "./actions";
import { RoomServiceDTO } from "@/features/room-service/types";

type RoomServiceWithRoom = RoomServiceDTO & {
  room: {
    name: string;
  };
};

type Props = {
  rs: RoomServiceWithRoom[];
};

const RoomServiceDataTable = ({ rs }: { rs: Props }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Room No</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rs.rs.map((t) => {
          const startTime = formatTime(t.startTime, t.date);
          const endTime = formatTime(t.endTime, t.date);
          return (
            <TableRow key={t.id}>
              <TableCell>{t.room?.name}</TableCell>
              <TableCell>{format(new Date(t.date), "dd/MM/yyy")}</TableCell>
              <TableCell>{startTime}</TableCell>
              <TableCell>{endTime}</TableCell>
              <TableCell>
                <Tag variant={statusVariant(t.status)}>
                  {toStatusLabel(t.status)}
                </Tag>
              </TableCell>
              <TableCell>
                <Actions t={t} />
              </TableCell>
            </TableRow>
          );
        })}
        {rs.rs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-10 text-center text-sm text-muted-foreground"
            >
              No room service orders found.
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  );
};

export default RoomServiceDataTable;
