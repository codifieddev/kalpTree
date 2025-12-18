"use client";

import React from "react";
import { MaterialAttributes } from "../types/attributeModel";
import { MaterialCategory } from "../../category/types/CategoryModel";

type AttributeFormProps = {
  attribute: MaterialAttributes;
  setAttribute: React.Dispatch<React.SetStateAction<MaterialAttributes>>;
  fieldErrors: Record<string, string>;
  filterCategory: MaterialCategory[];
};

export default function AttributeForm({
  attribute,
  setAttribute,
  fieldErrors,
  filterCategory,
}: AttributeFormProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={attribute.name || ""}
          onChange={(e) =>
            setAttribute({ ...attribute, name: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={String(attribute.category_id || "")}
          onChange={(e) =>
            setAttribute({
              ...attribute,
              category_id: e.target.value ? (e.target.value as any) : null,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="">Select category</option>
          {filterCategory.map((cat) => (
            <option
              key={String(cat._id || cat.id)}
              value={String(cat._id || cat.id)}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Unit</label>
        <input
          value={attribute.unit || ""}
          onChange={(e) =>
            setAttribute({
              ...attribute,
              unit: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="e.g., kg, cm, pcs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Possible values (comma separated)
        </label>
        <input
          value={(attribute.possible_values || []).join(",")}
          onChange={(e) =>
            setAttribute({
              ...attribute,
              possible_values: e.target.value
                ? e.target.value.split(",").map((v) => v.trim())
                : [],
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="e.g., Red, Blue, Green"
        />
      </div>
    </>
  );
}
