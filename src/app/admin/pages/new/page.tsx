"use client"

import { useState } from "react"
import PageBuilder from "@/components/admin/PageBuilder"

import { Button } from "@/components/ui/button"

export default function NewPage() {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: "", slug: "", content: "" })
  // content is HTML managed by PageBuilder

  async function submit() {
    setSaving(true)
    await fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setSaving(false)
    window.location.href = "/admin/pages"
  }

  return (
    <div className="max-w-xl space-y-3">
      <h2 className="text-xl font-medium">New Page</h2>
      <input className="border p-2 w-full rounded" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value, slug:e.target.value.toLowerCase().replace(/\s+/g,'-')})} />
      <input className="border p-2 w-full rounded" placeholder="Slug" value={form.slug} onChange={(e)=>setForm({...form, slug:e.target.value})} />
      <div className="border rounded">
        <PageBuilder value={form.content} onChange={(html)=>setForm({...form, content: html})} />
      </div>
      <div className="flex gap-2">
        <Button onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        <a className="underline text-sm" href="/admin/pages">Cancel</a>
      </div>
    </div>
  )
}
