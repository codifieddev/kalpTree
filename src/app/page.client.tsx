"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useState } from "react";

export default function RootClientPage() {
  const [tab, setTab] = useState("normal");
  const handleSwitchTab = (tab: string) => setTab(tab);

  return (
    <div>
      Main Website. Go to /admin
    </div>
    // <SidebarProvider className="border-0">
    //   <AppSidebar handleSwitchTab={handleSwitchTab} />
    //   <main className="w-full">
    //     <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
    //       <SidebarTrigger className="-ml-1" />
    //       <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
    //       <Breadcrumb>
    //         <BreadcrumbList>
    //           <BreadcrumbItem className="hidden md:block">
    //             <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
    //           </BreadcrumbItem>
    //           <BreadcrumbSeparator className="hidden md:block" />
    //           <BreadcrumbItem>
    //             <BreadcrumbPage>Data Fetching</BreadcrumbPage>
    //           </BreadcrumbItem>
    //         </BreadcrumbList>
    //       </Breadcrumb>
    //     </header>
    //     {tab === "normal" && (
    //       <div className="flex flex-1 flex-col gap-4 p-4">
    //         <div className="grid auto-rows-min gap-4 md:grid-cols-3">
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //         </div>
    //         <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    //       </div>
    //     )}
    //     {tab === "history" && (
    //       <div className="flex flex-1 flex-col gap-4 p-4 ">
    //         <div className="grid auto-rows-min gap-4 md:grid-cols-3"> History
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //         </div>
    //         <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    //       </div>
    //     )}
    //     {tab === "settings" && (
    //       <div className="flex flex-1 flex-col gap-4 p-4 ">
    //         <div className="grid auto-rows-min gap-4 md:grid-cols-3"> Settings
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //         </div>
    //         <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    //       </div>
    //     )}
    //     {tab === "project" && (
    //       <div className="flex flex-1 flex-col gap-4 p-4 ">
    //         <div className="grid auto-rows-min gap-4 md:grid-cols-3"> project
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //           <div className="bg-muted/50 aspect-video rounded-xl" />
    //         </div>
    //         <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    //       </div>
    //     )}
    //   </main>
    // </SidebarProvider>
  );
}
