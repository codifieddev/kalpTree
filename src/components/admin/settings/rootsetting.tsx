"use client";

import React, { useEffect, useState } from "react";
import { Edit2, Check, X, Globe, Loader } from "lucide-react"; // Optional: Lucide icons for flair

export const RootSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    domainSuffix: "",
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      const json = await res.json();
      const copied = structuredClone(settings);
      copied.domainSuffix = json.domainsuffix;
      setSettings(copied);
    })();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify({
        suffix: settings.domainSuffix,
      }),
    });

    const json = await res.json();
    console.log(json);
    // Logic for API call goes here
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            General Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your root configuration and domain preferences.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm"
          >
            <Edit2 size={16} /> Edit Settings
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-sm"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Settings Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Domain Suffix Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 p-6 border-bottom border-slate-100 dark:border-slate-800 gap-4 items-start">
          <div>
            <label className="font-semibold block">Domain Suffix</label>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Used for auto-generating subdomains.
            </p>
          </div>
          <div className="md:col-span-2">
            {isEditing ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  name="domainSuffix"
                  value={settings.domainSuffix}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            ) : (
              <code className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-md font-mono text-sm border border-indigo-100 dark:border-indigo-900/50">
                {settings.domainSuffix == "" ? <Loader/> : settings.domainSuffix}
              </code>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
