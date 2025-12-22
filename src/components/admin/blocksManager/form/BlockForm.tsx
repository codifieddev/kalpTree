import React, { useState } from "react";
import { BlockManagerModel } from "../types/BlockManagerModel";

interface BlockFormProps {
  initialData?: Partial<BlockManagerModel>;
  onSubmit: (data: BlockManagerModel) => void;
  submitLabel?: string;
}

export const BlockForm: React.FC<BlockFormProps> = ({
  initialData = {},
  onSubmit,
  submitLabel = "Save",
}) => {
  const [form, setForm] = useState<BlockManagerModel>({
    label: initialData.label || "",
    category: initialData.category || "",
    content: initialData.content || "",
    styles: initialData.styles || {},
    premium: initialData.premium || false,
    icon: initialData.icon || "",
  });

  // Separate textarea state for styles JSON
  const [stylesInput, setStylesInput] = useState(
    initialData.styles ? JSON.stringify(initialData.styles, null, 2) : ""
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStylesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setStylesInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let stylesObj = {};
    try {
      stylesObj = stylesInput ? JSON.parse(stylesInput) : {};
    } catch {
      alert("Invalid JSON in Styles field");
      return;
    }

    // Transform label to lowercase and replace spaces with '-'
    const id = form.label.toLowerCase().replace(/\s+/g, "-");
    onSubmit({ ...form, styles: stylesObj, id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {/* Label */}
      <div>
        <label className="block font-medium mb-1">Label</label>
        <input
          type="text"
          name="label"
          value={form.label}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Block label"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="e.g. Basic, Layout"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block font-medium mb-1">Content (HTML)</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          rows={4}
          placeholder="<div>Hello World</div>"
        />
      </div>

      {/* Icon */}
      <div>
        <label className="block font-medium mb-1">Icon</label>
        <input
          type="text"
          name="icon"
          value={form.icon}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="e.g. fa-solid fa-box"
        />
      </div>

      {/* Premium */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="premium"
          checked={form.premium}
          onChange={handleChange}
          className="checkbox"
        />
        <label className="font-medium">Premium Block</label>
      </div>

      {/* Styles */}
      <div>
        <label className="block font-medium mb-1">
          Styles (JSON)
        </label>
        <textarea
          value={stylesInput}
          onChange={handleStylesChange}
          className="textarea textarea-bordered w-full font-mono"
          rows={5}
          placeholder={`{
  "backgroundColor": "#fff",
  "padding": "10px"
}`}
        />
      </div>

      {/* Submit */}
      <button type="submit" className="btn btn-primary w-full">
        {submitLabel}
      </button>
    </form>
  );
};
