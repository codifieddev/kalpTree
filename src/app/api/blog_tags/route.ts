import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { blogTagService } from '@/modules/website/tag-service';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await blogTagService.list(session.user.tenantId as string);
  return NextResponse.json({ items, meta: { total: items.length, limit: items.length, skip: 0, hasMore: false } });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 });
  const created = await blogTagService.create(session.user.tenantId as string, parsed.data);
  return NextResponse.json(created, { status: 201 });
}
