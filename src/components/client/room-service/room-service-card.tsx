"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  Clock3,
  ConciergeBell,
  Info,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRequestRoomService } from "@/hooks/client/use-request-room-service";
import { RoomServiceOrder } from "generated/prisma/client";
import { toast } from "sonner";
import { getRoomServiceCalendarFloorDate } from "@/lib/room-service-date";

const timeSlots = [
  "12:00 PM",
  "13:00 PM",
  "14:00 PM",
  "15:00 PM",
  "16:00 PM",
  "17:00 PM",
  "18:00 PM",
  "19:00 PM",
  "20:00 PM",
  "21:00 PM",
];

type Props = {
  datas?: RoomServiceOrder | null;
  room: string;
  roomQR: string;
};

const RoomServiceCard = ({ room, roomQR }: Props) => {
  const mutation = useRequestRoomService();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const requestRoomService = async () => {
    if (!date || !fromTime || !toTime || !room || !roomQR) {
      toast.error(
        "Please fill in all required fields for your room service request or ensure you are in a valid room with a QR code.",
      );
      return;
    }

    mutation.mutate({
      date: format(date, "yyyy-MM-dd"),
      startTime: fromTime,
      endTime: toTime,
      notes: specialRequest,
      room: room,
      roomQR: roomQR,
    });
  };

  return (
    <div className="space-y-4 mt-2">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ConciergeBell className="size-6" />
          <h1 className="text-3xl font-bold">Room Service Request</h1>
        </div>
        <p className="text-muted-foreground">
          Schedule a room-service at your preferred date and time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="size-4" />
            Service Information
          </CardTitle>
          <CardDescription>
            Important information regarding room service.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock3 className="size-4 text-muted-foreground" />
            <span>
              Room service available daily from <strong>12:00 PM</strong> to{" "}
              <strong>09:00 PM</strong>.
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            Same-day requests are supported depending on staff availability.
          </div>

          <div className="text-sm text-muted-foreground">
            Please submit requests at least 30 minutes before your preferred
            service time.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Schedule</CardTitle>
          <CardDescription>
            Select your preferred service date and time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium mb-1">Service Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{
                    before: getRoomServiceCalendarFloorDate(),
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium mb-2">From Time</label>
              <Select value={fromTime} onValueChange={setFromTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>

                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium mb-2">To Time</label>
              <Select value={toTime} onValueChange={setToTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Special Requests</CardTitle>
          <CardDescription>Additional notes for hotel staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="Example: Please bring extra towels, refill drinking water, or clean the toilet area only."
            className="min-h-32 resize-none"
          />
        </CardContent>
      </Card>
      <Button
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
        onClick={requestRoomService}
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          "Submit Roomservice Request"
        )}
      </Button>
    </div>
  );
};

export default RoomServiceCard;
