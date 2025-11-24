import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { auth } from '@/auth';
import { websiteService } from '@/lib/websites/website-service';

const bodySchema = z.object({ websiteId: z.string().min(1) });

export async function GET() {
  const session = await auth();
  const jar = cookies();
  const websiteId = jar.get('current_website_id')?.value || null;
  return NextResponse.json({ websiteId });
}

export async function POST(req: Request) {
  const session = await auth();
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  // Verify that website belongs to the same tenant
  const list = await websiteService.listByTenant(session.user.tenantId);
  const found = list.find(w => w.websiteId === parsed.data.websiteId);

  const res = NextResponse.json({ ok: true, websiteId: found.websiteId });
  const thirtyDays = 30 * 24 * 60 * 60; // seconds
  res.cookies.set('current_website_id', found.websiteId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: thirtyDays,
  });
  return res;
}
