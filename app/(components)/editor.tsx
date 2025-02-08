import React, { useState, useEffect } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Trash, Tag, X, Save, Clock, Eye, Edit3 } from "lucide-react";
import { Todo } from "../utils/types";
import { ThemeModeToggle } from "./themeMode";
import { ThemeColorToggle } from "./themeColor";

interface EditorProps {
  todo: Todo;
  title: string;
  description: string;
  tags: string[];
  newTag: string;
  isSaving: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onDeleteTodo: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onNewTagChange: (tag: string) => void;
  onSave: () => void;
}

const Editor: React.FC<EditorProps> = ({
  todo,
  title,
  description,
  tags,
  newTag,
  isSaving,
  onTitleChange,
  onDescriptionChange,
  onDeleteTodo,
  onAddTag,
  onRemoveTag,
  onNewTagChange,
  onSave,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setIsPreview((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      onAddTag(newTag.trim());
    }
  };

  const lastUpdated = new Date(
    todo.updatedAt || todo.createdAt
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const CodeBlock: Components = {
    code({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className={className}
          {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="sticky top-0 bg-background border-b border-gray-300 px-4 py-3 md:p-6 flex justify-between items-center">
        <input
          id="todo-title-input"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-transparent text-primary text-xl font-medium focus:outline-none flex-1 min-w-[200px]"
          placeholder="Note title"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="text-primary hover:text-green-500 transition-colors p-1.5 disabled:opacity-50 rounded-md"
            title="Save (Ctrl + S)">
            <Save className="w-5 h-5" />
          </button>
          {todo.id && (
            <button
              onClick={onDeleteTodo}
              className="text-primary hover:text-red-500 transition-colors p-1.5 rounded-md"
              title="Delete (Ctrl + D)">
              <Trash className="w-5 h-5" />
            </button>
          )}
          <ThemeModeToggle />
          <ThemeColorToggle />
        </div>
      </div>
      <div className="border-b border-gray-300 px-4 py-2 flex items-center gap-2 bg-background">
        <Tag className="w-4 h-4 text-primary" />
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 dark:bg-slate-800 text-sm px-2 py-1 rounded-full flex items-center gap-1">
              <span className="text-primary">{tag}</span>
              <button
                onClick={() => onRemoveTag(tag)}
                className="text-gray-500 hover:text-red-500 p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add tag"
            className="bg-transparent text-primary text-sm focus:outline-none min-w-[80px] flex-1"
          />
        </div>
        <div className="px-4 py-2 text-sm dark:text-gray-200 text-gray-700">
          <Clock className="w-4 h-4 text-primary inline-block mr-2" />
          Last Updated: <strong>{lastUpdated}</strong>
        </div>
      </div>
      <div className="relative flex-1 w-full">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="absolute top-2 right-4 text-primary text-sm hover:underline flex items-center gap-1 z-10">
          {isPreview ? (
            <>
              <Edit3 className="w-4 h-4" /> Edit
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" /> Preview
            </>
          )}
        </button>
        {isPreview ? (
          <div className="h-full w-full overflow-auto bg-background text-black dark:text-white p-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={CodeBlock}
              className="markdown-content prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              {description}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full h-full bg-gray-100 dark:bg-background text-black dark:text-white resize-none focus:outline-none font-mono p-6"
            placeholder="Start writing here... (Supports Markdown)"
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
