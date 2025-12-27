import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { S3Client } from "@aws-sdk/client-s3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export function generateFileName(originalName: string) {
  const ext = originalName.split(".").pop()?.toLowerCase() || "png";

  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // replace spaces & special chars
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "")
    .replace("T", "-")
    .slice(0, 15); // YYYY-MM-DD-HHMMSS

  return `${baseName}-${timestamp}.${ext}`;
}

const ROLE_MAP = {
  superadmin: "",
  agency: "",
  business: "",
} as const;

type Role = keyof typeof ROLE_MAP;

export function toCreateHref(
  url: string,
  tenantId: string | null = null,
  businessId: string | null = null,
  role: string
) {
  if (!(role in ROLE_MAP)) {
    throw new Error("Invalid role");
  }
  const obj: Record<Role, string> = {
    superadmin: `/admin/websites/${url}?businessid=${businessId}&tenantId=${tenantId}`,
    agency: `/admin/websites/${url}?businessid=${businessId}`,
    business: `/admin/websites/${url}`,
  };

  return obj[role as Role];
}
