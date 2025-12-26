import { getDatabase } from "@/lib/db/mongodb";
import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "./[id]/route";

export async function GET(req: NextRequest) {
  const request = req;
  const searchParmas = request.nextUrl;

  const id = searchParmas.searchParams.get("id");
  const role = searchParmas.searchParams.get("role");

  const tenantcoll = await getCollection("tenants");
  const createdById = new ObjectId(id!);
  let tenants = null;
  if (role == "agency") {
    tenants = await tenantcoll.find({ createdById: createdById }).toArray();
  } else if (role == "superadmin") {
    tenants = await tenantcoll.find({ type: "business" }).toArray();
  }

  console.log(tenants);

  return NextResponse.json({ item: tenants });
  //   const final = (await getCollection("tenants")).find({createdById: t.})
}
