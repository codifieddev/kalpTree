import { cookies } from "next/headers";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCollection } from "../tenants/[id]/route";

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

export async function GET() {
  const cookieStore = await cookies();
  const session = await auth();
  const user = session?.user
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
  let agencies: any[] = [];
  let currentagency: any | null = null;
  let business: any[] = [];
  let currentbusiness: any | null = null;
  let websites: any[] = [];
  let currentWebsite: any | null = null;
  let loggedinTenant: null | any | undefined = null;
  let agencyColl = await getCollection("tenants");
  let websiteColl = await getCollection("websites");
  if (user?.role == "superadmin") {
    agencies = (await agencyColl.find({ type: "agency" }).toArray()).map(
      (d) => {
        delete d.createdAt;
        delete d.updatedAt;
        return {
          ...d,
          _id: String(d._id),
        };
      }
    );
    const currentAgencyId = cookieStore.get(
      "current_selected_agency_id"
    )?.value;

    if (currentAgencyId) {
      currentagency = agencies.find((a) => a._id === currentagency) || null;
    }

    if (!currentagency && agencies.length > 0) {
      currentagency = agencies[0];
    }

    if (currentagency?._id) {
      business = await agencyColl
        .find({ tenantId: new ObjectId(currentagency._id) })
        .toArray();
      business = business.map((doc: any) => ({
        _id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        slug: doc.slug,
        createdById: doc.createdById?.toString(),
      }));

      const currentBusinessId = cookieStore.get(
        "current_selected_business_id"
      )?.value;

      if (currentBusinessId) {
        currentbusiness =
          business.find((t) => t._id === currentBusinessId) || null;
      }
      if (!currentBusinessId && business.length > 0) {
        currentbusiness = business[0];
      }

      if (currentbusiness?._id) {
        websites = await websiteColl
          .find({
            tenantId: new ObjectId(currentbusiness._id),
          })
          .toArray();

        websites = websites.map((doc: any) => ({
          _id: doc._id.toString(),
          websiteId: doc.websiteId,
          name: doc.name,
          primaryDomain: Array.isArray(doc.primaryDomain)
            ? doc.primaryDomain[0] ?? null
            : doc.primaryDomain,
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
    }
  } else if (user?.role == "agency") {
    business = await agencyColl
      .find({ tenantId: new ObjectId(user.tenantId) })
      .toArray();
    business = business.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      slug: doc.slug,
      createdById: doc.createdById?.toString(),
    }));

    const currentBusinessId = cookieStore.get(
      "current_selected_business_id"
    )?.value;

    if (currentBusinessId) {
      currentbusiness =
        business.find((t) => t._id === currentBusinessId) || null;
    }
    if (!currentBusinessId && business.length > 0) {
      currentbusiness = business[0];
    }

    if (currentbusiness?._id) {
      currentWebsite = await websiteColl
        .find({
          tenantId: new ObjectId(currentbusiness._id),
        })
        .toArray();
      websites = currentWebsite.map((doc: any) => ({
        _id: doc._id.toString(),
        websiteId: doc.websiteId,
        name: doc.name,
        primaryDomain: Array.isArray(doc.primaryDomain)
          ? doc.primaryDomain[0] ?? null
          : doc.primaryDomain,
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
  } else if (user?.role == "business") {
    currentWebsite = await websiteColl
      .find({
        tenantId: new ObjectId(user.tenantId),
      })
      .toArray();
    websites = currentWebsite.map((doc: any) => ({
      _id: doc._id.toString(),
      websiteId: doc.websiteId,
      name: doc.name,
      primaryDomain: Array.isArray(doc.primaryDomain)
        ? doc.primaryDomain[0] ?? null
        : doc.primaryDomain,
      serviceType: doc.serviceType,
      status: "active" as const,
    }));

    const currentWebsiteId = cookieStore.get("current_website_id")?.value;

    if (currentWebsiteId) {
      currentWebsite = websites.find((w) => w._id === currentWebsiteId) || null;
    }

    if (!currentWebsite && websites.length > 0) {
      currentWebsite = websites[0];
    }
  }

  return NextResponse.json({
    user,
    business,
    currentbusiness,
    websites,
    currentWebsite,
    loggedinTenant,
    agencies,
    currentagency,
  });
}
