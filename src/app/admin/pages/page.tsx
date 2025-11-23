export default async function PagesAdmin() {
  const res = await fetch("/api/pages", { cache: "no-store" })
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
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-muted-foreground">/{p.slug}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
