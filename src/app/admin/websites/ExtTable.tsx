"use client";
import { DataTableExt } from "@/components/admin/DataTableExt";

export default function WebsitesExtTable({ items, currentId }: { items: any[]; currentId: string | null }) {
  const rows = (items || []).map((w) => ({
    ...w,
    isCurrent: currentId === w.websiteId,
  }));

  return (
    <DataTableExt
      title="Websites"
      data={rows}
      initialColumns={[
        { key: "name", label: "Name", render: (_v, row) => (<a className="underline" href="#">{row.name}</a>) },
        { key: "systemSubdomain", label: "System Subdomain" },
        { key: "primaryDomain", label: "Primary Domain" },
        { key: "serviceType", label: "Service" },
        { key: "isCurrent", label: "Current" },
      ]}
    />
  );
}
