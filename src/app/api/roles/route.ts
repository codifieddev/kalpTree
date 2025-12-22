import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDatabase } from "@/lib/db/mongodb";

export async function GET(req: NextRequest) {
  const db = await getDatabase();
  const collection = db.collection("roles");
  const roles = await collection.find().toArray();
  return NextResponse.json({ items: roles });
}
