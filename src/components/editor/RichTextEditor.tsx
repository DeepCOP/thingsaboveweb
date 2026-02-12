'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), TextStyle, FontSize],
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
  const selectBase =
    'h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 ' +
    'hover:bg-gray-100 focus:outline-none';

  const fontSizes = [
    { label: 'Default', value: '' },
    { label: '12', value: '12px' },
    { label: '14', value: '14px' },
    { label: '16', value: '16px' },
    { label: '18', value: '18px' },
    { label: '20', value: '20px' },
    { label: '24', value: '24px' },
    { label: '28', value: '28px' },
    { label: '32', value: '32px' },
  ];

  return (
    <div className="rounded-xl border border-gray-300 bg-gray-700 text-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b bg-gray-50 p-2">
        <select
          aria-label="Font size"
          className={selectBase}
          value={editor.getAttributes('textStyle').fontSize || ''}
          onChange={(event) => {
            const fontSize = event.target.value;
            if (fontSize) {
              editor.chain().focus().setFontSize(fontSize).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}>
          {fontSizes.map((size) => (
            <option key={size.label} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

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
