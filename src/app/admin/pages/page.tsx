import { cookies, headers } from "next/headers";

export default async function PagesAdmin() {
  const cookie = cookies().toString();
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/pages`, { cache: "no-store", headers: { cookie } })
  if (!res.ok) {
    return <div className="text-sm text-red-600">Failed to load pages</div>
  }
  const data = await res.json()
  const items = data.items || []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Pages</h2>
        <div className="flex gap-2">
          <a className="underline text-sm self-center" href="/admin/pages/new">New</a>
          <a className="underline text-sm self-center" href="/admin/pages">Refresh</a>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((p: { _id: string; title: string; slug: string }) => (
          <li key={p._id} className="border p-3 rounded">
            <div className="font-medium flex items-center justify-between">
              <span>{p.title}</span>
              <a className="underline text-sm" href={`/admin/pages/${p._id}`}>Edit</a>
            </div>
            <div className="text-xs text-muted-foreground">/{p.slug}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
