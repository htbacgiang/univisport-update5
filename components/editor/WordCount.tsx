import { FC, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { BsFileText, BsClock, BsType } from "react-icons/bs";

interface Props {
  editor: Editor | null;
}

const WordCount: FC<Props> = ({ editor }): JSX.Element | null => {
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0,
  });

  useEffect(() => {
    if (!editor) return;

    const updateStats = () => {
      const content = editor.getText();
      const htmlContent = editor.getHTML();
      
      // Word count
      const words = content.trim() ? content.trim().split(/\s+/).length : 0;
      
      // Character counts
      const characters = content.length;
      const charactersNoSpaces = content.replace(/\s/g, "").length;
      
      // Paragraph count
      const paragraphs = htmlContent.match(/<p[^>]*>.*?<\/p>/g)?.length || 0;
      
      // Sentence count (rough estimation)
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      
      // Reading time (average reading speed: 200 words per minute)
      const readingTime = Math.ceil(words / 200);
      
      setStats({
        words,
        characters,
        charactersNoSpaces,
        paragraphs,
        sentences,
        readingTime,
      });
    };

    // Update stats on content change
    editor.on('update', updateStats);
    
    // Initial calculation
    updateStats();

    return () => {
      editor.off('update', updateStats);
    };
  }, [editor]);

  // Early return after all hooks
  if (!editor) return null;

  return (
    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
      <div className="flex items-center space-x-1">
        <BsFileText className="text-blue-500" />
        <span>{stats.words} words</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <BsType className="text-green-500" />
        <span>{stats.characters} chars</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <BsClock className="text-purple-500" />
        <span>{stats.readingTime} min read</span>
      </div>
      
      <div className="text-xs text-gray-500">
        {stats.paragraphs} paragraphs • {stats.sentences} sentences
      </div>
    </div>
  );
};

export default WordCount;
