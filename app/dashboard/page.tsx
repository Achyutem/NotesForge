/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TodoSidebar from "../(components)/todoSidebar";
import TodoEditor from "../(components)/todoEditor";
import { Todo, ApiResponse } from "../utils/types";

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "n"
      ) {
        e.preventDefault();
        createNewTodo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        const searchInput = document.getElementById(
          "search-input"
        ) as HTMLInputElement;
        searchInput?.focus();
        searchInput?.select();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveCurrentTodo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTodo, editTitle, editDescription, editTags]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>("/api/todos");

      if (response.status === 200 && response.data.todos) {
        const fetchedTodos = Array.isArray(response.data.todos)
          ? response.data.todos
          : [];
        setTodos(fetchedTodos);

        if (!selectedTodo && fetchedTodos.length > 0) {
          setSelectedTodo(fetchedTodos[0]);
          setEditTitle(fetchedTodos[0].title);
          setEditDescription(fetchedTodos[0].description);
          setEditTags(fetchedTodos[0].tags || []);
        }
      } else {
        setError("Failed to fetch todos.");
      }
    } catch (err) {
      setError("Failed to fetch todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const saveCurrentTodo = async () => {
    if (
      !selectedTodo ||
      (!editTitle.trim() && !editDescription.trim()) ||
      isSaving
    )
      return;

    setIsSaving(true);
    try {
      let response: ApiResponse;

      if (selectedTodo.id) {
        const { data, status } = await axios.patch(
          `/api/todos?id=${selectedTodo.id}`,
          {
            title: editTitle || "Untitled",
            description: editDescription,
            tags: editTags,
          }
        );
        response = { ...data, status };
      } else {
        const { data, status } = await axios.post("/api/todos", {
          title: editTitle || "Untitled",
          description: editDescription,
          tags: editTags,
        });
        response = { ...data, status };
      }

      if (response.status === 200 || response.status === 201) {
        if (!selectedTodo.id && response.todos && response.todos[0]) {
          setSelectedTodo(response.todos[0]);
        }
        await fetchTodos();
      }
    } catch (err) {
      setError("Failed to save todo.");
    } finally {
      setIsSaving(false);
    }
  };

  const createNewTodo = () => {
    const newTodo = {
      id: "",
      title: "",
      description: "",
      completed: false,
      tags: [],
      userId: 1,
      createdAt: new Date().toISOString(),
    };
    setSelectedTodo(newTodo);
    setEditTitle("");
    setEditDescription("");
    setEditTags([]);

    setTimeout(() => {
      const titleInput = document.getElementById(
        "todo-title-input"
      ) as HTMLInputElement;
      titleInput?.focus();
    }, 0);
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await axios.delete(`/api/todos?id=${id}`);
      if (response.status === 200) {
        await fetchTodos();
        setSelectedTodo(null);
        setEditTitle("");
        setEditDescription("");
        setEditTags([]);
      } else {
        setError("Failed to delete todo.");
      }
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  const handleTodoSelect = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditTags(todo.tags || []);
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <TodoSidebar
        todos={filteredTodos}
        searchQuery={searchQuery}
        selectedTodo={selectedTodo}
        unsavedTitle={editTitle}
        unsavedTags={editTags}
        hasUnsavedChanges={
          selectedTodo &&
          (editTitle !== selectedTodo.title ||
            editDescription !== selectedTodo.description ||
            JSON.stringify(editTags) !== JSON.stringify(selectedTodo.tags))
        }
        onSearchChange={setSearchQuery}
        onCreateTodo={createNewTodo}
        onTodoSelect={handleTodoSelect}
      />
      {selectedTodo ? (
        <TodoEditor
          todo={selectedTodo}
          title={editTitle}
          description={editDescription}
          tags={editTags}
          newTag={newTag}
          onTitleChange={setEditTitle}
          onDescriptionChange={setEditDescription}
          onDeleteTodo={() => deleteTodo(selectedTodo.id)}
          onAddTag={(tag) => {
            if (!editTags.includes(tag)) {
              setEditTags([...editTags, tag]);
              setNewTag("");
            }
          }}
          onRemoveTag={(tag) => {
            setEditTags(editTags.filter((t) => t !== tag));
          }}
          onNewTagChange={setNewTag}
          onSave={saveCurrentTodo}
          isSaving={isSaving}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a todo or create a new one
        </div>
      )}
    </div>
  );
};

export default Todos;
