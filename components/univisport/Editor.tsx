import { FC, useEffect, useState, useRef } from "react";
import { useEditor, EditorContent, getMarkRange, Range } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import TipTapImage from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import ToolBar from "../editor/ToolBar";
import EditLink from "../editor/Link/EditLink";
import GalleryModal, { ImageSelectionResult } from "../editor/GalleryModal";
import axios from "axios";
import { InternalLink } from "../editor/InternalLink";

interface Props {
  content: string; // Initial content value
  onChange: (content: string) => void; // Callback to update content in parent
}

const Editor: FC<Props> = ({ content, onChange }): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ src: string }[]>([]);
  const isInternalUpdateRef = useRef(false);
  const lastEditorContentRef = useRef<string>('');

  const fetchImages = async () => {
    const { data } = await axios("/api/image");
    setImages(data.images);
  };

  const handleImageUpload = async (image: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);
    const { data } = await axios.post("/api/image", formData);
    setUploading(false);
    setImages([data, ...images]);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      InternalLink.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: "",
        },
      }),
      Placeholder.configure({
        placeholder: "Viết mô tả sản phẩm chuẩn SEO",
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video",
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: "mx-auto",
        },
      }),
    ],
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view;
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link
        );
        if (selectionRange) setSelectionRange(selectionRange);
      },
      attributes: {
        class:
          "blog prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full",
      },
    },
    content: content, // Set initial content
    onUpdate: ({ editor }) => {
      isInternalUpdateRef.current = true; // Mark this as internal update
      const html = editor.getHTML();
      lastEditorContentRef.current = html;
      onChange(html); // Update parent on content change
      
      // Reset flag after a microtask to allow parent state to update
      Promise.resolve().then(() => {
        isInternalUpdateRef.current = false;
      });
    },
  });

  const handleImageSelection = (result: ImageSelectionResult) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: result.src, alt: result.altText })
      .run();
  };

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!editor) return;
    
    // Skip update if this change came from the editor itself
    if (isInternalUpdateRef.current) {
      return;
    }
    
    // Check if content prop is different from what's in the editor
    const editorContent = editor.getHTML();
    
    // Only update if content prop is different AND it's not the same as last known editor content
    if (content !== editorContent && content !== lastEditorContentRef.current) {
      // This is an external update (e.g., from form reset or prop change)
      const { from, to } = editor.state.selection;
      editor.commands.setContent(content, false); // false = don't emit update event
      lastEditorContentRef.current = content;
      
      // Restore cursor position if possible
      requestAnimationFrame(() => {
        if (editor && !editor.isDestroyed) {
          const docSize = editor.state.doc.content.size;
          if (docSize > 0) {
            const newFrom = Math.min(from, Math.max(0, docSize - 1));
            const newTo = Math.min(to, Math.max(0, docSize - 1));
            try {
              editor.commands.setTextSelection({ from: newFrom, to: newTo });
            } catch (e) {
              // If selection fails, just set to end
              editor.commands.setTextSelection(docSize - 1);
            }
          }
        }
      });
    }
  }, [content, editor]);

  return (
    <>
      <div className="dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-lg transition flex flex-col bg-white overflow-hidden">
        <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 text-gray-800 dark:text-white shadow-sm border-b border-gray-200 dark:border-slate-700">
          <ToolBar
            editor={editor}
            onOpenImageClick={() => setShowGallery(true)}
          />
        </div>

        {editor ? <EditLink editor={editor} /> : null}
        <div className="flex-1 overflow-y-auto max-h-[600px] p-4 bg-white dark:bg-slate-900 custom-scrollbar blog">
          <EditorContent editor={editor} className="min-h-[300px] prose max-w-full mx-auto focus:outline-none" />
          <style jsx>{`
            .blog :global(table) { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; width: max-content !important; margin: 1.5em auto !important; border-collapse: collapse; border: 1px solid #d1d5db; }
            .blog :global(td), .blog :global(th) { padding: 0.5em 0.5em; border: 1px solid #d1d5db; text-align: left; vertical-align: top; }
            .blog :global(th) { background-color: #f3f4f6; font-weight: 600; color: #111827; }
            .blog :global(td p), .blog :global(th p) { text-align: left !important; margin: 0; }
            :global(.dark) .blog :global(table) { border-color: #4b5563; }
            :global(.dark) .blog :global(td), :global(.dark) .blog :global(th) { border-color: #4b5563; }
            :global(.dark) .blog :global(th) { background-color: #374151; color: #f9fafb; }
          `}</style>
        </div>
      </div>

      <GalleryModal
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        onFileSelect={handleImageUpload}
        uploading={uploading}
        images={images}
      />
    </>
  );
};

export default Editor;
