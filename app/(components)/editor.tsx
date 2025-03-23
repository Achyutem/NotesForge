import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown, { Components } from "react-markdown";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  LogOut,
  Trash,
  Tag,
  X,
  Save,
  Clock,
  Eye,
  Edit3,
  Upload,
} from "lucide-react";
import { Todo } from "../utils/types";
import { Theme } from "./themeColor";
import { logout } from "../utils/logout";

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
  const [lastUpdated, setLastUpdated] = useState("");

  const transition = { duration: 0.25, ease: "easeInOut" };

  const editorVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.98 },
  };

  const previewVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.98 },
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      setIsPreview((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      onAddTag(newTag.trim());
    }
  };

  useEffect(() => {
    const updateLastUpdated = () => {
      if (todo.updatedAt || todo.createdAt) {
        const updatedTime = new Date(todo.updatedAt || todo.createdAt);
        const now = new Date();
        const diffInMs = now.getTime() - updatedTime.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        let newLastUpdated = "Just now";
        if (diffInMinutes >= 1)
          newLastUpdated = `${diffInMinutes} minute${
            diffInMinutes !== 1 ? "s" : ""
          } ago`;
        if (diffInHours >= 1)
          newLastUpdated = `${diffInHours} hour${
            diffInHours !== 1 ? "s" : ""
          } ago`;
        if (diffInDays >= 1)
          newLastUpdated = `${diffInDays} day${
            diffInDays !== 1 ? "s" : ""
          } ago`;

        const formattedDate = updatedTime.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        if (diffInDays >= 7) newLastUpdated = formattedDate;

        setLastUpdated((prev) =>
          prev !== newLastUpdated ? newLastUpdated : prev
        );
      }
    };

    updateLastUpdated();
    const interval = setInterval(updateLastUpdated, 60000);

    return () => clearInterval(interval);
  }, [todo.updatedAt, todo.createdAt]);

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
          wrapLongLines={true}
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
            className="text-primary hover:animate-pulse p-1.5 disabled:opacity-50 rounded-md"
            title="Save (Ctrl + S)"
            aria-label="Save">
            <Save className="w-5 h-5" />
          </button>
          {todo.id && (
            <button
              onClick={onDeleteTodo}
              className="text-primary hover:animate-pulse p-1.5 rounded-md"
              title="Delete (Ctrl + D)">
              <Trash className="w-5 h-5" />
            </button>
          )}
          <button
            className="text-primary hover:animate-pulse p-1.5 rounded-md"
            onClick={async () => {
              try {
                const response = await fetch("/api/export");
                if (response.ok) {
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "todos.csv";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                } else {
                  console.error("Failed to export todos");
                }
              } catch (error) {
                console.error("Error exporting todos:", error);
              }
            }}
            title="Export Todos">
            <Upload className="w-5 h-5" />
          </button>
          <Theme />
          <button
            onClick={onSave}
            title="Logout"
            className="pl-2">
            <LogOut
              onClick={logout}
              className="text-red-500 hover:animate-bounce"
            />
          </button>
        </div>
      </div>
      <div className="border-b border-gray-300 px-4 py-2 flex items-center gap-2 bg-background">
        <Tag className="w-4 h-4 text-primary" />
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 font-semibold dark:bg-slate-800 text-sm px-2 py-1 rounded-full flex items-center gap-1">
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
        <div className="px-4 py-2 text-sm flex items-center gap-2 dark:text-gray-200 text-gray-700">
          <Clock className="w-4 h-4 text-primary inline-block" />
          Last Updated: <strong>{lastUpdated}</strong>
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="text-primary hover:animate-pulse p-1.5 rounded-md">
                <HelpCircle className="w-5 h-5" />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent asChild>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-80 p-4 text-sm bg-background border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl">
                <h3 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
                  Markdown Guide
                </h3>
                <div className="overflow-auto max-h-72 space-y-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                  <pre className="whitespace-pre-wrap">
                    {`# Headings
# H1
## H2
### H3

**Bold**:  **text**
_Italic_:  *text*
\`Inline Code\`:  \`code\`

## Lists
- Item 1
- Item 2

## Links
[Example](https://example.com)
Syntax:  \`[Text](URL)\`

## Code Block
\`\`\`js
console.log("Hello, Markdown!");
\`\`\`

## Tables
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |`}
                  </pre>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="relative flex-1 w-full overflow-hidden">
        <button
          onClick={() => setIsPreview(!isPreview)}
          title="Toggle Preview (Ctrl + P)"
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
        <AnimatePresence mode="wait">
          {isPreview ? (
            <motion.div
              key="preview"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={previewVariants}
              transition={transition}
              className="h-full w-full overflow-auto bg-background text-black dark:text-white p-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={CodeBlock}
                className="markdown-content prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                {description}
              </ReactMarkdown>
            </motion.div>
          ) : (
            <motion.textarea
              key="editor"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={editorVariants}
              transition={transition}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full h-full bg-gray-100 dark:bg-background text-black dark:text-white resize-none focus:outline-none font-mono p-6"
              placeholder="Start writing here... (Supports Markdown)"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Editor;
