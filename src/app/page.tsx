"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { createRoomService } from "@/actions/room-service";

export default function Home() {
  const router = useRouter();
  const { data, isPending, error } = authClient.useSession();
  const [date, setDate] = useState<Date>();
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [option, setOption] = useState("");

  if (error) {
    return <div>Something went wrong! {error.message}</div>;
  }
  if (isPending) return <div>Loading....</div>;

  const handleBlaBla = async () => {
    console.log(name);
    console.log(date);
    console.log(startTime);
    console.log(endTime);
    if (!name || !date || !startTime || !endTime)
      return console.log("uncomplete");
    const rs = await createRoomService(name, date, startTime, endTime, option);
    console.log("rs: ", rs);
  };

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col w-100 gap-4">
        <Button
          variant="default"
          size="lg"
          className="cursor-pointer"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/auth/signin");
                },
              },
            });
          }}
        >
          Signout
        </Button>
        <Button
          variant="default"
          size="lg"
          className="cursor-pointer"
          onClick={async () => {
            router.push("/admin/dashboard");
          }}
        >
          Dashboard
        </Button>
        <div className="mt-2">
          <Input
            placeholder="Room No"
            className="mb-2"
            value={name ?? ""}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 mb-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(day) =>
                  day < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
          <div className="mt-2">
            <Input
              type="time"
              id="time-picker-optional"
              onChange={(e) => setStartTime(e.target.value)}
              step="1"
              defaultValue="10:30:00"
              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          <div className="mt-2">
            <Input
              type="time"
              onChange={(e) => setEndTime(e.target.value)}
              id="time-picker-optional"
              step="2"
              defaultValue="02:30:00"
              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
          <Textarea
            placeholder="enter your want!"
            className="mt-3"
            onChange={(e) => setOption(e.target.value)}
          />
          <Button className="mt-3" onClick={handleBlaBla}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
