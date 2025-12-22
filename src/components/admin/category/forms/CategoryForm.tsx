"use client";

import React from "react";
import { IconSVG } from "@/components/ui/icon-display";
import { businessTypeIcons } from "./businessTypeIcons";
import { MaterialCategory } from "../types/CategoryModel";

type CategoryFormProps = {
  category: MaterialCategory;
  setCategory: React.Dispatch<React.SetStateAction<MaterialCategory>>;
  fieldErrors: Record<string, string>;
};

export default function CategoryForm({
  category,
  setCategory,
  fieldErrors,
}: CategoryFormProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={category.name || ""}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Icon</label>
        <div className="mt-1 flex gap-2">
          {Object.entries(businessTypeIcons).map(([type, svg]) => (
            <button
              key={type}
              type="button"
              onClick={() => setCategory({ ...category, icon: type })}
              className={`px-2 py-1 rounded border ${
                category.icon === type ? "bg-accent text-white" : ""
              } flex items-center gap-1`}
            >
              <IconSVG svg={svg} />
              <span className="text-xs">{type}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Selected: {category.icon}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Sort order</label>
        <input
          type="number"
          value={category.sort_order ?? 0}
          onChange={(e) =>
            setCategory({
              ...category,
              sort_order: Number(e.target.value),
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.sort_order && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.sort_order}
          </div>
        )}
      </div>
    </>
  );
}
