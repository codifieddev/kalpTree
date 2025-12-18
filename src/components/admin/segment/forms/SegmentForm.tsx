"use client";

import React from "react";
import { MaterialSegmentModel } from "../types/SegmentModel";
import { IconImg, IconSVG } from "@/components/ui/icon-display";

type SegmentFormProps = {
  segment: MaterialSegmentModel;
  setSegment: React.Dispatch<React.SetStateAction<MaterialSegmentModel>>;
  fieldErrors: Record<string, string>;
};

export default function SegmentForm({
  segment,
  setSegment,
  fieldErrors,
}: SegmentFormProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={segment.name || ""}
          onChange={(e) => setSegment({ ...segment, name: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.name && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <span className="text-gray-400 text-xs font-normal">Optional</span>
        <textarea
          value={segment.description || ""}
          onChange={(e) =>
            setSegment({ ...segment, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Short Code</label>
        <input
          value={segment.short_code || ""}
          onChange={(e) =>
            setSegment({ ...segment, short_code: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.short_code && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.short_code}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Color</label>
        <input
          value={segment.color || ""}
          onChange={(e) => setSegment({ ...segment, color: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Color Code</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={segment.color_code || "#000000"}
            onChange={(e) =>
              setSegment({ ...segment, color_code: e.target.value })
            }
            className="w-12 h-10 p-1 border rounded"
          />
          <input
            type="text"
            value={segment.color_code || ""}
            onChange={(e) =>
              setSegment({ ...segment, color_code: e.target.value })
            }
            className="flex-1 rounded-md border p-2"
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Index</label>
        <input
          type="number"
          value={segment.index ?? 0}
          onChange={(e) =>
            setSegment({
              ...segment,
              index: Number(e.target.value),
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
        {fieldErrors.index && (
          <div className="text-sm text-destructive mt-1">
            {fieldErrors.index}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Icon URL
        </label>
        <div className="space-y-2">
          <input
            type="text"
            name="icon"
            value={segment.icon || ""}
            placeholder="https://example.com/icon.png"
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-shadow"
            onChange={(e) => setSegment({ ...segment, icon: e.target.value })}
          />
          {segment.icon && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-600 font-medium">
                Preview:
              </span>
              <IconImg src={segment.icon} />
            </div>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Icon SVG
        </label>
        <div className="space-y-2">
          <textarea
            name="icon_svg"
            value={segment.icon_svg || ""}
            placeholder='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>'
            rows={3}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono resize-none transition-shadow"
            onChange={(e) =>
              setSegment({ ...segment, icon_svg: e.target.value })
            }
          />
          {segment.icon_svg && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-600 font-medium">
                Preview:
              </span>
              <IconSVG svg={segment.icon_svg as any} />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <label
          htmlFor="segment-is-active"
          className="inline-flex items-center gap-2"
        >
          <input
            id="segment-is-active"
            name="is_active"
            type="checkbox"
            checked={segment.is_active}
            onChange={(e) =>
              setSegment({
                ...segment,
                is_active: e.target.checked,
              })
            }
          />
          <span className="text-sm">Active</span>
        </label>
        <label
          htmlFor="segment-is-visible"
          className="inline-flex items-center gap-2"
        >
          <input
            id="segment-is-visible"
            name="is_visible"
            type="checkbox"
            checked={segment.is_visible}
            onChange={(e) =>
              setSegment({
                ...segment,
                is_visible: e.target.checked,
              })
            }
          />
          <span className="text-sm">Visible</span>
        </label>
      </div>
    </>
  );
}
