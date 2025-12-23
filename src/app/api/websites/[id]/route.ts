import { getDatabase } from "@/lib/db/mongodb";
import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "../../tenants/[id]/route";


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const param = await params;
  const tenantId = new ObjectId(param.id);

  const coll = await getCollection("websites");

  const websites = await coll.find({ tenantId: tenantId }).toArray();

  return NextResponse.json({ item: websites });
  //   const final = (await getCollection("tenants")).find({createdById: t.})
}
