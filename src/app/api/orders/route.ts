import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { orderService } from "@/modules/ecommerce/order-service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as 'pending' | 'confirmed' | 'completed' | 'cancelled' | null) || undefined;
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const items = await orderService.list(session.user.tenantId as string, { status, skip, limit });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const created = await orderService.create(session.user.tenantId as string, body);
  return NextResponse.json(created, { status: 201 });
}
