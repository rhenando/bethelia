"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] px-3 py-2 border rounded-md focus:outline-none bg-white",
      },
    },
  });

  // Prevent memory leak on hot reload
  useEffect(() => {
    return () => {
      editor?.destroy?.();
    };
  }, [editor]);

  // Toolbar actions (customize as needed)
  if (!editor) return null;

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-2'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "font-bold text-primary" : ""}
        >
          Bold
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "italic text-primary" : ""}
        >
          Italic
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "text-primary" : ""}
        >
          • List
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph") ? "underline text-primary" : ""
          }
        >
          P
        </button>
        <button
          type='button'
          onClick={() => {
            const url = prompt("Paste image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          Img
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
