import React from "react";
import AdminShell from "@/components/admin/admin-shell";
import AdminProviders from "@/providers/admin-providers";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <AdminShell>
      <AdminProviders />
      {children}
    </AdminShell>
  );
};

export default AdminLayout;
