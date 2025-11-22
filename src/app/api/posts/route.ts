import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { postService } from "@/modules/website/post-service";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as 'draft' | 'published' | null) || undefined;
  const tag = searchParams.get("tag") || undefined;
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const items = await postService.list(session.user.tenantId as string, { status, tag, skip, limit });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const created = await postService.create(session.user.tenantId as string, body);
  return NextResponse.json(created, { status: 201 });
}
