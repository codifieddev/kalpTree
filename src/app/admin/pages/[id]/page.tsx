import { cookies as cookiesFn, headers as headersFn } from 'next/headers';
import Editor from './Editor';


export default async function PageDetail({ params }: { params: { id: string } }) {
  const cookies = await cookiesFn();
  const headers = await headersFn();
  const cookie = cookies.toString();
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  const proto = headers.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/pages/${params.id}`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return <div className="text-sm text-red-600">Not found</div>;
  const { item } = await res.json();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Page</h2>
      <Editor id={params.id} item={item} />
    </div>
  );
}
