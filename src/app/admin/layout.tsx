import { ReactNode } from "react";
import { AppShellProvider } from "@/components/admin/AppShellProvider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShellProvider>
      {children}
    </AppShellProvider>
  );
}
