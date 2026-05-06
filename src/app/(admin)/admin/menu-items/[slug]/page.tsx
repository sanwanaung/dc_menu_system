import React from "react";

const MenuItemDetial = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ variantId?: string }>;
}) => {
  const menuItemId = await params;
  const variantId = await searchParams;

  return (
    <div>
      <h1>Menu Item Detail</h1>
      <p>Menu Item ID: {menuItemId.slug}</p>
      <p>Variant ID: {variantId?.variantId}</p>
    </div>
  );
};

export default MenuItemDetial;
