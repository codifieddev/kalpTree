import { NextResponse } from "next/server";
import { z } from "zod";
import { tenantService } from "@/lib/tenant/tenant-service";
import { userService } from "@/lib/auth/user-service";
import { websiteService } from "@/lib/websites/website-service";
import { cookies } from "next/headers";
import { generateFileName, s3 } from "@/lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const service = formData.get("service") as string;
    const business_name = formData.get("business_name") as string;
    const businsess_url = formData.get("businsess_url") as string;
    const createdById = formData.get("createdById") as string;

    const agency_name = formData.get("agency_name") as string;
    const agency_url_suffix = formData.get("agency_url_suffix") as string;
    const agency_email = formData.get("agency_email") as string;
    const agency_password = formData.get("agency_password") as string;
    const agency_service = formData.get("agency_service") as string;

    const businessdetails = JSON.parse(
      formData.get("businessdetails") as string
    );
    const branding = JSON.parse(formData.get("branding") as string);
    const logo = formData.get("logo") as File | null;

    let createByTenant = "";

    if (
      agency_name &&
      agency_url_suffix &&
      agency_email &&
      agency_password &&
      agency_service
    ) {
      const tenant = await tenantService.createTenant({
        name: agency_name,
        email: agency_email,
        plan: "trial",
        createdById: createdById,
        branding: branding,
        businessdetails: businessdetails,
      });

      let agency_logo_url = "";

      const agencyid = String(tenant._id);

      if (logo) {
        const buffer = Buffer.from(await logo.arrayBuffer());

        const fileName = generateFileName(logo.name);
        const key = `${agencyid}/${fileName}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: logo.type,
          })
        );

        agency_logo_url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      }

      const newBranding = {
        ...branding,
        logo: agency_logo_url,
      };

      await tenantService.updateTenant(agencyid, {
        branding: newBranding,
      });

      createByTenant = String(tenant._id);

      const t = await userService.createUser({
        email: agency_email,
        password: agency_password,
        name: agency_name,
        role: "agency",
        createdById: createdById,
        tenantId: tenant._id,
      });
    }

    const tenant = await tenantService.createTenant({
      name: business_name,
      email: email,
      plan: "trial",
      createdById: createByTenant ? createByTenant : createdById,
      branding: branding,
      businessdetails: businessdetails,
    });

    const id = String(tenant._id);
    let logoUrl = "";
    if (logo) {
      const buffer = Buffer.from(await logo.arrayBuffer());

      const fileName = generateFileName(logo.name);
      const key = `${id}/${fileName}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: logo.type,
        })
      );

      logoUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const newBranding = {
      ...branding,
      logo: logoUrl,
    };

    await tenantService.updateTenant(id, {
      branding: newBranding,
    });

    const t = await userService.createUser({
      email: email,
      password: password,
      name: business_name,
      role: role,
      createdById: createByTenant ? createByTenant : createdById,
      tenantId: tenant._id,
    });

    const primaryDomain = [businsess_url];

    const website = await websiteService.create({
      tenantId: tenant._id,
      name: business_name,
      serviceType: service ?? "WEBSITE_ONLY",
      primaryDomain: primaryDomain,
    });

    return NextResponse.json({
      ok: true,
      tenantId: String(tenant._id),
      tenantSlug: tenant.slug,
      websiteId: website.websiteId,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Internal error" },
      { status: 500 }
    );
  }
}

// const baseSchema = z.object({
//   tenantSlug: z
//     .string()
//     .min(3)
//     .max(40)
//     .regex(/^[a-z0-9-]+$/i, "Use letters, numbers or dashes"),
//   tenantName: z.string().min(3).max(80),
//   adminEmail: z.string().email(),
//   adminPassword: z.string().min(6).max(100),
//   serviceType: z.enum(["WEBSITE_ONLY", "ECOMMERCE"]),
//   role: z.string().min(3).max(80),
//   website_name: z.string().min(3).max(80),
//   createdById: z.string().min(3).max(80),
//   website_url: z.string().min(3).max(80),
// });

// export async function POST(req: Request) {
//   try {
//     const schema = baseSchema.partial();
//     const json = await req.json();
//     const parsed = schema.safeParse(json);
//     type Payload = z.infer<typeof schema>;

//     if (!parsed.success) {
//       return NextResponse.json(
//         { ok: false, error: "Invalid payload", issues: parsed.error.flatten() },
//         { status: 400 }
//       );
//     }

//     const data: Payload = parsed.data;

//     // Superadmin flow
//     if (data.role === "superadmin") {
//       if (!data.adminEmail || !data.adminPassword) {
//         return NextResponse.json(
//           { ok: false, error: "Email and password required for superadmin" },
//           { status: 400 }
//         );
//       }

//       await userService.createsuperadminUser({
//         email: data.adminEmail,
//         password: data.adminPassword,
//       });

//       return NextResponse.json({ ok: true, message: "Login" });
//     }

//     // Tenant flow (guard required fields)
//     if (
//       !data.tenantName ||
//       !data.adminEmail ||
//       !data.adminPassword ||
//       !data.tenantSlug ||
//       !data.role ||
//       !data.website_name ||
//       !data.createdById ||
//       !data.website_url
//     ) {
//       return NextResponse.json(
//         { ok: false, error: "Missing required tenant fields" },
//         { status: 400 }
//       );
//     }

//     const tenant = await tenantService.createTenant({
//       slug: data.tenantSlug,
//       name: data.tenantName,
//       email: data.adminEmail,
//       plan: "trial",
//       createdById: data.createdById,
//     });

//     const t = await userService.createUser({
//       email: data.adminEmail,
//       password: data.adminPassword,
//       name: data.tenantName,
//       role: data.role,
//       createdById: data.createdById,
//       //  tenant ID here
//       tenantId: tenant._id,
//     });

//     const primaryDomain = [data.website_url];

//     const website = await websiteService.create({
//       tenantId: tenant._id,
//       // tenantSlug: tenant.slug,
//       name: data.website_name,
//       serviceType: data.serviceType ?? "WEBSITE_ONLY",
//       primaryDomain: primaryDomain,
//     });

//     return NextResponse.json({
//       ok: true,
//       tenantId: String(tenant._id),
//       tenantSlug: tenant.slug,
//       websiteId: website.websiteId,
//       // systemSubdomain: website.systemSubdomain,
//     });
//   } catch (e: unknown) {
//     return NextResponse.json(
//       { ok: false, error: e instanceof Error ? e.message : "Internal Error" },
//       { status: 500 }
//     );
//   }
// }
