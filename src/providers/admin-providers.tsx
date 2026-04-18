"use client";

import { CancellRsForm } from "@/form-sheets/cancel-rs-form";
import { ChageUserRoleForm } from "@/form-sheets/change-user-role-form";
import { DeleteAddonForm } from "@/form-sheets/delete-addon-form";
import { DeleteAddonCategoryForm } from "@/form-sheets/delete-addoncategory-form";
import { DeleteMenuCategoryForm } from "@/form-sheets/delete-menucategory-form";
import { DeleteRoomForm } from "@/form-sheets/delete-room-form";
import { DeleteRsForm } from "@/form-sheets/delete-rs-form";
import DeleteVariantOptionForm from "@/form-sheets/delete-variant-option-form";
import { EditRoomForm } from "@/form-sheets/edit-room-form";
import { NewAddonCategoryForm } from "@/form-sheets/new-addon-category-form";
import NewAddonForm from "@/form-sheets/new-addon-form";
import { NewMenuCategoryForm } from "@/form-sheets/new-menucategory-form";
import { NewRoomForm } from "@/form-sheets/new-room-form";
import VariantOptionForm from "@/form-sheets/variant-option-form";
import { ViewRsForm } from "@/form-sheets/view-rs-note-form";
import { ViewUserDeailForm } from "@/form-sheets/view-user-detail-form";

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
    </>
  );
};

export default AdminProviders;
