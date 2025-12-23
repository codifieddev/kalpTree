"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Website, User } from "./AppShell";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "@/store/store";
import {
  setWebsites as setWebsitesAction,
  setCurrentWebsite as setCurrentWebsiteAction,
} from "@/hooks/slices/websites/WebsiteSlice";
import { clearAttributes } from "@/hooks/slices/attribute/AttributeSlice";
import { clearBrands } from "@/hooks/slices/brand/BrandSlice";
import { clearSegments } from "@/hooks/slices/segment/SegmentSlice";
import { clearCategories } from "@/hooks/slices/category/CategorySlice";
import { clearProducts } from "@/hooks/slices/product/ProductSlice";
import {
  setCurrentTenants,
  setTenants,
} from "@/hooks/slices/tenants/TenantSlice";

type AppShellClientProps = {
  children: React.ReactNode;
  websites: Website[];
  currentWebsite: Website | null;
  user: User | null;
  tenants: any[];
  currentTenant: any;
  loggedinTenant: any | null
};

export function AppShellClient({
  children,
  websites,
  currentWebsite: initialCurrentWebsite,
  user,
  tenants,
  currentTenant: initialCurrentTenant,
  loggedinTenant
}: AppShellClientProps) {
  const [currentWebsite, setCurrentWebsite] = useState(initialCurrentWebsite);
  const [currentTenant, setCurrentTenant] = useState(initialCurrentTenant);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const resetRedux = () => {
    dispatch(clearAttributes());
    dispatch(clearBrands());
    dispatch(clearSegments());
    dispatch(clearCategories());
    dispatch(clearProducts());
  };
  const handleWebsiteChange = async (websiteId: string) => {
    const newWebsite = websites.find((w) => w._id === websiteId) || null;
    console.log("newWebsite", newWebsite);
    setCurrentWebsite(newWebsite);
    try {
      // Call API to update the current website cookie
      const response = await fetch("/api/session/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteId }),
      });
      if (response.ok) {
        // Clear Redux state first to prevent old data from being used
        resetRedux();
        // Navigate to /admin (which will load fresh data for new website)
        window.location.href = "/admin";
        // router.push("/admin")
      } else {
        console.error("Failed to update website context");
        // Revert the optimistic update
        setCurrentWebsite(initialCurrentWebsite);
      }
    } catch (error) {
      console.error("Error updating website context:", error);
      setCurrentWebsite(initialCurrentWebsite);
    }
  };

  const handleTenantChange = async (tenantId: string) => {
    console.log(tenantId);
    const newTenant = tenants.find((w) => w._id === tenantId) || null;
    setCurrentTenant(newTenant);
    try {
      // Call API to update the current website cookie
      const response = await fetch("/api/session/tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantId }),
      });
      if (response.ok) {
        const json = await response.json();
        // Clear Redux state first to prevent old data from being used
        resetRedux();
        // Navigate to /admin (which will load fresh data for new website)
        window.location.href = "/admin";
        // router.push("/admin")
      } else {
        console.error("Failed to update website context");
        // Revert the optimistic update
        setCurrentTenant(initialCurrentTenant);
      }
    } catch (error) {
      console.error("Error updating website context:", error);
      setCurrentTenant(initialCurrentTenant);
    }
  };

  useEffect(() => {
    if (websites && websites.length > 0) {
      dispatch(setTenants(tenants));
      dispatch(setWebsitesAction(websites));
    }
    // also set current website in redux when initialCurrentWebsite is provided
    if (initialCurrentWebsite) {
      dispatch(setCurrentWebsiteAction(initialCurrentWebsite));
      dispatch(setCurrentTenants(initialCurrentTenant));
    }
  }, [
    dispatch,
    websites,
    initialCurrentWebsite,
    initialCurrentTenant,
    tenants,
  ]);

  return (
    <AppShell
      websites={websites}
      currentWebsite={currentWebsite}
      user={user}
      onWebsiteChange={handleWebsiteChange}
      onTenantChange={handleTenantChange}
      tenants={tenants}
      currentTenant={currentTenant}
      loggedinTenant={loggedinTenant}
    >
      {children}
    </AppShell>
  );
}
