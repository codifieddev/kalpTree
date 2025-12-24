import { cookies } from "next/headers";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";
import { AppShellClient } from "./AppShellClient";
import { Website, User } from "./AppShell";
import { ObjectId } from "mongodb";

export function serializeMongoDoc<T>(doc: T): any {
  if (doc === null || doc === undefined) return doc;

  // ObjectId instance
  if (doc instanceof ObjectId) {
    return doc.toString();
  }

  // Date
  if (doc instanceof Date) {
    return doc.toISOString();
  }

  // Array
  if (Array.isArray(doc)) {
    return doc.map(serializeMongoDoc);
  }

  // Object
  if (typeof doc === "object") {
    const plainObj: any = {};
    for (const key in doc) {
      plainObj[key] = serializeMongoDoc((doc as any)[key]);
    }
    return plainObj;
  }

  return doc;
}

type AppShellProviderProps = {
  children: React.ReactNode;
};

export async function AppShellProvider({ children }: AppShellProviderProps) {
  const session = await auth();
  const user: User | null = session?.user
    ? {
        id: session.user.id || "",
        email: session.user.email || "",
        role: session.user.role || "",
        permissions: Array.isArray((session.user as any).permissions)
          ? (session.user as any).permissions
          : undefined,
        createdById: session.user.createdById || "",
        tenantId: session.user.tenantId || "",
      }
    : null;

  let tenants: any[] = [];
  let currentTenant: any | null = null;

  let websites: Website[] = [];
  let currentWebsite: Website | null = null;
  let loggedinTenant: null | any | undefined = null;

  // ---------------- FRANCHISE USER ----------------
  if (user?.role === "agency") {
    try {
      // 1. Load tenants for franchise
      let maintenant = await websiteService.listSingleByTenant(
        session?.user.tenantId!
      );

      loggedinTenant = serializeMongoDoc(maintenant);

      const idtoPass = user && user.createdById ? user.createdById : user.id;

      const tenantDocs = await websiteService.listByUserId(idtoPass);

      tenants = tenantDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        slug: doc.slug,
        // userId: doc.userId.toString(),
        createdById: doc.createdById?.toString(),
      }));

      const cookieStore = await cookies();
      const currentTenantId = cookieStore.get(
        "current_selected_tenant_id"
      )?.value;

      if (currentTenantId) {
        currentTenant = tenants.find((t) => t._id === currentTenantId) || null;
      }

      if (!currentTenant && tenants.length > 0) {
        currentTenant = tenants[0];
      }

      // 2. Load websites for selected tenant
      if (currentTenant?._id) {
        const websiteDocs = await websiteService.listByTenant(
          currentTenant._id
        );

        websites = websiteDocs.map((doc) => ({
          _id: doc._id.toString(),
          websiteId: doc.websiteId,
          name: doc.name,
          primaryDomain: Array.isArray(doc.primaryDomain)
            ? doc.primaryDomain[0] ?? null
            : doc.primaryDomain,
          // systemSubdomain: doc.systemSubdomain,
          serviceType: doc.serviceType,
          status: "active" as const,
        }));

        const currentWebsiteId = cookieStore.get("current_website_id")?.value;

        if (currentWebsiteId) {
          currentWebsite =
            websites.find((w) => w._id === currentWebsiteId) || null;
        }

        if (!currentWebsite && websites.length > 0) {
          currentWebsite = websites[0];
        }
      }
    } catch (error) {
      console.error("Failed to load franchise data:", error);
    }
  } else if (user?.role === "business") {
    try {
      // 1. Load tenants for franchise
      const tenantDocs = await websiteService.listByUserId(user.id, user.role);

      tenants = tenantDocs.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        slug: doc.slug,
        userId: doc.userId.toString(),
        franchise: doc.franchise?.toString(),
      }));

      const cookieStore = await cookies();
      const currentTenantId = cookieStore.get(
        "current_selected_tenant_id"
      )?.value;

      if (currentTenantId) {
        currentTenant = tenants.find((t) => t._id === currentTenantId) || null;
      }

      if (!currentTenant && tenants.length > 0) {
        currentTenant = tenants[0];
      }

      // 2. Load websites for selected tenant
      if (currentTenant?._id) {
        const websiteDocs = await websiteService.listByTenant(
          currentTenant._id
        );

        websites = websiteDocs.map((doc) => ({
          _id: doc._id.toString(),
          websiteId: doc.websiteId,
          name: doc.name,
          primaryDomain: Array.isArray(doc.primaryDomain)
            ? doc.primaryDomain[0] ?? null
            : doc.primaryDomain,
          systemSubdomain: doc.systemSubdomain,
          serviceType: doc.serviceType,
          status: "active" as const,
        }));

        const currentWebsiteId = cookieStore.get("current_website_id")?.value;

        if (currentWebsiteId) {
          currentWebsite =
            websites.find((w) => w._id === currentWebsiteId) || null;
        }

        if (!currentWebsite && websites.length > 0) {
          currentWebsite = websites[0];
        }
      }
    } catch (error) {
      console.error("Failed to load franchise data:", error);
    }
  } else if (user?.role === "agency_admin") {
  }

  return (
    <AppShellClient
      websites={websites}
      currentWebsite={currentWebsite}
      tenants={tenants}
      currentTenant={currentTenant}
      user={user}
      loggedinTenant={loggedinTenant}
    >
      {children}
    </AppShellClient>
  );
}
