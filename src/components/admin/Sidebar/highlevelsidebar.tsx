import React from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Globe,
  Layers,
  Mail,
  Server,
  CreditCard,
  Package,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  UserCircle,
  Shield,
  User,
  Sparkles,
  LogOut,
  Bell,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Navigation structure matching the images
const navigationItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/admin",
  },
  {
    id: "businesses",
    label: "Businesses",
    icon: LayoutDashboard,
    href: "/admin/businesses",
    hasSubmenu: true,
    submenuItems: [
      { label: "Businesses list", href: "/admin/businesses" },
      { label: "Add New Business", href: "/admin/businesses/createnew" },
    ],
  },
  {
    id: "domains",
    label: "Domains",
    icon: Globe,
    href: "/admin/domains",
    hasSubmenu: true,
    submenuItems: [
      { label: "Domain portfolio", href: "/domains/portfolio" },
      { label: "Get a new domain", href: "/domains/new" },
      { label: "Transfers", href: "/domains/transfers" },
    ],
  },
  {
    id: "horizons",
    label: "Horizons",
    icon: Layers,
    href: "/horizons",
  },
  {
    id: "emails",
    label: "Emails",
    icon: Mail,
    href: "/emails",
  },
  {
    id: "vps",
    label: "VPS",
    icon: Server,
    href: "/vps",
  },
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    href: "/billing",
    hasSubmenu: true,
    submenuItems: [
      { label: "Subscriptions", href: "/billing/subscriptions" },
      { label: "Payment history", href: "/billing/history" },
      { label: "Payment methods", href: "/billing/methods" },
    ],
  },
  {
    id: "all-services",
    label: "All services",
    icon: Package,
    href: "/services",
    badge: "New",
    hasSubmenu: true,
    submenuItems: [
      { label: "Marketplace", href: "/services/marketplace" },
      { label: "AI tools", href: "/services/ai-tools" },
    ],
  },

  {
    id: "accountsharing",
    label: "Account Sharing",
    icon: UserCircle,
    href: "/admin/accountsharing",
    // hasSubmenu: true,
    // submenuItems: [
    //   { label: "Subscriptions", href: "/billing/subscriptions" },
    //   { label: "Payment history", href: "/billing/history" },
    //   { label: "Payment methods", href: "/billing/methods" },
    // ],
  },

  {
    id: "roles",
    label: "Roles and Permissions",
    icon: Shield,
    href: "/admin/rolesandpermission",
    // hasSubmenu: true,
    // submenuItems: [
    //   { label: "Subscriptions", href: "/billing/subscriptions" },
    //   { label: "Payment history", href: "/billing/history" },
    //   { label: "Payment methods", href: "/billing/methods" },
    // ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type SidebarProps = {
  user?: any;
  collapsed?: boolean;
  loggedinTenant?: any;
};

type HighLevelSidebarProps = SidebarProps & {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

export function HighLevelSidebar({
  showSidebar,
  setShowSidebar,
  user,
  collapsed = false,
  loggedinTenant = { name: "Your Company" },
}: HighLevelSidebarProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  const [hoverItemId, setHoverItemId] = React.useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sentenceCase = (s: string | undefined) => {
    if (!s) return "";
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
  };

  return (
    <div
      className={cn(
        "relative hidden md:flex h-screen",
        collapsed ? "w-[84px]" : "w-[320px] "
      )}
    >
      <div className="w-full">
        <div
          className={cn(
            "h-full border bg-[#f5f6f7] text-[#111]",
            "shadow-[0_10px_35px_rgba(0,0,0,0.08)]"
          )}
        >
          <div className="flex h-[93%] flex-col">
            {/* Header */}
            {/* <div className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div className={cn("px-4 pt-4 pb-0", collapsed && "px-3")}>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md">
                      <img
                        src="../kalptree-favicon.svg"
                        className="w-10 h-10"
                        alt="Logo"
                      />
                    </div>
                    {!collapsed && (
                      <div className="leading-tight">
                        <div className="text-sm font-semibold">
                          {loggedinTenant?.name}
                        </div>
                        <div className="text-[11px] text-black/45">
                          {sentenceCase(user?.role)} panel
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div> */}

            {/* Navigation */}
            <div
              className={cn(
                "mt-3 flex-1 px-2 pb-3 overflow-y-auto",
                collapsed && "px-2"
              )}
            >
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isOpen = !!openItems[item.id];
                  const isActive = pathname === item.href;

                  // Collapsed view with hover
                  if (collapsed) {
                    return (
                      <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() =>
                          item.hasSubmenu && setHoverItemId(item.id)
                        }
                        onMouseLeave={() => setHoverItemId(null)}
                      >
                        <Link href={item.href}>
                          <button
                            type="button"
                            className={cn(
                              "w-full flex items-center justify-center relative",
                              "h-11 rounded-md transition",
                              isActive
                                ? "bg-white text-black shadow-sm"
                                : "bg-white/70 hover:bg-white",
                              "border border-black/5"
                            )}
                          >
                            <Icon className="h-5 w-5 text-black/70" />
                            {item.badge && (
                              <span className="absolute -top-1 -right-1 text-[9px] rounded-full bg-purple-100 text-purple-700 px-1.5 py-0.5 font-semibold border border-purple-200">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        </Link>

                        <AnimatePresence>
                          {hoverItemId === item.id && item.hasSubmenu && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{
                                opacity: 1,
                                x: 0,
                                transition: { duration: 0.18, ease },
                              }}
                              exit={{
                                opacity: 0,
                                x: 10,
                                transition: { duration: 0.14, ease },
                              }}
                              className="absolute left-[92px] top-0 z-50 w-[240px]"
                            >
                              <div className="rounded-md bg-white border shadow-[0_25px_60px_rgba(0,0,0,0.18)] p-3">
                                <div className="flex items-center justify-between px-2 pb-2">
                                  <div className="text-sm font-semibold text-black/80">
                                    {item.label}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  {item.submenuItems?.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="block"
                                    >
                                      <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-black/70 hover:bg-[#f6f7f8]">
                                        <span className="truncate flex-1">
                                          {subItem.label}
                                        </span>
                                        <ChevronRight className="h-4 w-4 opacity-40" />
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // Expanded view
                  return (
                    <div key={item.id}>
                      <div className="relative">
                        <div className="relative" 
                                    onClick={() => setShowSidebar((v: boolean) => !v)}
                        >
                          <div
                            className={cn(
                              "w-full flex items-center gap-3 rounded-md px-3 py-2.5",
                              "text-left transition cursor-pointer",
                              isActive ? "bg-white text-black shadow-sm" : "bg-transparent hover:bg-white/50"
                            )}
                
                          >
                            <Icon className="h-5 w-5 text-black/70" />

                            <Link
                              href={item.href}
                              className="text-[13px] font-medium flex-1"
                              onClick={(e) => {
                                e.stopPropagation(); // don’t toggle sidebar when navigating
                              }}
                            >
                              {item.label}
                            </Link>

                            {item.hasSubmenu && (
                              <span
                                className="text-black/40"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(item.id);
                                }}
                              >
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Submenu */}
                      <AnimatePresence initial={false}>
                        {isOpen && item.hasSubmenu && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: { duration: 0.22, ease },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: { duration: 0.16, ease },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="pl-11 pr-1 pt-1 pb-1">
                              <div className="space-y-0.5">
                                {item.submenuItems?.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className="block"
                                  >
                                    <div className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-black/70 hover:bg-white/70">
                                      <span className="truncate flex-1">
                                        {subItem.label}
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User menu */}
            <div className="border-t border-black/10 p-3">
              {/* <div className="mt-0">
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-white/50 transition">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.[0] || "U"} 
                  </div>

                  {!collapsed && (
                    <>
                      <div className="flex flex-col flex-1 text-left leading-tight">
                        <span className="text-sm font-medium">
                          {user?.name || "User"}
                        </span>
                        <span className="text-xs text-black/45">
                          {user?.email || "user@example.com"}
                        </span>
                      </div>

                      <ChevronsUpDown className="h-4 w-4 text-black/40" />
                    </>
                  )}
                </button>
              </div> */}

              <DropdownMenu>
                {/* TRIGGER */}
                <DropdownMenuTrigger asChild>
                  <button
                    className="
        flex w-full items-center gap-3
        rounded-lg px-3 py-2
        text-left transition-colors
        hover:bg-muted
        focus:outline-none
      "
                  >
                    {/* <Avatar className="h-8 w-8">
        <AvatarFallback className="font-semibold">SC</AvatarFallback>
      </Avatar> */}



                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-muted">
                      <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        <span className="w-[40px] h-[40px] flex items-center justify-center"> SC </span>
                      </div>

                      <div className="flex flex-col flex-1 text-left leading-tight">
                        <span className="text-sm font-medium">shadcn</span>
                        <span className="text-xs text-muted-foreground">
                          m@example.com
                        </span>
                      </div>

                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {/* <div className="flex flex-col flex-1 leading-tight">
        <span className="text-sm font-medium">shadcn</span>
        <span className="text-xs text-muted-foreground truncate">
          m@example.com
        </span> 
      </div> */}

                    {/* <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" /> */}
                  </button>
                </DropdownMenuTrigger>

                {/* DROPDOWN */}
                <DropdownMenuContent
                  side="right"
                  align="start"
                  sideOffset={12}
                  className="
      w-56 rounded-xl
      border bg-background
      shadow-lg p-1
    "
                >
                  {/* HEADER */}
                  <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="font-semibold">SC</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">shadcn</span>
                      <span className="text-xs text-muted-foreground truncate">
                        m@example.com
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem className="rounded-md">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem className="rounded-md">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>

                  <DropdownMenuItem className="rounded-md">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>

                  <DropdownMenuItem className="rounded-md">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  <DropdownMenuItem
                    className="
        rounded-md text-red-600
        focus:bg-red-50 focus:text-red-600
      "
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
