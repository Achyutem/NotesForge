import React, { useState } from "react";
import { Plus, Search, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Todo } from "../utils/types";

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
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-gray-300 flex flex-col items-center py-4">
        <button
          onClick={toggleSidebar}
          className="text-[#652ddf] hover:text-[#bd38cc] transition-colors mb-4"
          title="Expand Sidebar">
          <ChevronsRight className="w-6 h-6" />
        </button>
        <button
          onClick={onCreateTodo}
          className="text-[#652ddf] hover:text-[#bd38cc] transition-colors"
          title="New Note (ctrl+shift+n)">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-gray-300 flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-gray-800 font-bold">Notes</h1>
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-[#652ddf] hover:text-[#bd38cc] transition-colors mr-2"
              title="Collapse Sidebar">
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onCreateTodo}
              className="text-[#652ddf] hover:text-[#bd38cc] transition-colors p-2"
              title="New Note (ctrl+shift+n)">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-[#652ddf] mr-2" />
          <input
            id="search-input"
            type="text"
            placeholder="Search notes... (ctrl + f)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-gray-800 text-sm w-full focus:outline-none"
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
              onClick={() => onTodoSelect(todo)}
              className={`p-4 cursor-pointer border-b border-gray-300 ${
                isSelected ? "bg-gray-200" : "hover:bg-gray-200"
              }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-gray-800 font-medium truncate">
                  {displayTitle}
                </h3>
                {isSelected && hasUnsavedChanges && (
                  <span className="text-xs text-[#652ddf] ml-2">•</span>
                )}
              </div>
              {displayTags && displayTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {displayTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 bg-[#652ddf] bg-opacity-20 text-[#652ddf] text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-600 text-sm truncate mt-1">
                {todo.description.slice(0, 100)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodoSidebar;

// import React, { useState } from "react";
// import { Plus, Search, ChevronsLeft, ChevronsRight } from "lucide-react";
// import { Todo } from "../utils/types";

// interface TodoSidebarProps {
//   todos: Todo[];
//   searchQuery: string;
//   selectedTodo?: Todo | null;
//   onSearchChange: (query: string) => void;
//   onCreateTodo: () => void;
//   onTodoSelect: (todo: Todo) => void;
// }

// const TodoSidebar: React.FC<TodoSidebarProps> = ({
//   todos,
//   searchQuery,
//   selectedTodo,
//   onSearchChange,
//   onCreateTodo,
//   onTodoSelect,
// }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   if (isCollapsed) {
//     return (
//       <div className="w-12 border-r border-gray-300 flex flex-col items-center py-4">
//         <button
//           onClick={toggleSidebar}
//           className="text-[#652ddf] hover:text-[#bd38cc] transition-colors mb-4"
//           title="Expand Sidebar">
//           <ChevronsRight className="w-6 h-6" />
//         </button>
//         <button
//           onClick={onCreateTodo}
//           className="text-[#652ddf] hover:text-[#bd38cc] transition-colors"
//           title="New Note (ctrl+shift+n)">
//           <Plus className="w-5 h-5" />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-72 border-r border-gray-300 flex flex-col">
//       <div className="p-4 border-b border-gray-300">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-gray-800 font-bold">Notes</h1>
//           <div className="flex items-center">
//             <button
//               onClick={toggleSidebar}
//               className="text-[#652ddf] hover:text-[#bd38cc] transition-colors mr-2"
//               title="Collapse Sidebar">
//               <ChevronsLeft className="w-5 h-5" />
//             </button>
//             <button
//               onClick={onCreateTodo}
//               className="text-[#652ddf] hover:text-[#bd38cc] transition-colors p-2"
//               title="New Note (ctrl+shift+n)">
//               <Plus className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//         <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
//           <Search className="w-4 h-4 text-[#652ddf] mr-2" />
//           <input
//             id="search-input"
//             type="text"
//             placeholder="Search notes... (ctrl + f)"
//             value={searchQuery}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="bg-transparent text-gray-800 text-sm w-full focus:outline-none"
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         {todos.map((todo) => (
//           <div
//             key={todo.id}
//             onClick={() => onTodoSelect(todo)}
//             className={`p-4 cursor-pointer border-b border-gray-300 ${
//               selectedTodo?.id === todo.id ? "bg-gray-200" : "hover:bg-gray-200"
//             }`}>
//             <h3 className="text-gray-800 font-medium truncate">
//               {todo.title || "Untitled"}
//             </h3>
//             {todo.tags && todo.tags.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-1">
//                 {todo.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="inline-block px-2 py-0.5 bg-[#652ddf] bg-opacity-20 text-[#652ddf] text-xs rounded-full">
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             )}
//             <p className="text-gray-600 text-sm truncate mt-1">
//               {todo.description.slice(0, 100)}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TodoSidebar;
