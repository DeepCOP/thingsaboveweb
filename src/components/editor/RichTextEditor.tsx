'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    immediatelyRender: false,
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const buttonBase =
    'flex items-center justify-center w-9 h-9 rounded-md text-gray-600 ' +
    'hover:bg-gray-200 transition';

  const active = 'bg-indigo-100 text-indigo-600';

  return (
    <div className="rounded-xl border border-gray-300 bg-gray-700 text-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b bg-gray-50 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${buttonBase} ${editor.isActive('bold') ? active : ''}`}>
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${buttonBase} ${editor.isActive('italic') ? active : ''}`}>
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL');
            if (url) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }}
          className={`${buttonBase} ${editor.isActive('link') ? active : ''}`}>
          <LinkIcon size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="p-4  prose prose-sm max-w-none focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
