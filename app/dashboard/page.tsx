"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash, Search, Tag, X } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  tags?: string[];
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "n":
            e.preventDefault();
            createNewTodo();
            break;
          case "f":
            e.preventDefault();
            document.getElementById("search-input")?.focus();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/todos");
      const fetchedTodos = Array.isArray(response.data.existingTodos)
        ? response.data.existingTodos
        : [];
      setTodos(fetchedTodos);

      if (!selectedTodo && fetchedTodos.length > 0) {
        setSelectedTodo(fetchedTodos[0]);
        setEditTitle(fetchedTodos[0].title);
        setEditDescription(fetchedTodos[0].description);
        setEditTags(fetchedTodos[0].tags || []);
      }
    } catch (err) {
      setError("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, []);

  const startAutoSave = useCallback(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(saveCurrentNote, 1000);
    setAutoSaveTimer(timer);
  }, [autoSaveTimer]);

  const saveCurrentNote = async () => {
    if (!selectedTodo || (!editTitle.trim() && !editDescription.trim())) return;

    try {
      if (selectedTodo._id) {
        await axios.patch(`/api/todos?id=${selectedTodo._id}`, {
          title: editTitle || "Untitled",
          description: editDescription,
          tags: editTags,
        });
      } else {
        const response = await axios.post("/api/todos", {
          title: editTitle || "Untitled",
          description: editDescription,
          tags: editTags,
        });
        setSelectedTodo(response.data.todo);
      }
      await fetchTodos();
    } catch (err) {
      setError("Failed to save note.");
    }
  };

  const createNewTodo = () => {
    const newTodo = {
      _id: "",
      title: "",
      description: "",
      completed: false,
      tags: [],
    };
    setSelectedTodo(newTodo);
    setEditTitle("");
    setEditDescription("");
    setEditTags([]);
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`/api/todos?id=${id}`);
      await fetchTodos();
      setSelectedTodo(null);
      setEditTitle("");
      setEditDescription("");
      setEditTags([]);
    } catch (err) {
      setError("Failed to delete note.");
    }
  };

  const handleTodoSelect = (todo: Todo) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      saveCurrentNote();
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedTodo(todo);
      setEditTitle(todo.title);
      setEditDescription(todo.description);
      setEditTags(todo.tags || []);
      setIsTransitioning(false);
    }, 200); // delay to allow transition effect
  };

  // Filter todos by search query
  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!editTags.includes(newTag.trim())) {
        setEditTags([...editTags, newTag.trim()]);
        setNewTag("");
        startAutoSave();
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
    startAutoSave();
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-black">
      <div className="w-72 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-gray-300 font-medium">Notes</h1>
            <button
              onClick={createNewTodo}
              className="text-gray-400 hover:text-[#A594F9] transition-colors p-2"
              title="New Note (⌘N)">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center bg-gray-900 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              id="search-input"
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-gray-300 text-sm w-full focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTodos.map((todo) => (
            <div
              key={todo._id}
              onClick={() => handleTodoSelect(todo)}
              className={`p-4 cursor-pointer border-b border-gray-800 ${
                selectedTodo?._id === todo._id
                  ? "bg-gray-900"
                  : "hover:bg-gray-900"
              }`}>
              <h3 className="text-gray-300 font-medium truncate">
                {todo.title || "Untitled"}
              </h3>
              {todo.tags && todo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {todo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 bg-[#A594F9] bg-opacity-20 text-[#A594F9] text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-500 text-sm truncate mt-1">
                {todo.description.slice(0, 100)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedTodo ? (
          <div
            className={`flex-1 overflow-y-auto p-6 transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}>
            <div className="border-b border-gray-800 pb-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    startAutoSave();
                  }}
                  className="bg-transparent text-white text-xl font-medium focus:outline-none flex-1"
                  placeholder="Note title"
                />
                {selectedTodo._id && (
                  <button
                    onClick={() => deleteTodo(selectedTodo._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Delete">
                    <Trash className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#A594F9]" />
                <div className="flex gap-2 items-center flex-wrap">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-900 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-gray-300">{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tag"
                    className="bg-transparent text-white text-sm focus:outline-none w-20"
                  />
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <textarea
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                  startAutoSave();
                }}
                className="w-full h-40 bg-transparent text-gray-300 resize-none focus:outline-none font-mono"
                placeholder="Start writing here... (Supports Markdown)"
              />
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {editDescription || "No content"}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { Plus, Trash, Search, Tag, X } from "lucide-react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// interface Todo {
//   _id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   tags?: string[];
// }

// const CheckboxComponent = ({ checked }: { checked: boolean }) => (
//   <input
//     type="checkbox"
//     checked={checked}
//     readOnly
//     className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-800 checked:bg-[#A594F9] checked:border-[#A594F9] focus:ring-[#A594F9] focus:ring-offset-gray-900"
//   />
// );

// const Todos = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
//     null
//   );
//   const [editTags, setEditTags] = useState<string[]>([]);
//   const [newTag, setNewTag] = useState("");

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.metaKey || e.ctrlKey) {
//         switch (e.key) {
//           case "n":
//             e.preventDefault();
//             createNewTodo();
//             break;
//           case "f":
//             e.preventDefault();
//             document.getElementById("search-input")?.focus();
//             break;
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   const fetchTodos = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/todos");
//       const fetchedTodos = Array.isArray(response.data.existingTodos)
//         ? response.data.existingTodos
//         : [];
//       setTodos(fetchedTodos);

//       if (!selectedTodo && fetchedTodos.length > 0) {
//         setSelectedTodo(fetchedTodos[0]);
//         setEditTitle(fetchedTodos[0].title);
//         setEditDescription(fetchedTodos[0].description);
//         if (fetchedTodos[0].tags) setEditTags(fetchedTodos[0].tags);
//       }
//     } catch (err) {
//       setError("Failed to fetch notes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//     return () => {
//       if (autoSaveTimer) clearTimeout(autoSaveTimer);
//     };
//   }, []);

//   const startAutoSave = useCallback(() => {
//     if (autoSaveTimer) clearTimeout(autoSaveTimer);
//     const timer = setTimeout(saveCurrentNote, 1000);
//     setAutoSaveTimer(timer);
//   }, [autoSaveTimer]);

//   const saveCurrentNote = async () => {
//     if (!selectedTodo || (!editTitle.trim() && !editDescription.trim())) return;

//     try {
//       if (selectedTodo._id) {
//         await axios.patch(`/api/todos?id=${selectedTodo._id}`, {
//           title: editTitle || "Untitled",
//           description: editDescription,
//           tags: editTags,
//         });
//       } else {
//         const response = await axios.post("/api/todos", {
//           title: editTitle || "Untitled",
//           description: editDescription,
//           tags: editTags,
//         });
//         setSelectedTodo(response.data.todo);
//       }
//       await fetchTodos();
//     } catch (err) {
//       setError("Failed to save note.");
//     }
//   };

//   const createNewTodo = () => {
//     const newTodo = {
//       _id: "",
//       title: "",
//       description: "",
//       completed: false,
//       tags: [],
//     };
//     setSelectedTodo(newTodo);
//     setEditTitle("");
//     setEditDescription("");
//     setEditTags([]);
//   };

//   const deleteTodo = async (id: string) => {
//     try {
//       await axios.delete(`/api/todos?id=${id}`);
//       await fetchTodos();
//       setSelectedTodo(null);
//       setEditTitle("");
//       setEditDescription("");
//       setEditTags([]);
//     } catch (err) {
//       setError("Failed to delete note.");
//     }
//   };

//   const handleTodoSelect = (todo: Todo) => {
//     if (autoSaveTimer) {
//       clearTimeout(autoSaveTimer);
//       saveCurrentNote();
//     }
//     setSelectedTodo(todo);
//     setEditTitle(todo.title);
//     setEditDescription(todo.description);
//     setEditTags(todo.tags || []);
//   };

//   // Custom markdown components with improved checkbox handling
//   const MarkdownComponents = {
//     p: ({ children }: any) => {
//       if (typeof children === "string") {
//         const checkboxRegex = /^\[([xX\s])\]\s*(.+)$/;
//         const match = children.match(checkboxRegex);
//         if (match) {
//           const checked = match[1].toLowerCase() === "x";
//           return (
//             <div className="flex items-center py-1">
//               <CheckboxComponent checked={checked} />
//               <span className={checked ? "text-gray-500 line-through" : ""}>
//                 {match[2]}
//               </span>
//             </div>
//           );
//         }
//       }
//       return <p>{children}</p>;
//     },
//     code({ node, inline, className, children, ...props }: any) {
//       const match = /language-(\w+)/.exec(className || "");
//       return !inline && match ? (
//         <SyntaxHighlighter
//           style={oneDark}
//           language={match[1]}
//           PreTag="div"
//           className="rounded-md"
//           {...props}>
//           {String(children).replace(/\n$/, "")}
//         </SyntaxHighlighter>
//       ) : (
//         <code
//           className="bg-gray-800 px-1.5 py-0.5 rounded text-sm"
//           {...props}>
//           {children}
//         </code>
//       );
//     },
//   };

//   // Filter todos by search query
//   const filteredTodos = todos.filter(
//     (todo) =>
//       todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       todo.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle tag input
//   const handleTagKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && newTag.trim()) {
//       e.preventDefault();
//       if (!editTags.includes(newTag.trim())) {
//         setEditTags([...editTags, newTag.trim()]);
//         setNewTag("");
//         startAutoSave();
//       }
//     }
//   };

//   // Remove tag
//   const removeTag = (tagToRemove: string) => {
//     setEditTags(editTags.filter((tag) => tag !== tagToRemove));
//     startAutoSave();
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-gray-300">
//         Loading...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );

//   return (
//     <div className="flex h-screen bg-black">
//       {/* Sidebar */}
//       <div className="w-72 border-r border-gray-800 flex flex-col">
//         <div className="p-4 border-b border-gray-800">
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-gray-300 font-medium">Notes</h1>
//             <button
//               onClick={createNewTodo}
//               className="p-2 text-gray-400 hover:text-[#A594F9] transition-colors"
//               title="New Note (⌘N)">
//               <Plus className="w-5 h-5" />
//             </button>
//           </div>
//           <div className="flex items-center bg-gray-900 rounded-lg px-3 py-2">
//             <Search className="w-4 h-4 text-gray-500 mr-2" />
//             <input
//               id="search-input"
//               type="text"
//               placeholder="Search notes..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-transparent text-gray-300 text-sm w-full focus:outline-none"
//             />
//           </div>
//         </div>

//         {/* Notes list */}
//         <div className="flex-1 overflow-y-auto">
//           {filteredTodos.map((todo) => (
//             <div
//               key={todo._id}
//               onClick={() => handleTodoSelect(todo)}
//               className={`p-4 cursor-pointer border-b border-gray-800 ${
//                 selectedTodo?._id === todo._id
//                   ? "bg-gray-900"
//                   : "hover:bg-gray-900"
//               }`}>
//               <h3 className="text-gray-300 font-medium truncate">
//                 {todo.title || "Untitled"}
//               </h3>
//               {todo.tags && todo.tags.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {todo.tags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="inline-block px-2 py-0.5 bg-[#A594F9] bg-opacity-20 text-[#A594F9] text-xs rounded-full">
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               )}
//               <p className="text-gray-500 text-sm truncate mt-1">
//                 {todo.description.slice(0, 100)}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {selectedTodo ? (
//           <>
//             <div className="p-4 border-b border-gray-800">
//               {/* Title */}
//               <div className="flex justify-between items-center mb-4">
//                 <input
//                   type="text"
//                   value={editTitle}
//                   onChange={(e) => {
//                     setEditTitle(e.target.value);
//                     startAutoSave();
//                   }}
//                   className="bg-transparent text-white text-xl font-medium focus:outline-none flex-1"
//                   placeholder="Note title"
//                 />
//                 {selectedTodo._id && (
//                   <button
//                     onClick={() => deleteTodo(selectedTodo._id)}
//                     className="text-gray-400 hover:text-red-500 transition-colors p-2"
//                     title="Delete">
//                     <Trash className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>

//               {/* Tags */}
//               <div className="flex items-center gap-2">
//                 <Tag className="w-4 h-4 text-[#A594F9]" />
//                 <div className="flex gap-2 items-center flex-wrap">
//                   {editTags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="bg-gray-900 text-sm px-2 py-1 rounded-full flex items-center gap-1">
//                       <span className="text-gray-300">{tag}</span>
//                       <button
//                         onClick={() => removeTag(tag)}
//                         className="text-gray-500 hover:text-red-500">
//                         <X className="w-3 h-3" />
//                       </button>
//                     </span>
//                   ))}
//                   <input
//                     type="text"
//                     value={newTag}
//                     onChange={(e) => setNewTag(e.target.value)}
//                     onKeyDown={handleTagKeyDown}
//                     placeholder="Add tag"
//                     className="bg-transparent text-white text-sm focus:outline-none w-20"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Note Content */}
//             <div className="flex-1 overflow-y-auto p-6">
//               <div className="prose prose-invert prose-pre:bg-gray-900 max-w-none">
//                 <textarea
//                   value={editDescription}
//                   onChange={(e) => {
//                     setEditDescription(e.target.value);
//                     startAutoSave();
//                   }}
//                   className="w-full h-40 bg-transparent text-gray-300 resize-none focus:outline-none font-mono"
//                   placeholder="Start writing here... (Supports Markdown)"
//                 />
//                 {/* Render Markdown Preview */}
//                 <ReactMarkdown
//                   remarkPlugins={[remarkGfm]}
//                   components={MarkdownComponents}>
//                   {editDescription || "No content"}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             Select a note or create a new one
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Todos;
