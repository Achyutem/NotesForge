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
    setSelectedTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditTags(todo.tags || []);
  };

  // Custom markdown components
  const MarkdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-gray-800 mb-2">{children}</h3>
    ),
    p: ({ children }: any) => {
      if (typeof children === "string") {
        // Modified regex to also match empty (unchecked) checkboxes
        const checkboxRegex = /^\s*-\s*\[([xX\s]?)\]\s*(.+)$/;
        const match = children.match(checkboxRegex);
        if (match) {
          const checked = match[1].toLowerCase() === "x";
          return (
            <div className="flex items-center py-1">
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="mr-2 h-4 w-4 rounded border-gray-400 bg-white checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500 focus:ring-offset-white"
              />
              <span
                className={
                  checked ? "text-gray-500 line-through" : "text-gray-800"
                }>
                {match[2]}
              </span>
            </div>
          );
        }
      }
      return <p className="text-gray-800 mb-2">{children}</p>;
    },
    strong: ({ children }: any) => (
      <strong className="font-bold text-black">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-800">{children}</em>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside mb-2 text-gray-800">{children}</ul>
    ),
    li: ({ children }: any) => <li className="mb-1">{children}</li>,
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer">
        {children}
      </a>
    ),
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
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-gray-800 font-medium">Notes</h1>
            <button
              onClick={createNewTodo}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-gray-800 text-sm w-full focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTodos.map((todo) => (
            <div
              key={todo._id}
              onClick={() => handleTodoSelect(todo)}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedTodo ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="border-b border-gray-300 pb-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    startAutoSave();
                  }}
                  className="bg-transparent text-black text-xl font-medium focus:outline-none flex-1"
                  placeholder="Note title"
                />
                {selectedTodo._id && (
                  <button
                    onClick={() => deleteTodo(selectedTodo._id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2"
                    title="Delete">
                    <Trash className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                <div className="flex gap-2 items-center flex-wrap">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-gray-800">{tag}</span>
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
                    className="bg-transparent text-black text-sm focus:outline-none w-20"
                  />
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <textarea
                value={editDescription}
                onChange={(e) => {
                  setEditDescription(e.target.value);
                  startAutoSave();
                }}
                className="w-full h-40 bg-gray-100 text-gray-800 resize-none focus:outline-none font-mono p-2"
                placeholder="Start writing here... (Supports Markdown)"
              />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}>
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

//? markdown
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { Plus, Trash, Search, Tag, X } from "lucide-react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// interface Todo {
//   _id: string;
//   title: string;
//   description: string;
//   completed: boolean;
//   tags?: string[];
// }

// const Todos = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editDescription, setEditDescription] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
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
//         setEditTags(fetchedTodos[0].tags || []);
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

//   // Custom markdown components
//   const MarkdownComponents = {
//     h1: ({ children }: any) => (
//       <h1 className="text-3xl font-bold text-gray-800 mb-4">{children}</h1>
//     ),
//     h2: ({ children }: any) => (
//       <h2 className="text-2xl font-bold text-gray-800 mb-3">{children}</h2>
//     ),
//     h3: ({ children }: any) => (
//       <h3 className="text-xl font-bold text-gray-800 mb-2">{children}</h3>
//     ),
//     p: ({ children }: any) => {
//       if (typeof children === "string") {
//         const checkboxRegex = /^\s*-\s*\[([xX\s])\]\s*(.+)$/;
//         const match = children.match(checkboxRegex);
//         if (match) {
//           const checked = match[1].toLowerCase() === "x";
//           return (
//             <div className="flex items-center py-1">
//               <input
//                 type="checkbox"
//                 checked={checked}
//                 readOnly
//                 className="mr-2 h-4 w-4 rounded border-gray-400 bg-white checked:bg-blue-500 checked:border-blue-500 focus:ring-blue-500 focus:ring-offset-white"
//               />
//               <span className={checked ? "text-gray-500 line-through" : "text-gray-800"}>
//                 {match[2]}
//               </span>
//             </div>
//           );
//         }
//       }
//       return <p className="text-gray-800 mb-2">{children}</p>;
//     },
//     strong: ({ children }: any) => (
//       <strong className="font-bold text-black">{children}</strong>
//     ),
//     em: ({ children }: any) => (
//       <em className="italic text-gray-800">{children}</em>
//     ),
//     ul: ({ children }: any) => (
//       <ul className="list-disc list-inside mb-2 text-gray-800">{children}</ul>
//     ),
//     li: ({ children }: any) => <li className="mb-1">{children}</li>,
//     a: ({ href, children }: any) => (
//       <a href={href} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
//         {children}
//       </a>
//     ),
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
//       <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
//         Loading...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center text-red-500">
//         {error}
//       </div>
//     );

//     return (
//       <div className="flex h-screen bg-white">
//         {/* Sidebar */}
//         <div className="w-72 border-r border-gray-300 flex flex-col">
//           <div className="p-4 border-b border-gray-300">
//             <div className="flex justify-between items-center mb-4">
//               <h1 className="text-gray-800 font-medium">Notes</h1>
//               <button
//                 onClick={createNewTodo}
//                 className="text-gray-500 hover:text-blue-500 transition-colors p-2"
//                 title="New Note (⌘N)">
//                 <Plus className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
//               <Search className="w-4 h-4 text-gray-500 mr-2" />
//               <input
//                 id="search-input"
//                 type="text"
//                 placeholder="Search notes..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="bg-transparent text-gray-800 text-sm w-full focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             {filteredTodos.map((todo) => (
//               <div
//                 key={todo._id}
//                 onClick={() => handleTodoSelect(todo)}
//                 className={`p-4 cursor-pointer border-b border-gray-300 ${
//                   selectedTodo?._id === todo._id
//                     ? "bg-gray-200"
//                     : "hover:bg-gray-200"
//                 }`}>
//                 <h3 className="text-gray-800 font-medium truncate">
//                   {todo.title || "Untitled"}
//                 </h3>
//                 {todo.tags && todo.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {todo.tags.map((tag) => (
//                       <span
//                         key={tag}
//                         className="inline-block px-2 py-0.5 bg-blue-500 bg-opacity-20 text-blue-500 text-xs rounded-full">
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//                 <p className="text-gray-600 text-sm truncate mt-1">
//                   {todo.description.slice(0, 100)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {selectedTodo ? (
//             <div className="flex-1 overflow-y-auto p-6">
//               <div className="border-b border-gray-300 pb-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <input
//                     type="text"
//                     value={editTitle}
//                     onChange={(e) => {
//                       setEditTitle(e.target.value);
//                       startAutoSave();
//                     }}
//                     className="bg-transparent text-black text-xl font-medium focus:outline-none flex-1"
//                     placeholder="Note title"
//                   />
//                   {selectedTodo._id && (
//                     <button
//                       onClick={() => deleteTodo(selectedTodo._id)}
//                       className="text-gray-500 hover:text-red-500 transition-colors p-2"
//                       title="Delete">
//                       <Trash className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Tag className="w-4 h-4 text-blue-500" />
//                   <div className="flex gap-2 items-center flex-wrap">
//                     {editTags.map((tag) => (
//                       <span
//                         key={tag}
//                         className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1">
//                         <span className="text-gray-800">{tag}</span>
//                         <button
//                           onClick={() => removeTag(tag)}
//                           className="text-gray-500 hover:text-red-500">
//                           <X className="w-3 h-3" />
//                         </button>
//                       </span>
//                     ))}
//                     <input
//                       type="text"
//                       value={newTag}
//                       onChange={(e) => setNewTag(e.target.value)}
//                       onKeyDown={handleTagKeyDown}
//                       placeholder="Add tag"
//                       className="bg-transparent text-black text-sm focus:outline-none w-20"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="prose max-w-none">
//                 <textarea
//                   value={editDescription}
//                   onChange={(e) => {
//                     setEditDescription(e.target.value);
//                     startAutoSave();
//                   }}
//                   className="w-full h-40 bg-gray-100 text-gray-800 resize-none focus:outline-none font-mono p-2"
//                   placeholder="Start writing here... (Supports Markdown)"
//                 />
//                 <ReactMarkdown
//                   remarkPlugins={[remarkGfm]}
//                   components={MarkdownComponents}>
//                   {editDescription || "No content"}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500">
//               Select a note or create a new one
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   export default Todos;
