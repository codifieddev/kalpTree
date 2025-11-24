"use client";
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function WebsitesPage() {
  const swr = useSWR('/api/websites', fetcher);
  const sessionSWR = useSWR('/api/session/website', fetcher);
  const data = (swr.data as any) || {};
  const error = swr.error as any;
  const mutate = swr.mutate;
  const loading = !swr.data && !swr.error;
  const currentId = (sessionSWR.data as any)?.websiteId as string | undefined;
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState<'WEBSITE_ONLY' | 'ECOMMERCE'>('WEBSITE_ONLY');
  const [primaryDomain, setPrimaryDomain] = useState('');

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/websites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, serviceType, primaryDomain: primaryDomain || null }),
    });
    if (res.ok) {
      setName('');
      setPrimaryDomain('');
      setServiceType('WEBSITE_ONLY');
      mutate();
    } else {
      let msg = '';
      try { msg = (await res.json()).error; } catch {}
      alert('Create failed: ' + (msg || res.status));
    }
  };

  const setCurrent = async (websiteId: string) => {
    const res = await fetch('/api/session/website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteId })
    });
    if (res.ok) sessionSWR.mutate();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Websites</h1>
      <form onSubmit={onCreate} className="space-y-3 p-4 border rounded">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="border px-2 py-1 rounded w-full" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Service Type</label>
          <select className="border px-2 py-1 rounded w-full" value={serviceType} onChange={(e) => setServiceType(e.target.value as any)}>
            <option value="WEBSITE_ONLY">WEBSITE_ONLY</option>
            <option value="ECOMMERCE">ECOMMERCE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Primary Domain (optional)</label>
          <input className="border px-2 py-1 rounded w-full" value={primaryDomain} onChange={(e) => setPrimaryDomain(e.target.value)} placeholder="https://www.example.com" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Failed to load</p>}
      {data?.items?.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th>System Subdomain</th>
              <th>Primary Domain</th>
              <th>Service</th>
              <th>Current</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((w: any) => (
              <tr key={w.websiteId} className="border-b">
                <td className="py-2">{w.name}</td>
                <td>{w.systemSubdomain}</td>
                <td>{w.primaryDomain || '-'}</td>
                <td>{w.serviceType}</td>
                <td>{currentId === w.websiteId ? 'Yes' : '-'}</td>
                <td>
                  <button onClick={() => setCurrent(w.websiteId)} className="text-blue-600 underline">Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No websites yet.</p>
      )}
    </div>
  );
}
