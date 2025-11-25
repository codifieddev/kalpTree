import { cookies, headers } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";

export default async function TagsAdmin() {
  const cookie = (await cookies()).toString();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/blog_tags`, { cache: "no-store", headers: { cookie } })
  if (!res.ok) {
    return <div className="text-sm text-red-600">Failed to load tags</div>
  }
  const data = await res.json()
  const items = data.items || []

  return (
    <div>
      <DataTableExt
        title="Tags"
        data={items}
        initialColumns={[
          { key: "name", label: "Name" },
          { key: "slug", label: "Slug" },
          { key: "createdAt", label: "Created" },
        ]}
      />
    </div>
  )
}
