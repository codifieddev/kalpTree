import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pageService } from "@/modules/website/page-service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await pageService.listPages(session.user.tenantId as string);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const created = await pageService.createPage(session.user.tenantId as string, body);
  return NextResponse.json(created, { status: 201 });
}
