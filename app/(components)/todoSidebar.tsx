import React from "react";
import { Plus, Search } from "lucide-react";
import { Todo } from "../utils/types";

interface TodoSidebarProps {
  todos: Todo[];
  searchQuery: string;
  selectedTodo?: Todo | null;
  onSearchChange: (query: string) => void;
  onCreateTodo: () => void;
  onTodoSelect: (todo: Todo) => void;
}

const TodoSidebar: React.FC<TodoSidebarProps> = ({
  todos,
  searchQuery,
  selectedTodo,
  onSearchChange,
  onCreateTodo,
  onTodoSelect,
}) => {
  return (
    <div className="w-72 border-r border-gray-300 flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-gray-800 font-bold">Notes</h1>
          <button
            onClick={onCreateTodo}
            className="text-gray-500 hover:text-blue-500 transition-colors p-2"
            title="New Note (⌘N)">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            id="search-input"
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-gray-800 text-sm w-full focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {todos.map((todo) => (
          <div
            key={todo._id}
            onClick={() => onTodoSelect(todo)}
            className={`p-4 cursor-pointer border-b border-gray-300 ${
              selectedTodo?._id === todo._id
                ? "bg-gray-200"
                : "hover:bg-gray-200"
            }`}>
            <h3 className="text-gray-800 font-medium truncate">
              {todo.title || "Untitled"}
            </h3>
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-0.5 bg-blue-500 bg-opacity-20 text-blue-500 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-gray-600 text-sm truncate mt-1">
              {todo.description.slice(0, 100)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoSidebar;
