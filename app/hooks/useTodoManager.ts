/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from "react";
import axios from "axios";
import { Todo, ApiResponse } from "../utils/types";

export const useTodoManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>("/api/todos", {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.todos) {
        const fetchedTodos = Array.isArray(response.data.todos)
          ? response.data.todos
          : [];
        setTodos(fetchedTodos);
      } else {
        setError("Failed to fetch todos.");
      }
    } catch (err) {
      setError("Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = async () => {
    const newTodo: Todo = {
      id: "",
      title: "",
      description: "",
      tags: [],
      userId: 1,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
    return newTodo;
  };

  const saveTodo = async (
    todo: Todo,
    editTitle: string,
    editDescription: string,
    editTags: string[]
  ) => {
    try {
      let response: ApiResponse;

      if (todo.id) {
        const { data, status } = await axios.patch(`/api/todos?id=${todo.id}`, {
          title: editTitle || "Untitled",
          description: editDescription,
          tags: editTags,
        });
        response = { ...data, status };
      } else {
        const { data, status } = await axios.post("/api/todos", {
          title: editTitle || "Untitled",
          description: editDescription,
          tags: editTags,
        });
        response = { ...data, status };
      }

      return response;
    } catch (err) {
      throw new Error("Failed to save todo.");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await axios.delete(`/api/todos?id=${id}`);
      return response.status === 200;
    } catch (err) {
      throw new Error("Failed to delete todo.");
    }
  };

  return {
    todos,
    loading,
    error,
    setError,
    fetchTodos,
    createTodo,
    saveTodo,
    deleteTodo,
  };
};
