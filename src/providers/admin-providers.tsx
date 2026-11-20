"use client";

import { CancellRsForm } from "@/components/admin/room-service/forms/cancel-rs-form";
import { ChageUserRoleForm } from "@/components/admin/user/forms/change-user-role-form";
import { DeleteAddonForm } from "@/components/admin/addon/forms/delete-addon-form";
import { DeleteAddonCategoryForm } from "@/components/admin/addon-category/forms/delete-addoncategory-form";
import { DeleteMenuCategoryForm } from "@/components/admin/menu-category/forms/delete-menucategory-form";
import { DeleteRoomForm } from "@/components/admin/room/forms/delete-room-form";
import { DeleteRsForm } from "@/components/admin/room-service/forms/delete-rs-form";
import DeleteVariantOptionForm from "@/components/admin/variant-option/forms/delete-variant-option-form";
import { EditRoomForm } from "@/components/admin/room/forms/edit-room-form";
import { NewAddonCategoryForm } from "@/components/admin/addon-category/forms/new-addon-category-form";
import NewAddonForm from "@/components/admin/addon/forms/new-addon-form";
import NewMenuItemForm from "@/components/admin/menu-item/forms/new-menu-item-form";
import { NewMenuCategoryForm } from "@/components/admin/menu-category/forms/new-menucategory-form";
import { NewRoomForm } from "@/components/admin/room/forms/new-room-form";
import VariantOptionForm from "@/components/admin/variant-option/forms/variant-option-form";
import { ViewRsForm } from "@/components/admin/room-service/forms/view-rs-note-form";
import { ViewUserDeailForm } from "@/components/admin/user/forms/view-user-detail-form";

const AdminProviders = () => {
  return (
    <>
      <NewRoomForm />
      <EditRoomForm />
      <DeleteRoomForm />
      <CancellRsForm />
      <DeleteRsForm />
      <ViewRsForm />
      <ViewUserDeailForm />
      <ChageUserRoleForm />
      <NewMenuCategoryForm />
      <DeleteMenuCategoryForm />
      <NewAddonCategoryForm />
      <NewAddonForm />
      <DeleteAddonCategoryForm />
      <DeleteAddonForm />
      <VariantOptionForm />
      <DeleteVariantOptionForm />
      <NewMenuItemForm />
    </>
  );
};

export default AdminProviders;
