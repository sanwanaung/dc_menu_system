"use client";

import { CancellRsForm } from "@/form-sheets/cancel-rs-form";
import { ChageUserRoleForm } from "@/form-sheets/change-user-role-form";
import { DeleteMenuCategoryForm } from "@/form-sheets/delete-menucategory-form";
import { DeleteRoomForm } from "@/form-sheets/delete-room-form";
import { DeleteRsForm } from "@/form-sheets/delete-rs-form";
import { EditRoomForm } from "@/form-sheets/edit-room-form";
import { NewMenuCategory } from "@/form-sheets/new-menucategory-form";
import { NewRoomForm } from "@/form-sheets/new-room-form";
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
      <NewMenuCategory />
      <DeleteMenuCategoryForm />
    </>
  );
};

export default AdminProviders;
