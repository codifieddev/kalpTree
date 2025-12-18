"use client";

import React from "react";
import { MaterialBrandModel } from "../types/brandModel";

type BrandFormProps = {
  brand: MaterialBrandModel;
  setBrand: React.Dispatch<React.SetStateAction<MaterialBrandModel>>;
  fieldErrors: Record<string, string>;
  handleLogoFile: (file?: File) => void;
};

export default function BrandForm({
  brand,
  setBrand,
  fieldErrors,
  handleLogoFile,
}: BrandFormProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={brand.name || ""}
          onChange={(e) => setBrand({ ...brand, name: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">URL</label>
        <input
          value={brand.url || ""}
          onChange={(e) => setBrand({ ...brand, url: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.url && (
          <div className="text-sm text-destructive mt-1">{fieldErrors.url}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleLogoFile(e.target.files ? e.target.files[0] : undefined)
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
        {brand.logo && (
          <div className="mt-2">
            <img
              src={brand.logo}
              alt="logo preview"
              className="h-16 object-contain"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={brand.description || ""}
          onChange={(e) => setBrand({ ...brand, description: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
        />
      </div>
    </>
  );
}
