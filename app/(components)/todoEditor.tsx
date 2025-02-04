import React from "react";
import { Trash, Tag, X, Save, Clock } from "lucide-react";
import { Todo } from "../utils/types";
import { ThemeModeToggle } from "./themeMode";
import { ThemeColorToggle } from "./themeColor";

interface TodoEditorProps {
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

const TodoEditor: React.FC<TodoEditorProps> = ({
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
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-gray-300 px-4 py-3 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <input
              id="todo-title-input"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent text-primary text-xl font-medium focus:outline-none flex-1 min-w-[200px]"
              placeholder="Note title"
            />
            <div className="flex items-center gap-2 ml-auto">
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

          <div className="text-gray-400 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>
              Last Updated: <strong>{lastUpdated}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Tag className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex flex-wrap gap-2 items-center flex-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 dark:bg-gray-800 text-sm px-2 py-1 rounded-full flex items-center gap-1">
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
          </div>
        </div>

        <div className="space-y-4 h-full">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full h-full bg-gray-100 dark:bg-background text-black dark:text-white resize-none focus:outline-none font-mono p-3 rounded-lg"
            placeholder="Start writing here... (Supports Markdown)"
          />
        </div>
      </div>
    </div>
  );
};

export default TodoEditor;
