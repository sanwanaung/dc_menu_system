import { SCAN_SESSION_TOKEN } from "@/lib";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const room = searchParams.get("room");
  const roomQR = searchParams.get("roomQR");
  const next = searchParams.get("next") ?? "/";

  if (!room || !roomQR) {
    return NextResponse.json(
      { error: "Missing room or roomQR." },
      { status: 400 },
    );
  }

  const isExistingRoom = await prisma.room.findFirst({
    where: {
      roomQR,
      name: room,
    },
  });

  if (!isExistingRoom)
    return NextResponse.json(
      { error: "Invalid room / QR combination." },
      { status: 400 },
    );

  const token = randomBytes(32).toString("hex");
  const expiresIn = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.roomSessionToken.deleteMany({
    where: {
      roomId: isExistingRoom.id,
    },
  });

  await prisma.roomSessionToken.create({
    data: {
      roomId: isExistingRoom.id,
      sessionToken: token,
      expiresIn,
    },
  });

  const redirectPath = next.startsWith("/") ? next : "/";

  const response = NextResponse.redirect(new URL(redirectPath, origin));
  response.cookies.set({
    name: SCAN_SESSION_TOKEN,
    value: token,
    httpOnly: true,
    path: "/",
  });

  return response;
}
