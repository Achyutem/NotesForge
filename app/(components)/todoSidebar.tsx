import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { Todo } from "../utils/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface TodoSidebarProps {
  todos: Todo[];
  searchQuery: string;
  selectedTodo?: Todo | null;
  unsavedTitle?: string;
  unsavedTags?: string[];
  hasUnsavedChanges?: boolean | null;
  onSearchChange: (query: string) => void;
  onCreateTodo: () => void;
  onTodoSelect: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoSidebar: React.FC<TodoSidebarProps> = ({
  todos,
  searchQuery,
  selectedTodo,
  unsavedTitle,
  unsavedTags,
  hasUnsavedChanges,
  onSearchChange,
  onCreateTodo,
  onTodoSelect,
  onDeleteTodo,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-background border-gray-300 flex flex-col items-center py-4">
        <button
          onClick={toggleSidebar}
          className="text-primary hover:animate-pulse mb-4"
          title="Expand Sidebar">
          <ChevronsRight className="w-6 h-6" />
        </button>
        <button
          onClick={onCreateTodo}
          className="text-primary hover:animate-pulse"
          title="New Note (ctrl+shift+n)">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-background border-r border-gray-300 flex flex-col h-auto">
      <div className="p-4 border-b border-gray-300 sticky top-0 bg-background z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-primary font-bold">NotesForge</h1>
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-primary hover:animate-pulse mr-2"
              title="Collapse Sidebar(ctrl+B)">
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onCreateTodo}
              className="text-primary hover:animate-pulse p-2"
              title="New Note (ctrl+shift+n)">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-primary mr-2" />
          <input
            id="search-input"
            type="text"
            placeholder="Search notes... (ctrl + f)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-black dark:text-white text-sm w-full focus:outline-none placeholder:font-semibold placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {todos.map((todo) => {
          const isSelected = selectedTodo?.id === todo.id;
          const displayTitle =
            isSelected && hasUnsavedChanges
              ? unsavedTitle || "Untitled"
              : todo.title || "Untitled";
          const displayTags =
            isSelected && hasUnsavedChanges ? unsavedTags : todo.tags;

          return (
            <div
              key={todo.id}
              className={`p-4 cursor-pointer border-b border-gray-300 dark:border-gray-700 flex justify-between items-center ${
                isSelected
                  ? "bg-gray-200 dark:bg-slate-900"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
              onClick={() => onTodoSelect(todo)}>
              <div className="flex-1">
                <h3 className="text-primary dark:text-white font-medium truncate">
                  {displayTitle}
                </h3>
                {displayTags && displayTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {displayTags.map((tag) => (
                      <span
                        key={tag}
                        className="font-semibold inline-block px-2 py-0.5 bg-opacity-20 text-primary text-xs rounded-full dark:bg-slate-800 bg-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-black dark:text-white text-sm truncate mt-1">
                  {todo.description.slice(0, 30)}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 p-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-background">
                  <DropdownMenuItem onClick={() => onTodoSelect(todo)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTodo(todo.id);
                    }}>
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodoSidebar;
