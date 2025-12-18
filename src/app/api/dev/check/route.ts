import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { ensureIndexes } from "@/lib/db/indexes";

export async function GET() {
  try {
    const db = await getDatabase();

    // Option 1: Check if collection exists and has documents
    const count = await db.collection("users").countDocuments();

    if (count > 0) {
      return NextResponse.json({ ok: true, check: true });
    } else {
      return NextResponse.json({ ok: true, check: false });
    }

    // Option 2: If you need the actual documents
    // const users = await db.collection("users").find().toArray();
    // return NextResponse.json({ ok: true, check: users.length > 0, users });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Internal Error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
