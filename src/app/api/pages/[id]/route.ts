import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { pageService } from '@/modules/website/page-service';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  slug: z.string().min(1).optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.coerce.date().optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const param = await params
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const websiteId = (await cookies()).get('current_website_id')?.value;
  const doc = await pageService.getById(session.user.tenantId as string, param.id, websiteId);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: doc });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
   const param = await params
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const websiteId = (await cookies()).get('current_website_id')?.value;
  const exists = await pageService.getById(session.user.tenantId as string, param.id, websiteId);
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const json = await req.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });

  const ok = await pageService.updatePage(param.id, session.user.tenantId as string, parsed.data);
  if (!ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
     const param = await params
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const websiteId = (await cookies()).get('current_website_id')?.value;
  const exists = await pageService.getById(session.user.tenantId as string, param.id, websiteId);
  if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const ok = await pageService.deletePage(param.id, session.user.tenantId as string);
  if (!ok) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
