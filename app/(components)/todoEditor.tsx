import React from "react";
import { Trash, Tag, X, Save, Clock } from "lucide-react";
import MarkdownPreview from "../(components)/markdownParser";
import { Todo } from "../utils/types";

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
        <div className="sticky top-0 bg-white border-b border-gray-300 px-4 py-3 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <input
              id="todo-title-input"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent text-black text-xl font-medium focus:outline-none flex-1 min-w-[200px]"
              placeholder="Note title"
            />
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onSave}
                disabled={isSaving}
                className="text-[#652ddf] hover:text-green-500 transition-colors p-1.5 disabled:opacity-50 rounded-md"
                title="Save (Ctrl + S)">
                <Save className="w-5 h-5" />
              </button>
              {todo.id && (
                <button
                  onClick={onDeleteTodo}
                  className="text-[#652ddf] hover:text-red-500 transition-colors p-1.5 rounded-md"
                  title="Delete (Ctrl + D)">
                  <Trash className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="text-gray-500 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#652ddf]" />
            <span>
              Last Updated: <strong>{lastUpdated}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Tag className="w-4 h-4 text-[#652ddf] flex-shrink-0" />
            <div className="flex flex-wrap gap-2 items-center flex-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="text-gray-800">{tag}</span>
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
                className="bg-transparent text-black text-sm focus:outline-none min-w-[80px] flex-1"
              />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div className="w-full">
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full h-40 bg-gray-100 text-gray-800 resize-none focus:outline-none font-mono p-3 rounded-lg"
              placeholder="Start writing here... (Supports Markdown)"
            />
          </div>

          <div className="prose prose-sm md:prose max-w-none">
            <MarkdownPreview content={description} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoEditor;
