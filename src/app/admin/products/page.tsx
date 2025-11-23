export default async function ProductsAdmin() {
  const res = await fetch("/api/products", { cache: "no-store" })
  const data = await res.json()
  const items = data.items || []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Products</h2>
        <div className="flex gap-2">
          <a className="underline text-sm self-center" href="/admin/products/new">New</a>
          <a className="underline text-sm self-center" href="/admin/products">Refresh</a>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((p: { _id: string; name: string; slug: string }) => (
          <li key={p._id} className="border p-3 rounded">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-muted-foreground">/{p.slug}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
