import { cookies as cookiesFn, headers as headersFn } from 'next/headers';
import Editor from './Editor';

export default async function PageDetail({ params }: { params: Promise<{ id: string }> }) {
  const param = await params
  const t = param.id
  const cookies = await cookiesFn(); // no await
  const headers = await headersFn(); // no await

  const cookie = cookies.toString();
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  const proto = headers.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${proto}://${host}`;

  const res = await fetch(`${baseUrl}/api/pages/${t}`, {
    cache: 'no-store',
    headers: { cookie },
  });

  if (!res.ok) return <div className="text-sm text-red-600">Not found</div>;

  const { item } = await res.json();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Page</h2>
      <Editor id={t} item={item} />
    </div>
  );
}
