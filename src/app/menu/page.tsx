import React from "react";

const MenuItem = async ({
  searchParams,
}: {
  searchParams: Promise<{ room: string; roomQR: string }>;
}) => {
  //http://localhost:3000/menu?room=101&roomQR=RQ-RN-101
  const params = await searchParams;
  console.log("Received search params:", params);

  return <div>MenuItem Preview</div>;
};

export default MenuItem;
