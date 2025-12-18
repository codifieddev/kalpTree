import { cookies as cookiesFn } from "next/headers";
import PageEditor, { FieldConfig } from "@/components/admin/Editor";
import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";
import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";

export default async function PageDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  const pageId = param.id;
  
  const session = await auth();
  
  if (!session?.user?.tenantId) {
    return <div className="text-sm text-red-600">Unauthorized: Please sign in</div>;
  }

  const cookies = await cookiesFn();
  const websiteId = cookies.get("current_website_id")?.value;

  try {
    // Get page data directly from service
    const item = await pageService.getById(
      session.user.tenantId as string, 
      pageId,
      websiteId
    );

    if (!item) {
      return <div className="text-sm text-red-600">Page not found</div>;
    }

    // Serialize the item to plain object
    const serializedItem = {
      ...item,
      _id: item._id?.toString(),
      tenantId: item.tenantId?.toString(),
      websiteId: item.websiteId?.toString(),
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : null,
    };

    // Get website data if websiteId exists
    let serializedWebsite = null;
    if (websiteId) {
      const db = await getDatabase();
      const websitesCollection = db.collection("websites");
      const websiteData = await websitesCollection.findOne({ _id: new ObjectId(websiteId) });
      
      if (websiteData) {
        serializedWebsite = {
          ...websiteData,
          _id: websiteData._id?.toString(),
          tenantId: websiteData.tenantId?.toString(),
          createdAt: websiteData.createdAt ? new Date(websiteData.createdAt).toISOString() : null,
          updatedAt: websiteData.updatedAt ? new Date(websiteData.updatedAt).toISOString() : null,
        };
      }
    }

    const fieldConfig: FieldConfig[] = [
      // Readonly fields (shown at top)
      { name: "slug", label: "Slug", type: "readonly", side: "NA" },
      { name: "createdAt", label: "CreatedAt", type: "readonly", side: "NA" },
      { name: "updatedAt", label: "UpdatedAt", type: "readonly", side: "NA" },

      // Left side (8/12 width) - Main content
      {
        name: "title",
        label: "Title",
        type: "text",
        side: "left",
        placeholder: "Enter page title",
      },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        side: "left",
        rows: 10,
      },

      // Right side (4/12 width) - Metadata
      {
        name: "slug",
        label: "Slug",
        type: "text",
        side: "right",
        placeholder: "page-slug",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        side: "right",
        options: [
          { value: "draft", label: "draft" },
          { value: "published", label: "published" },
        ],
      },
      {
        name: "tenantId",
        label: "Tenant",
        type: "text",
        side: "right",
        placeholder: "tenant-id",
        readOnly: true,
      },
      {
        name: "websiteId",
        label: "Website",
        type: "text",
        side: "right",
        placeholder: "website-id",
        readOnly: true,
      },
    ];

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Edit Page</h2>
        <PageEditor viewUrl={serializedWebsite} id={pageId} item={serializedItem} fields={fieldConfig} />
      </div>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    return <div className="text-sm text-red-600">Failed to load page: {error instanceof Error ? error.message : "Unknown error"}</div>;
  }
}
