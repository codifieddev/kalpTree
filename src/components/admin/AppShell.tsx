"use client";
import * as React from "react";
import {
  LayoutDashboard,
  Globe2,
  FileText,
  Type,
  Tags,
  Bell,
  Palette,
  Share2,
  LayoutTemplate,
  Globe,
  Settings2,
  CreditCard,
  Activity,
  Blocks,
  Webhook,
  Download,
  ShieldCheck,
  Users,
  Fingerprint,
  UsersRound,
  UserPlus,
  History,
  KeyRound,
  ImagePlus,
  ScanSearch,
  Paintbrush,
  Bot,
  Network,
  Compass,
  Terminal,
  Heart,
  GalleryVerticalEnd,
  Cpu,
  Image as ImageIcon,
  Megaphone,
  BookOpen,
  TicketPercent,
  MailPlus,
  Zap,
  ShoppingBag,
  BarChart4,
  ShoppingCart,
  RefreshCcw,
  ReceiptIndianRupee, // or Banknote / Percent
  Truck,
  Settings,
  Package,
  LayoutGrid,
  Award,
  Layers,
  ListTree,
  Hash,
  Component,
  Boxes,
  CircleDollarSign,
  Image,
  SwatchBook,
  BarChart3,
  HeartPulse,
  FileCode2,
  Newspaper,
  PanelTop,
  PanelBottom,
  ClipboardList,
  ArrowLeftRight,
  User,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Sidebar } from "./Sidebar/sidebar";
import { Topbar } from "./Sidebar/topbar";
import { MobileSidebar } from "./Sidebar/mobileSidebar";
import { HighLevelSidebar } from "./Sidebar/highlevelsidebar";

// ---------------------------------------------------------------------------
// Types & interfaces
// ---------------------------------------------------------------------------

export type Website = {
  _id: string;
  tenantId?: string;
  websiteId?: string;
  name: string;
  primaryDomain?: string[] | string | null;
  systemSubdomain?: string;
  serviceType: "WEBSITE_ONLY" | "ECOMMERCE";
  status?: "active" | "paused" | "error";
};

export type User = {
  id: string;
  email: string;
  name?: string;
  tenantId?: string;
  // tenantSlug: string;
  role: string;
  permissions?: string[];
  createdById: string;
};

type AppShellProps = {
  children: React.ReactNode;
  websites?: Website[];
  currentWebsite?: Website | null;
  user?: User | null;
  onWebsiteChange?: (websiteId: string) => void;
  tenants: any[];
  currentTenant: any | null;
  onTenantChange?: (tenantId: string) => void;
  loggedinTenant: any;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  permission?: string | string[];
  badge?: string;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  permission?: string;
};

export const currentWebsiteSections: NavSection[] = [
  {
    id: "dashboard-overview",
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/pages", icon: LayoutDashboard },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        permission: "websites:update",
      },
      {
        label: "Activity Log",
        href: "/admin/activity-log",
        icon: Activity,
        permission: "analytics:view",
      },
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        permission: "security:read",
      },
      {
        label: "System Health",
        href: "/admin/system-health",
        icon: HeartPulse,
        permission: "security:read",
      },
      {
        label: "Quick Actions",
        href: "/admin/quick-actions",
        icon: Zap,
        permission: "security:read",
      },
    ],
  },

  {
    id: "websites",
    label: "Websites",
    items: [
      { label: "Pages", href: "/admin/pages", icon: FileCode2 },
      {
        label: "Posts",
        href: "/admin/posts",
        icon: Newspaper,
        permission: "websites:update",
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: ImageIcon,
        permission: "analytics:view",
      },
      {
        label: "Header",
        href: "/admin/header",
        icon: PanelTop,
        permission: "security:read",
      },
      {
        label: "Footer",
        href: "/admin/footer",
        icon: PanelBottom,
        permission: "security:read",
      },
      {
        label: "Navigation",
        href: "/admin/navigation",
        icon: Compass,
        permission: "security:read",
      },
      {
        label: "Forms",
        href: "/admin/forms",
        icon: ClipboardList,
        permission: "security:read",
      },
      {
        label: "Redirects",
        href: "/admin/redirects",
        icon: ArrowLeftRight,
        permission: "security:read",
      },
      {
        label: "Domain Settings",
        href: "/admin/domains",
        icon: Globe2,
        permission: "security:read",
      },
    ],
  },

  {
    id: "branding",
    label: "Branding & Design",
    items: [
      {
        label: "Brand Profile",
        href: "/admin/branding/brand-profile",
        icon: LayoutGrid,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Logo",
        href: "/admin/branding/logo",
        icon: Image,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Colors",
        href: "/admin/branding/colors",
        icon: Palette,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Typography",
        href: "/admin/branding/typography",
        icon: Type,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Layout Settings",
        href: "/admin/branding/layout-settings",
        icon: LayoutTemplate,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Theme Presets",
        href: "/admin/branding/theme-presets",
        icon: SwatchBook,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "products",
    label: "Products",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Category",
        href: "/admin/category",
        icon: LayoutGrid,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Brand",
        href: "/admin/brand",
        icon: Award,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Segment",
        href: "/admin/segment",
        icon: Layers,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Attribute",
        href: "/admin/attribute",
        icon: ListTree,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Styles",
        href: "/admin/styles",
        icon: Palette,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Tags",
        href: "/admin/tags",
        icon: Hash,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Attributes",
        href: "/admin/attributes-list",
        icon: Component,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Variants",
        href: "/admin/variants",
        icon: Boxes,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Pricing Rules",
        href: "/admin/pricing-rules",
        icon: CircleDollarSign,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "ecommerce",
    label: "E-Commerce",
    items: [
      {
        label: "Orders",
        href: "/admin/ecommerce/orders",
        icon: ShoppingBag,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Customers",
        href: "/admin/ecommerce/customers",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Reports",
        href: "/admin/ecommerce/reports",
        icon: BarChart4,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Abandoned Carts",
        href: "/admin/ecommerce/abandoned-carts",
        icon: ShoppingCart,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Subscriptions",
        href: "/admin/ecommerce/subscriptions",
        icon: RefreshCcw,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Taxes",
        href: "/admin/ecommerce/taxes",
        icon: ReceiptIndianRupee,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Shipping",
        href: "/admin/ecommerce/shipping",
        icon: Truck,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Payments",
        href: "/admin/ecommerce/payments",
        icon: CreditCard,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Invoices",
        href: "/admin/ecommerce/invoices",
        icon: FileText,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Settings",
        href: "/admin/ecommerce/settings",
        icon: Settings,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "marketing",
    label: "Marketing",
    items: [
      {
        label: "Banners",
        href: "/admin/marketing/banners",
        icon: ImageIcon,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Campaigns",
        href: "/admin/marketing/campaigns",
        icon: Megaphone,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Catalog Generation",
        href: "/admin/marketing/catalog-generation",
        icon: BookOpen,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Quotations",
        href: "/admin/marketing/quotations",
        icon: FileText,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Coupons",
        href: "/admin/marketing/coupons",
        icon: TicketPercent,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Email Templates",
        href: "/admin/marketing/email-templates",
        icon: MailPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/marketing/integrations",
        icon: Share2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Automation Rules",
        href: "/admin/marketing/automation-rules",
        icon: Zap,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "ai-studio",
    label: "AI Studio",
    items: [
      {
        label: "Image Uploads",
        href: "/admin/ai-studio/image-uploads",
        icon: ImagePlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Segment Detection",
        href: "/admin/ai-studio/segment-detection",
        icon: ScanSearch,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Material Application",
        href: "/admin/ai-studio/material-application",
        icon: Paintbrush,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Prompt Library",
        href: "/admin/ai-studio/prompt-library",
        icon: Terminal,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Render History",
        href: "/admin/ai-studio/render-history",
        icon: History,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Saved Designs",
        href: "/admin/ai-studio/saved-designs",
        icon: Heart,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Reference Images",
        href: "/admin/ai-studio/reference-images",
        icon: GalleryVerticalEnd,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "AI Settings",
        href: "/admin/ai-studio/ai-settings",
        icon: Cpu,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },
  {
    id: "users",
    label: "Users",
    items: [
      {
        label: "All Users",
        href: "/admin/users/all-user",
        icon: Users,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Create Users",
        href: "/admin/users/create",
        icon: UserPlus,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Roles & Permissions",
        href: "/admin/users/roles-permissions",
        icon: Fingerprint,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Teams",
        href: "/admin/users/teams",
        icon: UsersRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Activity Logs",
        href: "/admin/users/activity-logs",
        icon: History,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "API Access",
        href: "/admin/users/api-access",
        icon: KeyRound,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      {
        label: "General",
        href: "/admin/settings/general",
        icon: Settings2,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Domain & DNS",
        href: "/admin/settings/domain-dns",
        icon: Globe,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Billing & Plans",
        href: "/admin/settings/billing-plans",
        icon: CreditCard,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Usage & Limits",
        href: "/admin/settings/usage-limits",
        icon: Activity,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Integrations",
        href: "/admin/settings/integrations",
        icon: Blocks,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Webhooks",
        href: "/admin/settings/webhooks",
        icon: Webhook,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Data Export",
        href: "/admin/settings/data-export",
        icon: Download,
        permission: ["content:read", "content:update", "content:delete"],
      },
      {
        label: "Security",
        href: "/admin/settings/security",
        icon: ShieldCheck,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },
  {
    id: "block-manager",
    label: "Block Manager",
    items: [
      {
        label: "Blocks",
        href: "/admin/block-manager/blocks",
        icon: Blocks,
        permission: ["content:read", "content:update", "content:delete"],
      },
    ],
  },

  {
    id: "domains",
    label: "Domain & Hosting",
    items: [
      {
        label: "Domains",
        href: "/admin/domain",
        icon: Globe,
        permission: "content:read",
      },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function useHasPermission(user: User | null) {
  return React.useCallback(
    (permission?: string | string[]) => {
      if (!permission) return true;
      if (!user) return true;

      const required = Array.isArray(permission) ? permission : [permission];
      if (!user.permissions) return true;

      return required.some((p) => user.permissions?.includes(p));
    },
    [user]
  );
}

// Section "header icon" like screenshot (one icon per group)
export const sectionIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  "dashboard-overview": LayoutGrid,
  websites: Globe,
  branding: Palette,
  products: Tags,
  ecommerce: ShoppingCart,
  marketing: Megaphone,
  "ai-studio": Bot,
  users: Users,
  settings: Settings,
  domains: Network,
};

export function FiCloseHint() {
  return <div className="text-[11px] text-black/35">hover</div>;
}

export function AppShell({
  children,
  websites = [],
  currentWebsite = null,
  user = null,
  onWebsiteChange = () => {},
  onTenantChange = () => {},
  tenants = [],
  currentTenant = null,
  loggedinTenant,
}: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const isHighLevelCollapsed = currentWebsite ? true : false;

  console.log(isHighLevelCollapsed);
  return (
    <div className="flex min-h-screen bg-[#e8e9eb] text-foreground overflow-hidden">
      <HighLevelSidebar
        user={user}
        collapsed={isHighLevelCollapsed}
        loggedinTenant={loggedinTenant}
      />
      <Sidebar
        tenants={tenants}
        currentTenant={currentTenant}
        onTenantChange={onTenantChange}
        websites={websites}
        currentWebsite={currentWebsite}
        user={user}
        onWebsiteChange={onWebsiteChange}
        collapsed={!isHighLevelCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        loggedinTenant={loggedinTenant}
      />

      <div className="flex flex-1 min-h-screen flex-col overflow-hidden">
        <Topbar
          currentWebsite={currentWebsite}
          user={user}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={(event) => setSidebarCollapsed((prev) => !prev)}
        />
        <main className="flex-1 px-3 py-4 md:px-6 md:py-6 overflow-auto">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-sm font-semibold">
              Navigation
            </SheetTitle>
          </SheetHeader>
          <MobileSidebar
            websites={websites}
            currentWebsite={currentWebsite}
            user={user}
            onWebsiteChange={(websiteId) => {
              onWebsiteChange(websiteId);
              setMobileSidebarOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
