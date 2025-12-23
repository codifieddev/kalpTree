import { getDatabase } from "@/lib/db/mongodb";
import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function getCollection<T extends Document = Document>(
  collectionName: string
): Promise<Collection<any>> {
  const db = await getDatabase();
  return db.collection<any>(collectionName);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const param = await params;
  const userid = new ObjectId(param.id);

  const coll = await getCollection("users");
  const user = await coll.findOne({ _id: userid });

  const createdById = user.role === "franchise" ? user._id : user.createdById;
  const tenantcoll = await getCollection("tenants");
  const tenants = await tenantcoll.find({ createdById: createdById }).toArray();

  return NextResponse.json({ item: tenants });
  //   const final = (await getCollection("tenants")).find({createdById: t.})
}
