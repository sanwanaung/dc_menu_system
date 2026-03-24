"use client";

import { DeleteRoomForm } from "@/form-sheets/delete-room-form";
import { EditRoomForm } from "@/form-sheets/edit-room-form";
import { NewRoomForm } from "@/form-sheets/new-room-form";

const AdminProviders = () => {
  return (
    <>
      <NewRoomForm />
      <EditRoomForm />
      <DeleteRoomForm />
    </>
  );
};

export default AdminProviders;
