import { cookies, headers } from "next/headers";
import { DataTableExt } from "@/components/admin/DataTableExt";

export default async function OrdersAdmin() {
  const cookie = (await cookies()).toString();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/orders`, { cache: "no-store", headers: { cookie } })
  if (!res.ok) {
    return <div className="text-sm text-red-600">Failed to load orders</div>
  }
  const data = await res.json()
  const items = data.items || []

  return (
    <div>
      <DataTableExt
        title="Orders"
        data={items}
        initialColumns={[
          { key: "orderNumber", label: "Order #" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Created" },
        ]}
        onRowClick={() => { /* Orders not navigable yet */ }}
      />
    </div>
  )
}
