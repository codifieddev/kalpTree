import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { mediaService } from '@/modules/website/media-service';
import { z } from 'zod';

const createFolderSchema = z.object({ name: z.string().min(1), slug: z.string().min(1), parentId: z.string().optional() });

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const websiteId = (await import('next/headers')).cookies().get('current_website_id')?.value;
  const items = await mediaService.listFolders(session.user.tenantId, websiteId);
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const json = await req.json();
  const parsed = createFolderSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  const websiteId = (await import('next/headers')).cookies().get('current_website_id')?.value;
  const created = await mediaService.createFolder(session.user.tenantId, parsed.data as any, websiteId);
  return NextResponse.json(created, { status: 201 });
}
