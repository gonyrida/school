import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote,
  ImageIcon,
} from 'lucide-react';

interface BlogEditorProps {
  value: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function BlogEditor({ 
  value, 
  onChange, 
  disabled = false,
  placeholder = 'Start writing your blog post...'
}: BlogEditorProps) {
  const prevValueRef = useRef<string>('');
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
  });

  // Handle value changes from parent (for edit mode)
  useEffect(() => {
    if (!editor) return;
    
    // Only update if the new value is different from what we last set
    if (value && value !== prevValueRef.current) {
      prevValueRef.current = value;
      // Clear selection and set new content
      editor.chain().focus().clearContent().run();
      // Use a microtask to ensure DOM is settled before setting content
      Promise.resolve().then(() => {
        if (editor) {
          editor.commands.setContent(value, false);
        }
      });
    }
  }, [editor, value]);

  // Update editable state when disabled changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);
  
  // Cleanup: track that content was set
  useEffect(() => {
    if (value) {
      prevValueRef.current = value;
    }
  }, [value]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
          icon={<Bold className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
          icon={<Italic className="h-4 w-4" />}
        />
        
        <div className="mx-1 w-px bg-gray-300" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
          icon={<Heading1 className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
          icon={<Heading2 className="h-4 w-4" />}
        />
        
        <div className="mx-1 w-px bg-gray-300" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
          icon={<List className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
          icon={<Quote className="h-4 w-4" />}
        />
        
        <div className="mx-1 w-px bg-gray-300" />
        
        <ToolbarButton
          onClick={addImage}
          title="Insert Image"
          icon={<ImageIcon className="h-4 w-4" />}
        />
      </div>

      {/* Editor */}
      <div className="prose prose-sm max-w-none p-4">
        <EditorContent 
          editor={editor} 
          className="min-h-96 focus:outline-none"
        />
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title?: string;
  icon: React.ReactNode;
}

function ToolbarButton({ onClick, active = false, title, icon }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`rounded p-2 transition ${
        active 
          ? 'bg-brand-100 text-brand-700' 
          : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
    </button>
  );
}
