"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

type PageBuilderProps = {
  value: string;
  onChange: (html: string) => void;
};

export default function PageBuilder({ value, onChange }: PageBuilderProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: true }),
      Image,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-3 border rounded",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) editor.commands.setContent(value, false);
  }, [value, editor]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 text-xs">
        <button type="button" className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbered</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().setParagraph().run()}>P</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
