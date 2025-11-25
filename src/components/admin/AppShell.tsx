"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe2,
  Server,
  Shield,
  FileText,
  ImageIcon,
  Type,
  ShoppingBag,
  BarChart3,
  Code2,
  Settings,
  Users,
  CreditCard,
  Menu,
  Sparkles,
  Package,
  Tags,
  ShoppingCart,
  Building2,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types & interfaces
// ---------------------------------------------------------------------------

export type Website = {
  _id: string;
  websiteId: string;
  name: string;
  primaryDomain?: string | null;
  systemSubdomain: string;
  serviceType: 'WEBSITE_ONLY' | 'ECOMMERCE';
  status?: "active" | "paused" | "error";
};

export type User = {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenantSlug: string;
  role: string;
};

type AppShellProps = {
  children: React.ReactNode;
  websites?: Website[];
  currentWebsite?: Website | null;
  user?: User | null;
  onWebsiteChange?: (websiteId: string) => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  permission?: string;
  badge?: string;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  permission?: string;
};

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------

const accountSection: NavSection = {
  id: "account",
  label: "Account / Platform",
  items: [
    {
      label: "Platform Home",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Websites",
      href: "/admin/websites",
      icon: Globe2,
      permission: "websites:read",
    },
    {
      label: "Users & Roles",
      href: "/admin/users",
      icon: Users,
      permission: "users:read",
    },
    {
      label: "Billing & Plans",
      href: "/admin/billing",
      icon: CreditCard,
      permission: "billing:read",
      badge: "Pro",
    },
    {
      label: "Platform Settings",
      href: "/admin/settings",
      icon: Settings,
      permission: "settings:read",
    },
  ],
};

const currentWebsiteSections: NavSection[] = [
  {
    id: "website-overview",
    label: "Current Website",
    items: [
      {
        label: "Overview",
        href: "/admin/site/overview",
        icon: LayoutDashboard,
      },
      {
        label: "Domain & Hosting",
        href: "/admin/site/domain-hosting",
        icon: Globe2,
        permission: "websites:update",
      },
      {
        label: "Performance & Analytics",
        href: "/admin/site/performance",
        icon: BarChart3,
        permission: "analytics:view",
      },
      {
        label: "Security",
        href: "/admin/site/security",
        icon: Shield,
        permission: "security:read",
      },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      {
        label: "Pages",
        href: "/admin/pages",
        icon: FileText,
        permission: "content:read",
      },
      {
        label: "Posts",
        href: "/admin/posts",
        icon: FileText,
        permission: "content:read",
      },
      {
        label: "Tags",
        href: "/admin/tags",
        icon: Tags,
        permission: "content:read",
      },
      {
        label: "Media Library",
        href: "/admin/site/media",
        icon: ImageIcon,
        permission: "content:read",
      },
      {
        label: "Navigation",
        href: "/admin/site/navigation",
        icon: Server,
        permission: "content:update",
      },
    ],
  },
  {
    id: "brand",
    label: "Brand & Design",
    items: [
      {
        label: "Brand Profile",
        href: "/admin/websites/branding",
        icon: Type,
        permission: "settings:branding",
      },
      {
        label: "Theme & Layouts",
        href: "/admin/site/theme",
        icon: LayoutDashboard,
        permission: "settings:branding",
      },
      {
        label: "Sections & Blocks",
        href: "/admin/site/sections",
        icon: Sparkles,
        permission: "settings:branding",
      },
    ],
  },
  {
    id: "commerce",
    label: "Commerce",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        permission: "products:read",
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: ShoppingBag,
        permission: "products:read",
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        permission: "orders:read",
      },
    ],
  },
  {
    id: "developer",
    label: "Developer / Advanced",
    items: [
      {
        label: "API & Webhooks",
        href: "/admin/site/api",
        icon: Code2,
        permission: "system:api",
      },
      {
        label: "Logs",
        href: "/admin/site/logs",
        icon: Server,
        permission: "system:logs",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sidebar components
// ---------------------------------------------------------------------------

type SidebarProps = {
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
  onWebsiteChange: (websiteId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

function Sidebar({
  websites,
  currentWebsite,
  user,
  onWebsiteChange,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  // Helper function to check if user has permission (simplified for now)
  const hasPermission = (permission?: string) => {
    if (!permission || !user) return true;
    // TODO: Integrate with actual RBAC service
    return true;
  };

  // Filter sections and items based on permissions
  const filteredAccountSection = {
    ...accountSection,
    items: accountSection.items.filter(item => hasPermission(item.permission))
  };

  const filteredWebsiteSections = currentWebsiteSections.map(section => ({
    ...section,
    items: section.items.filter(item => hasPermission(item.permission))
  })).filter(section => section.items.length > 0);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative hidden border-r bg-background md:flex",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-1 flex-col gap-2">
          {/* Logo / brand */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              KT
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  KalpTree
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Multi-tenant CMS
                </div>
              </div>
            )}
          </div>

          {/* Website selector */}
          {websites.length > 0 && (
            <div className="px-3">
              <Select
                value={currentWebsite?.websiteId || ""}
                onValueChange={onWebsiteChange}
              >
                <SelectTrigger
                  className={cn(
                    "h-9 w-full text-xs",
                    collapsed && "px-2"
                  )}
                >
                  {!collapsed && (
                    <SelectValue placeholder="Select website" />
                  )}
                  {collapsed && (
                    <Globe2 className="h-4 w-4" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {websites.map((site) => (
                    <SelectItem key={site.websiteId} value={site.websiteId}>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          {site.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {site.primaryDomain || site.systemSubdomain}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <ScrollArea className="mt-2 flex-1 px-1">
            <nav className="flex flex-col gap-4 pb-8">
              {/* Account section */}
              <SidebarSection
                section={filteredAccountSection}
                pathname={pathname}
                collapsed={collapsed}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
              />

              {/* Current website sections - only show if website is selected */}
              {currentWebsite && filteredWebsiteSections.map((section) => (
                <SidebarSection
                  key={section.id}
                  section={section}
                  pathname={pathname}
                  collapsed={collapsed}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                />
              ))}
            </nav>
          </ScrollArea>

          {/* Collapse button */}
          <div className="border-t px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={onToggleCollapse}
            >
              {!collapsed && <span>Collapse sidebar</span>}
              <span className={cn(collapsed && "mx-auto")}>⟷</span>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

type SidebarSectionProps = {
  section: NavSection;
  pathname: string;
  collapsed?: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
};

function SidebarSection({
  section,
  pathname,
  collapsed,
  hoveredId,
  setHoveredId,
}: SidebarSectionProps) {
  return (
    <div className="px-2">
      {!collapsed && (
        <div className="mb-1 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {section.label}
        </div>
      )}
      <div className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const id = `${section.id}-${item.href}`;
          const showLabel = !collapsed;

          return (
            <Tooltip key={id} delayDuration={collapsed ? 250 : 0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="relative block"
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center",
                      isActive && "text-foreground bg-muted"
                    )}
                  >
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active-pill"
                            className="absolute inset-0 rounded-lg bg-primary/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                          />
                        )}
                      </AnimatePresence>
                      <Icon className="relative h-4 w-4" />
                    </div>
                    {showLabel && (
                      <div className="flex items-center gap-2 flex-1">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-[10px] px-1 py-0">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Topbar
// ---------------------------------------------------------------------------

type TopbarProps = {
  currentWebsite: Website | null;
  user: User | null;
  onToggleMobileSidebar: () => void;
};

function Topbar({ currentWebsite, user, onToggleMobileSidebar }: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 px-3 pl-2 pr-4 backdrop-blur md:h-16">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleMobileSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <div className="hidden text-sm font-medium text-muted-foreground md:inline">
          Dashboard
        </div>
        {currentWebsite && (
          <div className="flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary">
              {currentWebsite.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden md:inline">{currentWebsite.name}</span>
            <span className="hidden text-[11px] text-muted-foreground/80 sm:inline">
              {currentWebsite.primaryDomain || currentWebsite.systemSubdomain}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden text-xs sm:inline-flex">
          <Search className="h-3 w-3 mr-1" />
          Search
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <Button size="sm" className="text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-8 w-8 rounded-full"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.name || "User"}
              <div className="text-xs text-muted-foreground font-normal">
                {user?.email}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// AppShell component (exported)
// ---------------------------------------------------------------------------

export function AppShell({
  children,
  websites = [],
  currentWebsite = null,
  user = null,
  onWebsiteChange = () => {},
}: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <Sidebar
        websites={websites}
        currentWebsite={currentWebsite}
        user={user}
        onWebsiteChange={onWebsiteChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main area */}
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          currentWebsite={currentWebsite}
          user={user}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 px-3 py-4 md:px-6 md:py-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-sm font-semibold">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <div className="h-full">
            <Sidebar
              websites={websites}
              currentWebsite={currentWebsite}
              user={user}
              onWebsiteChange={(websiteId) => {
                onWebsiteChange(websiteId);
                setMobileSidebarOpen(false);
              }}
              collapsed={false}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}