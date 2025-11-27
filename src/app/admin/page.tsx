import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { cookies } from "next/headers";

async function fetchCount(path: string) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();
    const res = await fetch(path, { cache: "no-store", headers: { cookie } });
    if (!res.ok) return 0;
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items;
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
}

export default async function AdminIndex() {
  const [pages, posts, products, orders, categories, tags] = await Promise.all([
    fetchCount("/api/pages"),
    fetchCount("/api/posts"),
    fetchCount("/api/products"),
    fetchCount("/api/orders"),
    fetchCount("/api/categories"),
    fetchCount("/api/blog_tags"),
  ]);

  // const cards = [
  //   { title: "Pages", count: pages, href: "/admin/pages" },
  //   { title: "Posts", count: posts, href: "/admin/posts" },
  //   { title: "Products", count: products, href: "/admin/products" },
  //   { title: "Orders", count: orders, href: "/admin/orders" },
  //   { title: "Categories", count: categories, href: "/admin/categories" },
  //   { title: "Tags", count: tags, href: "/admin/tags" },
  // ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Quick overview</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {cards.map((c) => (
          <Link key={c.title} href={c.href} className="block">
            <Card className="hover:shadow-sm transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{c.count}</div>
                <div className="text-xs text-muted-foreground mt-1">View all</div>
              </CardContent>
            </Card>
          </Link>
        ))} */}
      </div>
    </div>
  );
}
