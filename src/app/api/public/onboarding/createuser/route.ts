import { NextResponse } from "next/server";
import { z } from "zod";
import { tenantService } from "@/lib/tenant/tenant-service";
import { userService } from "@/lib/auth/user-service";
import { websiteService } from "@/lib/websites/website-service";
import { cookies } from "next/headers";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(6).max(100),
  role: z.string().min(3).max(80),
  permissions: z.array(z.string()),
  createdById: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  try {
    const schema = userSchema.partial();
    const json = await req.json();
    const parsed = schema.safeParse(json);
    type Payload = z.infer<typeof schema>;

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data: Payload = parsed.data;

    if (
      !data.email ||
      !data.password ||
      !data.permissions ||
      !data.name ||
      !data.role ||
      !data.createdById
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required tenant fields" },
        { status: 400 }
      );
    }

    const t = await userService.createSingleUser({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      permissions: data.permissions,
      createdById: data.createdById,
    });

    return NextResponse.json({
      ...t,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal Error" },
      { status: 500 }
    );
  }
}
