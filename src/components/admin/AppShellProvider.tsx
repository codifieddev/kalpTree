// import { cookies } from "next/headers";
// import { auth } from "@/auth";
// import { websiteService } from "@/lib/websites/website-service";
// import { AppShellClient } from "./AppShellClient";
// import { Website, User } from "./AppShell";

// type AppShellProviderProps = {
//   children: React.ReactNode;
// };

// export async function AppShellProvider({ children }: AppShellProviderProps) {
//   // Get session and user data
//   const session = await auth();
//   const user: User | null = session?.user
//     ? {
//         id: session.user.id || "",
//         email: session.user.email || "",
//         // name: session.user.name || "",
//         // tenantId: "asda" || "",
//         // tenantSlug: session.user.tenantSlug || "",
//         role: session.user.role || "",
//         // forward permissions if present on the session user
//         permissions: Array.isArray((session.user as any).permissions)
//           ? (session.user as any).permissions
//           : undefined,
//       }
//     : null;

//   // Get websites for the current tenant
//   // let websites: Website[] = [];
//   // let currentWebsite: Website | null = null;

//   let tenant: any = [];
//   let current_tenant: any = null;

//   if (user?.role == "franchise") {
//     // console.log(user.id)
//     try {
//       const tenants = await websiteService.listByUserId(user.id);
//       tenant = tenants.map((doc) => ({
//         _id: doc._id.toString(),
//         name: doc.name,
//         email: doc.email,
//         slug: doc.slug,
//         userId: doc.userId.toString(),
//         franchise: doc.franchise.toString(),
//       }));

//       // Get current website from cookie
//       const cookieStore = await cookies();
//       const currenttenantId = cookieStore.get(
//         "current_selected_tenant_id"
//       )?.value;

//       if (currenttenantId) {
//         current_tenant =
//           tenant!.find((w: any) => w._id === currenttenantId) || null;
//       }

//       // If no current website but websites exist, set the first one as current
//       if (!currenttenantId && tenants && tenants.length > 0) {
//         current_tenant = tenant[0];
//       }

//        let websites: Website[] = [];
//   let currentWebsite: Website | null = null;

//   if (tenant?._id) {
//     try {
//       const websiteDocs = await websiteService.listByTenant(tenant._id);
//       websites = websiteDocs.map((doc) => ({
//         _id: doc._id.toString(),
//         websiteId: doc.websiteId,
//         name: doc.name,
//         primaryDomain: Array.isArray(doc.primaryDomain)
//           ? doc.primaryDomain[0] ?? null
//           : doc.primaryDomain,
//         systemSubdomain: doc.systemSubdomain,
//         serviceType: doc.serviceType,
//         status: "active" as const, // TODO: Add status field to WebsiteDoc
//       }));

//       // Get current website from cookie
//       const cookieStore = await cookies();
//       const currentWebsiteId = cookieStore.get("current_website_id")?.value;

//       if (currentWebsiteId) {
//         currentWebsite =
//           websites.find((w) => w._id === currentWebsiteId) || null;
//       }

//       // If no current website but websites exist, set the first one as current
//       if (!currentWebsite && websites.length > 0) {
//         currentWebsite = websites[0];
//       }

//     }

//     } catch (error) {
//       console.error("Failed to load websites:", error);
//     }
//   }

//   // if (user?.tenantId) {
//   //   try {
//   //     const websiteDocs = await websiteService.listByTenant(user.tenantId);
//   //     websites = websiteDocs.map((doc) => ({
//   //       _id: doc._id.toString(),
//   //       websiteId: doc.websiteId,
//   //       name: doc.name,
//   //       primaryDomain: Array.isArray(doc.primaryDomain)
//   //         ? doc.primaryDomain[0] ?? null
//   //         : doc.primaryDomain,
//   //       systemSubdomain: doc.systemSubdomain,
//   //       serviceType: doc.serviceType,
//   //       status: "active" as const, // TODO: Add status field to WebsiteDoc
//   //     }));

//   //     // Get current website from cookie
//   //     const cookieStore = await cookies();
//   //     const currentWebsiteId = cookieStore.get("current_website_id")?.value;

//   //     if (currentWebsiteId) {
//   //       currentWebsite =
//   //         websites.find((w) => w._id === currentWebsiteId) || null;
//   //     }

//   //     // If no current website but websites exist, set the first one as current
//   //     if (!currentWebsite && websites.length > 0) {

//   //       currentWebsite = websites[0];
//   //     }
//   //   } catch (error) {
//   //     console.error("Failed to load websites:", error);
//   //   }
//   // }

//   return (
//     <AppShellClient
//       websites={tenant}
//       currentWebsite={current_tenant}
//       user={user}
//     >
//       {children}
//     </AppShellClient>
//   );
// }

import { cookies } from "next/headers";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";
import { AppShellClient } from "./AppShellClient";
import { Website, User } from "./AppShell";

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
      }
    : null;

  let tenants: any[] = [];
  let currentTenant: any | null = null;

  let websites: Website[] = [];
  let currentWebsite: Website | null = null;

  // ---------------- FRANCHISE USER ----------------
  if (user?.role === "franchise") {
    try {
      // 1. Load tenants for franchise
      const tenantDocs = await websiteService.listByUserId(user.id);

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
  }


  return (
    <AppShellClient
      websites={websites}
      currentWebsite={currentWebsite}
      tenants={tenants}
      currentTenant={currentTenant}
      user={user}
    >
      {children}
    </AppShellClient>
  );
}
