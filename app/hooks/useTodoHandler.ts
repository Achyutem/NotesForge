import { useRef } from "react";
import { Todo } from "../utils/types";

interface UseTodoHandlersProps {
	selectedTodo: Todo | null;
	setSelectedTodo: (todo: Todo | null) => void;
	editTitle: string;
	setEditTitle: (title: string) => void;
	editDescription: string;
	setEditDescription: (desc: string) => void;
	editTags: string[];
	setEditTags: (tags: string[]) => void;
	setNewTag: (tag: string) => void;
	isSaving: boolean;
	setIsSaving: (saving: boolean) => void;
	setIsPreview: (preview: boolean) => void;
	resetEditorState: (todo?: Todo) => void;
	createTodo: () => Promise<Todo>;
	saveTodo: (
		todo: Todo,
		title: string,
		description: string,
		tags: string[]
	) => Promise<{ status: number; todo?: Todo }>;
	deleteTodo: (id: string) => Promise<boolean>;
	fetchTodos: () => Promise<void>;
	setError: (err: string) => void;
}

export const useTodoHandlers = ({
	selectedTodo,
	setSelectedTodo,
	editTitle,
	editDescription,
	editTags,
	isSaving,
	setIsSaving,
	setIsPreview,
	resetEditorState,
	createTodo,
	saveTodo,
	deleteTodo,
	fetchTodos,
	setError,
}: UseTodoHandlersProps) => {
	const isDeleting = useRef(false);

	const handleCreateNewTodo = async () => {
		const newTodo = await createTodo();
		setSelectedTodo(newTodo);
		resetEditorState(newTodo);
		setIsPreview(false);

		setTimeout(() => {
			const titleInput = document.getElementById(
				"todo-title-input"
			) as HTMLInputElement;
			titleInput?.focus();
		}, 0);
	};

	const handleSaveTodo = async () => {
		if (
			!selectedTodo ||
			(!editTitle.trim() && !editDescription.trim()) ||
			isSaving
		)
			return;

		setIsSaving(true);
		try {
			const response = await saveTodo(
				selectedTodo,
				editTitle,
				editDescription,
				editTags
			);
			if (
				(response.status === 200 || response.status === 201) &&
				response.todo
			) {
				if (!selectedTodo.id) {
					setSelectedTodo(response.todo);
				}
				await fetchTodos();
				setIsPreview(true);
			}
		} catch {
			setError("Failed to save todo.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteTodo = async (id: string) => {
		if (isDeleting.current) return;
		isDeleting.current = true;
		try {
			const isDeleted = await deleteTodo(id);
			if (isDeleted) {
				resetEditorState();
				await fetchTodos();
			}
		} catch {
			setError("Failed to delete todo.");
		} finally {
			isDeleting.current = false;
		}
	};

	const handleTodoSelect = (todo: Todo) => {
		setSelectedTodo(todo);
		resetEditorState(todo);
		setIsPreview(true);
	};

	const handleEditTodo = (todo: Todo) => {
		setSelectedTodo(todo);
		resetEditorState(todo);
		setIsPreview(false);
	};

	return {
		handleCreateNewTodo,
		handleSaveTodo,
		handleDeleteTodo,
		handleTodoSelect,
		handleEditTodo,
	};
};
