"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { useState } from "react";

export default function RootClientPage() {
  const [tab, setTab] = useState("normal");
  const handleSwitchTab = (tab: string) => setTab(tab);

  return (
    <div>
      Main Website. Go to /admin
    </div>
  );
}
