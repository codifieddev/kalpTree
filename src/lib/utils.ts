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