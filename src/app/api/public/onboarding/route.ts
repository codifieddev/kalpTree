import { NextResponse } from "next/server";
import { z } from "zod";
import { tenantService } from "@/lib/tenant/tenant-service";
import { userService } from "@/lib/auth/user-service";
import { websiteService } from "@/lib/websites/website-service";
import { cookies } from "next/headers";

// const schema = z.object({
//   tenantSlug: z
//     .string()
//     .min(3)
//     .max(40)
//     .regex(/^[a-z0-9-]+$/i, "Use letters, numbers or dashes").optional,
//   tenantName: z.string().min(3).max(80),
//   adminEmail: z.string().email(),
//   adminPassword: z.string().min(6).max(100),
//   websiteName: z.string().min(2).max(80),
//   serviceType: z.enum(["WEBSITE_ONLY", "ECOMMERCE"]).default("WEBSITE_ONLY"),
//   role: z.string().min(3).max(80).optional(),
// });

const baseSchema = z.object({
  tenantSlug: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/i, "Use letters, numbers or dashes"),

  tenantName: z.string().min(3).max(80),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(6).max(100),
  // websiteName: z.string().min(2).max(80),
  serviceType: z.enum(["WEBSITE_ONLY", "ECOMMERCE"]),
  role: z.string().min(3).max(80),
  website_name: z.string().min(3).max(80),
  createdById: z.string().min(3).max(80),
});

// export async function POST(req: Request) {
//   try {
//     const json = await req.json();
//     const parsed = schema.safeParse(json);
//     if (!parsed.success) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
//         { status: 400 }
//       );
//     }

//     const {
//       tenantSlug,
//       tenantName,
//       adminEmail,
//       adminPassword,
//       websiteName,
//       serviceType,
//       role,
//     } = parsed.data;

//     console.log(adminEmail, adminPassword)

//     if (role == "superadmin") {
//       await userService.createsuperadminUser({
//         email: adminEmail,
//         password: adminPassword,
//       });

//       return NextResponse.json({
//         ok: true,
//         message: "Login",
//       });
//     }

//     // Create tenant
//     const tenant = await tenantService.createTenant({
//       slug: tenantSlug,
//       name: tenantName,
//       email: adminEmail,
//       plan: "trial",
//     });

//     // Create owner user
//     await userService.createUser({
//       tenantId: tenant._id,
//       email: adminEmail,
//       password: adminPassword,
//       name: tenantName + " Owner",
//       role: "A",
//     });

//     // Create default website for tenant
//     const website = await websiteService.create({
//       tenantId: tenant._id,
//       tenantSlug: tenant.slug,
//       name: websiteName,
//       serviceType,
//     });

//     // Do not auto sign-in here; return details to allow redirect to signin with tenant prefilled
//     return NextResponse.json({
//       ok: true,
//       tenantId: String(tenant._id),
//       tenantSlug: tenant.slug,
//       websiteId: website.websiteId,
//       systemSubdomain: website.systemSubdomain,
//     });
//   } catch (e: unknown) {
//     const msg = e instanceof Error ? e.message : "Internal Error";
//     return NextResponse.json({ ok: false, error: msg }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const schema = baseSchema.partial();
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

    // Superadmin flow
    if (data.role === "superadmin") {
      if (!data.adminEmail || !data.adminPassword) {
        return NextResponse.json(
          { ok: false, error: "Email and password required for superadmin" },
          { status: 400 }
        );
      }

      await userService.createsuperadminUser({
        email: data.adminEmail,
        password: data.adminPassword,
      });

      return NextResponse.json({ ok: true, message: "Login" });
    }

    // Tenant flow (guard required fields)
    if (
      !data.tenantName ||
      !data.adminEmail ||
      !data.adminPassword ||
      !data.tenantSlug ||
      !data.role ||
      !data.website_name ||
      !data.createdById
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required tenant fields" },
        { status: 400 }
      );
    }

    const t = await userService.createUser({
      email: data.adminEmail,
      password: data.adminPassword,
      // name: `${data.tenantName} Owner`,
      role: data.role,
      createdById: data.createdById,
    });

    const tenant = await tenantService.createTenant({
      slug: data.tenantSlug,
      name: data.tenantName,
      email: data.adminEmail,
      plan: "trial",
      userId: t._id,
      createdById: data.createdById,
    });

    const website = await websiteService.create({
      tenantId: tenant._id,
      tenantSlug: tenant.slug,
      name: data.website_name,
      serviceType: data.serviceType ?? "WEBSITE_ONLY",
    });

    return NextResponse.json({
      ok: true,
      tenantId: String(tenant._id),
      tenantSlug: tenant.slug,
      // websiteId: website.websiteId,
      // systemSubdomain: website.systemSubdomain,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal Error" },
      { status: 500 }
    );
  }
}
