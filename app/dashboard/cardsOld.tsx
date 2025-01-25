// //? original but with cards and colors

// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, X, CheckCircle, Trash, Edit } from "lucide-react";

// interface Todo {
//   _id: string;
//   title: string;
//   description: string;
//   completed: boolean;
// }

// interface TodoModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (
//     data: { title: string; description: string },
//     todoId?: string
//   ) => void;
//   editData?: Todo | null;
// }

// const TodoModal = ({ isOpen, onClose, onSubmit, editData }: TodoModalProps) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     if (editData) {
//       setTitle(editData.title);
//       setDescription(editData.description);
//     } else {
//       setTitle("");
//       setDescription("");
//     }
//   }, [editData, isOpen]);

//   const handleSubmit = () => {
//     if (!title.trim()) return;
//     onSubmit({ title, description }, editData?._id);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
//       <div
//         className="bg-black rounded-2xl p-8 w-full max-w-md m-4 border-2"
//         style={{
//           borderColor: "#A594F9",
//           background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
//         }}>
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold text-white">
//             {editData ? "Edit Task" : "Add New Task"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-800 rounded-full transition-colors">
//             <X className="w-6 h-6 text-gray-400 hover:text-white" />
//           </button>
//         </div>
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-400 mb-2">
//               Task Title
//             </label>
//             <input
//               type="text"
//               placeholder="Enter task title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-900 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#A594F9] focus:border-transparent transition-all"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-400 mb-2">
//               Task Description
//             </label>
//             <textarea
//               placeholder="Enter task description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-900 rounded-xl border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#A594F9] focus:border-transparent transition-all min-h-[120px]"
//             />
//           </div>
//         </div>
//         <div className="flex gap-4 mt-8">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="flex-1 px-4 py-3 rounded-xl bg-[#A594F9] text-white hover:bg-[#8A7AD6] transition-colors flex items-center justify-center gap-2">
//             <CheckCircle className="w-5 h-5" />
//             {editData ? "Save Changes" : "Add Task"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Todos = () => {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"all" | "incomplete" | "complete">(
//     "all"
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

//   const cardColors = [
//     "bg-[#FF9A8B]",
//     "bg-[#70C1E9]",
//     "bg-[#8FE3A1]",
//     "bg-[#F27B9B]",
//     "bg-[#FFB84D]",
//     "bg-[#6FE1D7]",
//   ];

//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("/api/todos");
//         setTodos(
//           Array.isArray(response.data.existingTodos)
//             ? response.data.existingTodos
//             : []
//         );
//       } catch (err) {
//         setError("Failed to fetch todos.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTodos();
//   }, []);

//   const handleAddOrEditTodo = async (
//     todoData: { title: string; description: string },
//     todoId?: string
//   ) => {
//     try {
//       if (todoId) {
//         await axios.patch(`/api/todos?id=${todoId}`, todoData);
//       } else {
//         await axios.post("/api/todos", todoData);
//       }
//       const response = await axios.get("/api/todos");
//       setTodos(
//         Array.isArray(response.data.existingTodos)
//           ? response.data.existingTodos
//           : []
//       );
//       setEditingTodo(null);
//     } catch (err) {
//       setError(todoId ? "Failed to edit todo." : "Failed to add todo.");
//     }
//   };

//   const handleToggleComplete = async (id: string, completed: boolean) => {
//     try {
//       const response = await axios.patch(`/api/todos?id=${id}`, { completed });
//       setTodos((prevTodos) =>
//         prevTodos.map((todo) =>
//           todo._id === id
//             ? { ...todo, completed: response.data.todo.completed }
//             : todo
//         )
//       );
//     } catch (err) {
//       setError("Failed to update todo.");
//     }
//   };

//   const handleDeleteTodo = async (id: string) => {
//     try {
//       await axios.delete(`/api/todos?id=${id}`);
//       const response = await axios.get("/api/todos");
//       setTodos(
//         Array.isArray(response.data.existingTodos)
//           ? response.data.existingTodos
//           : []
//       );
//     } catch (err) {
//       setError("Failed to delete todo.");
//     }
//   };

//   const getRandomColor = () =>
//     cardColors[Math.floor(Math.random() * cardColors.length)];

//   const filteredTodos = todos.filter((todo) => {
//     if (activeTab === "complete") return todo.completed;
//     if (activeTab === "incomplete") return !todo.completed;
//     return true;
//   });

//   if (loading)
//     return (
//       <div
//         className="min-h-screen bg-black flex items-center justify-center text-white"
//         style={{
//           background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
//         }}>
//         Loading...
//       </div>
//     );

//   if (error)
//     return (
//       <div
//         className="min-h-screen bg-black flex items-center justify-center text-red-500"
//         style={{
//           background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
//         }}>
//         {error}
//       </div>
//     );

//   return (
//     <div
//       className="min-h-screen bg-black"
//       style={{
//         background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
//       }}>
//       <div className="max-w-5xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Task Overview</h1>
//           </div>
//           <button
//             onClick={() => {
//               setEditingTodo(null);
//               setIsModalOpen(true);
//             }}
//             className="px-6 py-3 bg-[#A594F9] text-white rounded-xl hover:bg-[#8A7AD6] transition-colors flex items-center gap-2 shadow-lg">
//             <Plus className="w-5 h-5" />
//             <span className="hidden sm:inline">Add Task</span>
//           </button>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-8 overflow-x-auto">
//           {(["all", "incomplete", "complete"] as const).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
//                 activeTab === tab
//                   ? "bg-[#A594F9] text-white shadow-lg"
//                   : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700"
//               }`}>
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>
//         {/* Todo List */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredTodos.map((todo) => {
//             const cardColor = getRandomColor();
//             return (
//               <div
//                 key={todo._id}
//                 className={`${cardColor} rounded-2xl p-6 transition-all shadow-lg hover:shadow-xl`}>
//                 <h3
//                   className={`text-xl font-medium mb-3 ${
//                     todo.completed
//                       ? "text-gray-600 line-through"
//                       : "text-gray-800"
//                   }`}>
//                   {todo.title}
//                 </h3>
//                 {todo.description && (
//                   <p
//                     className={`mb-6 ${
//                       todo.completed
//                         ? "text-gray-500 line-through"
//                         : "text-gray-600"
//                     }`}>
//                     {todo.description}
//                   </p>
//                 )}
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={() => {
//                       setEditingTodo(todo);
//                       setIsModalOpen(true);
//                     }}
//                     className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md">
//                     <Edit className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleToggleComplete(todo._id, !todo.completed)
//                     }
//                     className={`p-3 rounded-full transition-colors flex items-center justify-center shadow-md ${
//                       todo.completed
//                         ? "bg-green-600 text-white hover:bg-green-700"
//                         : "bg-gray-500 text-black hover:bg-gray-600"
//                     }`}>
//                     <CheckCircle className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteTodo(todo._id)}
//                     className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center shadow-md">
//                     <Trash className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <TodoModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingTodo(null);
//         }}
//         onSubmit={handleAddOrEditTodo}
//         editData={editingTodo}
//       />
//     </div>
//   );
// };

// export default Todos;
