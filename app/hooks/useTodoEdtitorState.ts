import { useState, useCallback } from "react";
import { Todo } from "../utils/types";

export const useTodoEditorState = (initialTodo?: Todo) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(
    initialTodo || null
  );
  const [editTitle, setEditTitle] = useState(initialTodo?.title || "");
  const [editDescription, setEditDescription] = useState(
    initialTodo?.description || ""
  );
  const [editTags, setEditTags] = useState<string[]>(initialTodo?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(true);

  const resetEditorState = useCallback((todo?: Todo) => {
    setSelectedTodo(todo || null);
    setEditTitle(todo?.title || "");
    setEditDescription(todo?.description || "");
    setEditTags(todo?.tags || []);
    setNewTag("");
    setIsPreview(todo ? true : false);
  }, []);

  return {
    selectedTodo,
    setSelectedTodo,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editTags,
    setEditTags,
    newTag,
    setNewTag,
    isSaving,
    setIsSaving,
    isPreview,
    setIsPreview,
    resetEditorState,
  };
};
