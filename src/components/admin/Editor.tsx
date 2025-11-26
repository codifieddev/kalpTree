
// "use client";
// import { useState, useTransition } from "react";

// // Field configuration type
// export type FieldConfig = {
//   name: string;
//   label: string;
//   type: "text" | "textarea" | "select" | "readonly" | "array";
//   options?: { value: string; label: string }[];
//   side: "left" | "right" | "NA";
//   placeholder?: string;
//   rows?: number;
// };

// type PageEditorProps = {
//   id: string;
//   item: any;
//   fields: FieldConfig[];
//   apiEndpoint?: string;
//   onDeleteRedirect?: string;
// };

// export default function PageEditor({
//   id,
//   item,
//   fields,
//   apiEndpoint = "/api/pages",
//   onDeleteRedirect = "/admin/pages",
// }: PageEditorProps) {
  
//   // Single state object for all form data
//   const [formData, setFormData] = useState(() => {
//     const initialData: Record<string, any> = {};
//     fields.forEach((field) => {
//       if (field.type !== "readonly") {
//         initialData[field.name] = item[field.name] || "";
//       }
//     });
//     return initialData;
//   });

//   const [saving, start] = useTransition();
//   const [msg, setMsg] = useState<string | null>(null);

//   // Generic change handler
//   const handleChange = (name: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setMsg(null);
//     start(async () => {
//       const res = await fetch(`${apiEndpoint}/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       setMsg(res.ok ? "Saved" : "Save failed");
//     });
//   };

//   const handleDelete = async () => {
//     if (!confirm("Delete this page?")) return;
//     const res = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
//     if (res.ok) {
//       window.location.href = onDeleteRedirect;
//     } else {
//       setMsg("Delete failed");
//     }
//   };

//   // Render individual field
//   const renderField = (field: FieldConfig) => {
//     const { name, label, type, options, placeholder, rows } = field;

//     if (type === "readonly") {
//       return (
//         <div key={name}>
//           <span className="font-medium">{label}: </span>
//           <span className="font-normal">{item[name]}</span>
//         </div>
//       );
//     }

//     return (
//       <div key={name}>
//         <label className="text-sm block mb-1">{label}</label>
//         {type === "text" && (
//           <input
//             className="border p-2 w-full rounded"
//             value={formData[name] || ""}
//             onChange={(e) => handleChange(name, e.target.value)}
//             placeholder={placeholder}
//           />
//         )}
//         {type === "textarea" && (
//           <textarea
//             className="border p-2 w-full rounded"
//             value={formData[name] || ""}
//             onChange={(e) => handleChange(name, e.target.value)}
//             placeholder={placeholder}
//             rows={rows || 6}
//           />
//         )}
//         {type === "select" && options && (
//           <select
//             className="border p-2 w-full rounded"
//             value={formData[name] || ""}
//             onChange={(e) => handleChange(name, e.target.value)}
//           >
//             {options.map((opt) => (
//               <option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </option>
//             ))}
//           </select>
//         )}
//       </div>
//     );
//   };

//   // Separate fields by side
//   const leftFields = fields.filter((f) => f.side === "left");
//   const rightFields = fields.filter((f) => f.side === "right");
//   const readonlyFields = fields.filter((f) => f.type === "readonly");

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex gap-4">
//           {readonlyFields.map((field) => renderField(field))}
//         </div>
//         <div className="flex gap-2">
//           <button
//             type="button"
//             className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//             onClick={handleDelete}
//           >
//             Delete
//           </button>
//           <button
//             type="button"
//             className="px-3 py-2 rounded bg-black text-white disabled:opacity-60 hover:bg-gray-800"
//             disabled={saving}
//             onClick={onSubmit}
//           >
//             {saving ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Left side */}
//         <div className="md:w-8/12 p-4 space-y-4 bg-white rounded border">
//           {leftFields.map((field) => renderField(field))}
//           {msg && <span className="text-sm text-green-600">{msg}</span>}
//         </div>

//         {/* Right side */}
//         <div className="md:w-4/12 p-4 space-y-4 bg-gray-50 rounded border">
//           {rightFields.map((field) => renderField(field))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useTransition } from "react";

// Field configuration type
export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "readonly" | "array";
  options?: { value: string; label: string }[];
  side: "left" | "right" | "NA";
  placeholder?: string;
  rows?: number;
  nestedKey?: string; // For nested objects like author.userId
};

type PageEditorProps = {
  id: string;
  item: any;
  fields: FieldConfig[];
  apiEndpoint?: string;
  onDeleteRedirect?: string;
};

export default function PageEditor({
  id,
  item,
  fields,
  apiEndpoint = "/api/pages",
  onDeleteRedirect = "/admin/pages",
}: PageEditorProps) {
  // Single state object for all form data
  const [formData, setFormData] = useState(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      if (field.type !== "readonly") {
        const { name, type, nestedKey } = field;
        
        // Handle nested objects (e.g., author.userId)
        if (nestedKey && item[name] && typeof item[name] === 'object') {
          initialData[name] = item[name][nestedKey] || "";
        }
        // Handle arrays
        else if (type === "array") {
          initialData[name] = Array.isArray(item[name]) ? item[name] : [];
        }
        // Handle regular fields
        else {
          initialData[name] = item[name] || "";
        }
      }
    });
    return initialData;
  });




  const [saving, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  // Generic change handler
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Array field handlers
  const handleArrayAdd = (name: string) => {
    const currentArray = formData[name] || [];
    setFormData((prev) => ({ ...prev, [name]: [...currentArray, ""] }));
  };

  const handleArrayChange = (name: string, index: number, value: string) => {
    const currentArray = [...(formData[name] || [])];
    currentArray[index] = value;
    setFormData((prev) => ({ ...prev, [name]: currentArray }));
  };

  const handleArrayRemove = (name: string, index: number) => {
    const currentArray = [...(formData[name] || [])];
    currentArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [name]: currentArray }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      // Transform formData to handle nested objects
      const transformedData = { ...formData };
      console.log("====>>>>", transformedData)
      
      // fields.forEach((field) => {
      //   if (field.nestedKey && transformedData[field.name]) {
      //     // Convert flat value back to nested object
      //     // e.g., author: "userId123" -> author: { userId: "userId123" }
      //     transformedData[field.name] = {
      //       [field.nestedKey]: transformedData[field.name]
      //     };
      //   }
      // });
      
      const res = await fetch(`${apiEndpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });
      setMsg(res.ok ? "Saved" : "Save failed");
    });
  };

  const handleDelete = async () => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = onDeleteRedirect;
    } else {
      setMsg("Delete failed");
    }
  };

  // Render individual field
  const renderField = (field: FieldConfig) => {
    const { name, label, type, options, placeholder, rows, nestedKey } = field;

    if (type === "readonly") {
      const value = nestedKey && item[name] && typeof item[name] === 'object' 
        ? item[name][nestedKey] 
        : item[name];
      
      return (
        <div key={name}>
          <span className="font-medium">{label}: </span>
          <span className="font-normal">{value || "N/A"}</span>
        </div>
      );
    }

    if (type === "array") {
      const arrayValue = formData[name] || [];
      return (
        <div key={name} className="space-y-2">
          <label className="text-sm block font-medium">{label}</label>
          <div className="space-y-2">
            {arrayValue.map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  className="border p-2 flex-1 rounded"
                  value={item}
                  onChange={(e) => handleArrayChange(name, index, e.target.value)}
                  placeholder={placeholder}
                />
                <button
                  type="button"
                  className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleArrayRemove(name, index)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm"
              onClick={() => handleArrayAdd(name)}
            >
              + Add {label}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={name}>
        <label className="text-sm block mb-1">{label}</label>
        {type === "text" && (
          <input
            className="border p-2 w-full rounded"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
          />
        )}
        {type === "textarea" && (
          <textarea
            className="border p-2 w-full rounded"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
            placeholder={placeholder}
            rows={rows || 6}
          />
        )}
        {type === "select" && options && (
          <select
            className="border p-2 w-full rounded"
            value={formData[name] || ""}
            onChange={(e) => handleChange(name, e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Separate fields by side
  const leftFields = fields.filter((f) => f.side === "left");
  const rightFields = fields.filter((f) => f.side === "right");
  const readonlyFields = fields.filter((f) => f.type === "readonly");

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex gap-4 flex-wrap">
          {readonlyFields.map((field) => renderField(field))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded bg-black text-white disabled:opacity-60 hover:bg-gray-800"
            disabled={saving}
            onClick={onSubmit}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left side */}
        <div className="md:w-8/12 p-4 space-y-4 bg-white rounded border">
          {leftFields.map((field) => renderField(field))}
          {msg && <span className="text-sm text-green-600">{msg}</span>}
        </div>

        {/* Right side */}
        <div className="md:w-4/12 p-4 space-y-4 bg-gray-50 rounded border">
          {rightFields.map((field) => renderField(field))}
        </div>
      </div>
    </div>
  );
}

