import React from "react";
import { Trash, Tag, X, Save } from "lucide-react";
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

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="border-b border-gray-300 pb-4">
          <div className="flex justify-between items-center mb-4">
            <input
              id="todo-title-input"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent text-black text-xl font-medium focus:outline-none flex-1"
              placeholder="Note title"
            />
            <div className="flex gap-2">
              <button
                onClick={onSave}
                disabled={isSaving}
                className="text-[#652ddf] hover:text-green-500 transition-colors p-2 disabled:opacity-50"
                title="Save (Ctrl/Cmd + S)">
                <Save className="w-5 h-5" />
              </button>
              {todo.id && (
                <button
                  onClick={onDeleteTodo}
                  className="text-[#652ddf] hover:text-red-500 transition-colors p-2"
                  title="Delete">
                  <Trash className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#652ddf]" />
            <div className="flex gap-2 items-center flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="text-gray-800">{tag}</span>
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="text-gray-500 hover:text-red-500">
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
                className="bg-transparent text-black text-sm focus:outline-none w-20"
              />
            </div>
          </div>
        </div>
        <div className="prose max-w-none">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full h-40 bg-gray-100 text-gray-800 resize-none focus:outline-none font-mono p-2"
            placeholder="Start writing here... (Supports Markdown)"
          />
          <MarkdownPreview content={description} />
        </div>
      </div>
    </div>
  );
};

export default TodoEditor;
