export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <nav className="mb-6 flex gap-4 text-sm">
        <a className="underline" href="/admin/pages">Pages</a>
        <a className="underline" href="/admin/posts">Posts</a>
        <a className="underline" href="/admin/products">Products</a>
        <a className="underline" href="/admin/orders">Orders</a>
        <a className="underline" href="/admin/categories">Categories</a>
        <a className="underline" href="/admin/tags">Tags</a>
      </nav>
      {children}
    </div>
  );
}
