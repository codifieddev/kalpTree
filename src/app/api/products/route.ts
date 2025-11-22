import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { productService } from "@/modules/ecommerce/product-service";

function toNumber(v: string | null, def: number, min = 0, max = 100) {
  const n = v ? parseInt(v, 10) : def;
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as 'draft' | 'published' | 'archived' | null;
  const categoryId = searchParams.get("categoryId");
  const productType = searchParams.get("productType") as 'physical' | 'digital' | 'service' | 'booking' | 'rental' | null;
  const skip = toNumber(searchParams.get("skip"), 0, 0, 10000);
  const limit = toNumber(searchParams.get("limit"), 20, 1, 100);
  const items = await productService.listProducts(session.user.tenantId as string, { status: status ?? undefined, categoryId: categoryId || undefined, productType: productType ?? undefined, skip, limit });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const created = await productService.createProduct(session.user.tenantId as string, body);
  return NextResponse.json(created, { status: 201 });
}
