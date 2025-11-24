import { cookies, headers } from 'next/headers';
import Editor from './Editor';


export default async function ProductDetail({ params }: { params: { id: string } }) {
  const cookie = cookies().toString();
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const baseUrl = `${proto}://${host}`;
  const res = await fetch(`${baseUrl}/api/products/${params.id}`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return <div className="text-sm text-red-600">Not found</div>;
  const { item } = await res.json();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Edit Product</h2>
      {/* @ts-expect-error Server Component import of client component */}
      <Editor id={params.id} item={item} />
    </div>
  );
}
