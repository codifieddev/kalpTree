"use client";
import { useEffect, useState } from "react";
import { Globe, Plus, X } from "lucide-react";

export default function WebsitesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState<"WEBSITE_ONLY" | "ECOMMERCE">(
    "WEBSITE_ONLY"
  );
  const [primaryDomains, setPrimaryDomains] = useState<string[]>([]);
  const [currentDomain, setCurrentDomain] = useState("");
  const [domain, setDomain] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [listRes, curRes] = await Promise.all([
        fetch("/api/domain"),
        fetch("/api/session/website"),
      ]);
      if (!listRes.ok) throw new Error("Failed to load websites");
      const listJson = await listRes.json();
      setItems(listJson.items || []);
      if (curRes.ok) {
        const curJson = await curRes.json();
        setCurrentId(curJson.websiteId || null);
      }
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const addDomain = () => {
    if (currentDomain.trim()) {
      setPrimaryDomains([...primaryDomains, currentDomain.trim()]);
      setCurrentDomain("");
    }
  };

  const removeDomain = (index: number) => {
    setPrimaryDomains(primaryDomains.filter((_, i) => i !== index));
  };

  const handleDomainKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDomain();
    }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        serviceType,
        primaryDomain: primaryDomains.length > 0 ? primaryDomains : null,
      }),
    });

    console.log(res);
    if (res.ok) {
      setName("");
      setPrimaryDomains([]);
      setCurrentDomain("");
      setServiceType("WEBSITE_ONLY");
      load();
    } else {
      let msg = "";
      try {
        msg = (await res.json()).error;
      } catch {}
      alert("Create failed: " + (msg || res.status));
    }
  };

  const setCurrent = async (websiteId: string) => {
    const res = await fetch("/api/session/website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId }),
    });
    if (res.ok) load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Websites
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your domains and service configurations.
          </p>
        </div>
      </div>

      {/* Creation Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-semibold text-slate-700">
            Create New Website
          </h2>
        </div>
        <form onSubmit={onCreate} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Site Name
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 transition-colors"
                placeholder="My Business Website"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Service Type
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-colors"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
              >
                <option value="WEBSITE_ONLY">Website Only</option>
                <option value="ECOMMERCE">E-Commerce</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Primary Domains
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-colors"
                  value={currentDomain}
                  onChange={(e) => setCurrentDomain(e.target.value)}
                  onKeyPress={handleDomainKeyPress}
                  placeholder="https://www.example.com"
                />
              </div>
              <button
                type="button"
                onClick={addDomain}
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors h-10"
              >
                <Plus className="h-4 w-4 mr-2" /> Add
              </button>
            </div>

            {/* Domain Badges */}
            {primaryDomains.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {primaryDomains.map((domain, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200"
                  >
                    {domain}
                    <button
                      type="button"
                      onClick={() => removeDomain(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
            >
              Create Website
            </button>
          </div>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && items.length > 0 ? (
        <div className="mt-4">
          {(() => {
            const Ext = require("./ExtTable").default as any;
            return <Ext items={items} currentId={currentId} />;
          })()}
        </div>
      ) : (
        !loading && <p>No websites yet.</p>
      )}
    </div>
  );
}
