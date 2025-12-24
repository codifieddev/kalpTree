import { ReactNode } from "react";
import { AppShellProvider } from "@/components/admin/AppShellProvider";
import { Inter } from "next/font/google";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth()
  return <AppShellProvider >{children}</AppShellProvider>;
}
