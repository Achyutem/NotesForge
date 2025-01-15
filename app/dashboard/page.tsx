"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/todos");
        setTodos(response.data.existingTodos);
      } catch (err) {
        setError("Failed to fetch todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) {
      console.log("Title cannot be empty");
      return;
    }

    try {
      await axios.post("/api/todos", newTodo);
      setNewTodo({ title: "", description: "" });
      const response = await axios.get("/api/todos");
      setTodos(response.data.existingTodos);
    } catch (err) {
      setError("Failed to add todo.");
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await axios.put(`/api/todos/${id}`, { completed: !completed });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err) {
      setError("Failed to update todo.");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`/api/todos?id=${id}`);
      //? we can either refresh it right away or filter it and save a re-render
      // setTodos(todos.filter((todo) => todo._id !== id));
      const response = await axios.get("/api/todos");
      setTodos(response.data.existingTodos);
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Your Todos</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }></textarea>
          <button
            onClick={handleAddTodo}
            className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add Todo
          </button>
        </div>
        <ul>
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between p-2 border-b hover:bg-gray-50">
              <div>
                <h2 className="font-semibold">{todo.title}</h2>
                <p className="text-sm text-gray-600">{todo.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleComplete(todo._id, todo.completed)}
                  className={`py-1 px-3 rounded ${
                    todo.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}>
                  {todo.completed ? "Completed" : "Mark Complete"}
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="py-1 px-3 rounded bg-red-500 text-white hover:bg-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todos;
