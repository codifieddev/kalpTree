import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";

const bodySchema = z.object({ tenantId: z.string().min(1) });

export async function GET() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const jar = await cookies();
  const websiteId = jar.get("current_website_id")?.value || null;
  return NextResponse.json({ websiteId });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // Verify that userid belongs to the same tenant
  const list = await websiteService.listByUserId(session.user.id);

  const found = list.find((w) => String(w._id) === parsed.data.tenantId);
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const website_id = await websiteService.listByTenant(found._id);

  const firstWebsite = website_id[0];

  const res = NextResponse.json({
    ok: true,
    tenant: found._id,
    website_id: String(firstWebsite._id),
  });

  const thirtyDays = 30 * 24 * 60 * 60; // seconds
  res.cookies.set("current_selected_tenant_id", String(found["_id"]), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: thirtyDays,
  });
  res.cookies.set("current_website_id", String(firstWebsite["_id"]), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: thirtyDays,
  });
  return res;
}
