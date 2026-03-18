import React from "react";
import AdminShell from "@/components/admin/admin-shell";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <AdminShell>{children}</AdminShell>;
};

export default AdminLayout;
