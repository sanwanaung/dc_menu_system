import { verifyScanSessionToken } from "@/actions/client";
import { SCAN_SESSION_TOKEN } from "@/lib";
import { cookies } from "next/headers";
import { ReactNode } from "react";

const ClientShell = async ({
  children,
  roomQR,
}: {
  children: ReactNode;
  roomQR: string;
}) => {
  const token = (await cookies()).get(SCAN_SESSION_TOKEN);

  if (!token) {
    throw new Error(
      "Your ordering session could not be found. Please scan the QR code again.",
    );
  }

  const validToken = await verifyScanSessionToken({
    token: token.value,
    roomQR,
  });

  if (validToken.error) {
    throw new Error(validToken.error || "Something went wrong!");
  }

  return <>{children}</>;
};

export default ClientShell;
