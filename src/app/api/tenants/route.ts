import { getDatabase } from "@/lib/db/mongodb";
import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "./[id]/route";

export async function GET(req: NextRequest) {
  const request = req;
  const searchParmas = request.nextUrl;

  const id = searchParmas.searchParams.get("id");
  const role = searchParmas.searchParams.get("role");
  let page = Number(searchParmas.searchParams.get("page"));
  let limit = Number(searchParmas.searchParams.get("limit"));

  if (!page && !limit) {
    page = 1;
    limit = 5;
  }

  const skip = (page - 1) * limit;

  const tenantcoll = await getCollection("tenants");
  const createdById = new ObjectId(id!);
  let tenants = null;
  let totalCount = null;
  if (role == "agency") {
    tenants = await tenantcoll
      .find({ createdById: createdById })
      .limit(limit)
      .skip(skip)
      .toArray();
    totalCount = await tenantcoll.countDocuments({ createdById: createdById });
  } else if (role == "superadmin") {
    tenants = await tenantcoll
      .find({ type: "business" })
      .limit(limit)
      .skip(skip)
      .toArray();

    totalCount = await tenantcoll
      .countDocuments({ type: "business" })
  }

  return NextResponse.json({ item: tenants, totalCount:totalCount });
  //   const final = (await getCollection("tenants")).find({createdById: t.})
}
