import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { websiteService } from "@/lib/websites/website-service";
import { getCollection } from "../../tenants/[id]/route";
import { ObjectId } from "mongodb";

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


  const agencycoll = await getCollection("tenants");
  const websitecoll = await getCollection("websites");
  // Verify that userid belongs to the same tenant

  const foundBusiness = await agencycoll.findOne({
    _id: new ObjectId(parsed.data.tenantId),
  });

  if (!foundBusiness)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const firstWebsite = await websitecoll.findOne({
    tenantId: foundBusiness._id,
  });

  console.log(firstWebsite)

  const res = NextResponse.json({
    ok: true,
    tenant: String(foundBusiness._id),
    website_id: firstWebsite.primaryDomain[0],
  });

  const thirtyDays = 30 * 24 * 60 * 60; // seconds
  res.cookies.set(
    "current_selected_business_id",
    String(foundBusiness["_id"]),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: thirtyDays,
    }
  );
  res.cookies.set("current_website_id", String(firstWebsite["_id"]), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: thirtyDays,
  });
  return res;
}
