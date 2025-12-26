"use client";

import React, { useEffect, useState } from "react";
import { IconSVG } from "@/components/ui/icon-display";
import { businessTypeIcons } from "./businessTypeIcons";
import { MaterialCategory } from "../types/CategoryModel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
  const { listCategory } = useSelector((state: RootState) => state.category);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");



  useEffect(()=>{
     if (newCategoryName.trim()) {
      setCategory({ ...category, name: newCategoryName.trim() });
      // setShowNewCategoryInput(false);
      // setNewCategoryName("");
    }
  },[newCategoryName])

  return (
    <>
      <div>
        <label className="block text-sm font-medium">Category Name</label>
        <div className="flex gap-2 items-center mt-1">
          <select
            value={category.name || ''}
            onChange={e => setCategory({ ...category, name: e.target.value })}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select a category</option>
            {listCategory && listCategory.map((cat: any) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button
            type="button"
            className="px-2 py-1 rounded bg-blue-500 text-white flex items-center justify-center text-lg font-bold"
            onClick={() => setShowNewCategoryInput(v => !v)}
            title="Add new category"
          >
            +
          </button>
        </div>
        {showNewCategoryInput && (
          <div className="mt-2 flex gap-2 items-center">
            <input
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="block w-full rounded-md border p-2"
              placeholder="New category name"
            />
            {/* <button
              type="button"
              className="px-3 py-1 rounded bg-green-500 text-white"
              onClick={() => {
                if (newCategoryName.trim()) {
                  setCategory({ ...category, name: newCategoryName.trim() });
                  setShowNewCategoryInput(false);
                  setNewCategoryName("");
                }
              }}
            >
              Add
            </button> */}
          </div>
        )}
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Icon</label>
        <div className="mt-1">
          <select
            value={category.icon || ''}
            onChange={e => setCategory({ ...category, icon: e.target.value })}
            className="block w-full rounded-md border p-2"
          >
            <option value="">Select an icon</option>
            {Object.entries(businessTypeIcons).map(([type, svg]) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          {category.icon && businessTypeIcons[category.icon] && (
            <IconSVG svg={businessTypeIcons[category.icon]} />
          )}
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
