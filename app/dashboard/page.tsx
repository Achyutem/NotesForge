"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, X } from "lucide-react";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TodoModal = ({ isOpen, onClose, onSubmit, editData }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setDescription(editData.description);
    }
  }, [editData]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-black rounded-2xl p-6 w-full max-w-md m-4 border-2"
        style={{ borderColor: "#A594F9" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {editData ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl mb-4 border-0 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#A594F9]"
        />
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 rounded-xl mb-6 border-0 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#A594F9] min-h-[100px]"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-white hover:bg-gray-50 hover:text-black transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-xl bg-[#A594F9] text-white hover:bg-[#8A7AD6] transition-colors">
            {editData ? "Save Changes" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "incomplete" | "complete">(
    "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/todos");
        setTodos(
          Array.isArray(response.data.existingTodos)
            ? response.data.existingTodos
            : []
        );
      } catch (err) {
        setError("Failed to fetch todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (todoData: {
    title: string;
    description: string;
  }) => {
    try {
      await axios.post("/api/todos", todoData);
      const response = await axios.get("/api/todos");
      setTodos(
        Array.isArray(response.data.existingTodos)
          ? response.data.existingTodos
          : []
      );
    } catch (err) {
      setError("Failed to add todo.");
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await axios.patch(`/api/todos?id=${id}`, {
        completed: !completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? response.data.todo : todo))
      );
    } catch (err) {
      setError("Failed to update todo.");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`/api/todos?id=${id}`);
      const response = await axios.get("/api/todos");
      setTodos(
        Array.isArray(response.data.existingTodos)
          ? response.data.existingTodos
          : []
      );
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  const cardColors = [
    "bg-[#FFE2E2]",
    "bg-[#E2F0FF]",
    "bg-[#E2FFE2]",
    "bg-[#FFE2FF]",
    "bg-[#FFF4E2]",
    "bg-[#E2FFFF]",
  ];

  const getRandomColor = () =>
    cardColors[Math.floor(Math.random() * cardColors.length)];

  const filteredTodos = Array.isArray(todos)
    ? todos.filter((todo) => {
        if (activeTab === "complete") return todo.completed;
        if (activeTab === "incomplete") return !todo.completed;
        return true;
      })
    : [];

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
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
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Manage your tasks
            </h1>
            <p className="text-gray-400 text-sm mt-1">Today's progress</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#A594F9] text-white rounded-xl hover:bg-[#8A7AD6] transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "incomplete", "complete"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#A594F9] text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTodos.map((todo) => {
            const cardColor = getRandomColor();
            return (
              <div
                key={todo._id}
                className={`${cardColor} rounded-2xl p-4 transition-all`}>
                <h3
                  className={`text-lg font-medium mb-2 ${
                    todo.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-800"
                  }`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`mb-4 ${
                      todo.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-600"
                    }`}>
                    {todo.description}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingTodo(todo);
                      setIsModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white/70">
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleToggleComplete(todo._id, todo.completed)
                    }
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      todo.completed
                        ? "bg-green-500 text-white"
                        : "bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white/70"
                    }`}>
                    {todo.completed ? "Completed" : "Complete"}
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        // onSubmit={}
        // editData={}
      />
    </div>
  );
};

export default Todos;
