import { SCAN_SESSION_TOKEN } from "@/lib";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
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

  const token = jwt.sign(
    { room, roomQR } as JwtPayload,
    process.env.JWT_SECRET!,
    {
      expiresIn: "1m" as SignOptions["expiresIn"],
    },
  );

  const response = NextResponse.redirect(new URL(next, origin));
  response.cookies.delete(SCAN_SESSION_TOKEN);
  response.cookies.set({
    name: SCAN_SESSION_TOKEN,
    value: token,
    httpOnly: true,
    path: "/",
  });

  return response;
}
