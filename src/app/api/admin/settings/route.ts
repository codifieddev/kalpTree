import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface SiteSetting {
  suffix: string;
  tenantId: ObjectId | string;
}

export async function GET(request: NextRequest) {
  const cookie = (await cookies()).get("current_selected_tenant_id")?.value;
  if (!cookie) return NextResponse.json("No Tenant Found");
  const db = await getDatabase();
  const collection = await db.collection("rootsettings");
  const id = new ObjectId(cookie);
  const filterRootSetting = await collection.findOne({ tenantId: id });
  return NextResponse.json(filterRootSetting);
}

export async function POST(request: NextRequest) {
  const cookie = (await cookies()).get("current_selected_tenant_id")?.value;
  if (!cookie) return NextResponse.json("Tenant Not Logged In or Selected");
  const json = await request.json();
  const { suffix } = json;
  const db = await getDatabase();
  const collection = await db.collection("rootsettings");
  const id = new ObjectId(cookie);

  const addRootSetting = await collection.insertOne({
    tenantId: id,
    domainsuffix: suffix,
    createdAt: new Date(),
  });

  return NextResponse.json(
    {
      _id: addRootSetting.insertedId,
      cookie,
      suffix,
    },
    { status: 201 }
  );
}
