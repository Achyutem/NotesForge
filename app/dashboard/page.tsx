/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import TodoSidebar from "../(components)/todoSidebar";
import Editor from "../(components)/editor";
import { Todo } from "../utils/types";
import { Theme } from "../(components)/themeColor";
import ImportTodos from "../(components)/import";
import { logout } from "../utils/logout";
import { LogOut } from "lucide-react";
import { useTodoManager } from "../hooks/useTodoManager";
import { useTodoEditorState } from "../hooks/useTodoEdtitorState";

const Todos: React.FC = () => {
	const {
		todos,
		loading,
		error,
		setError,
		fetchTodos,
		createTodo,
		saveTodo,
		deleteTodo,
	} = useTodoManager();

	const {
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
	} = useTodoEditorState();

	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.ctrlKey || e.metaKey) &&
				e.shiftKey &&
				e.key.toLowerCase() === "n"
			) {
				e.preventDefault();
				handleCreateNewTodo();
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
				handleSaveTodo();
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
				e.preventDefault();
				if (selectedTodo?.id) {
					handleDeleteTodo(selectedTodo.id);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTodo, editTitle, editDescription, editTags]);

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	const handleCreateNewTodo = async () => {
		const newTodo = await createTodo();
		setSelectedTodo(newTodo);
		resetEditorState(newTodo);
		setIsPreview(false);
		console.log("createTriggered", isPreview);

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

			if (response.status === 200 || response.status === 201) {
				if (!selectedTodo.id && response.todo) {
					setSelectedTodo(response.todo);
				}
				await fetchTodos();
				setIsPreview(true);
			}
		} catch (err) {
			setError("Failed to save todo.");
		} finally {
			setIsSaving(false);
		}
	};

	const isDeleting = useRef(false);

	const handleDeleteTodo = async (id: string) => {
		if (isDeleting.current) return;

		isDeleting.current = true;

		try {
			const isDeleted = await deleteTodo(id);
			if (isDeleted) {
				resetEditorState();
				await fetchTodos();
			}
		} catch (err) {
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

	const filteredTodos = todos.filter(
		(todo) =>
			todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			todo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			todo.tags?.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	const hasUnsavedChanges = selectedTodo
		? editTitle !== selectedTodo.title ||
		  editDescription !== selectedTodo.description ||
		  JSON.stringify(editTags) !== JSON.stringify(selectedTodo.tags)
		: false;

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
				hasUnsavedChanges={hasUnsavedChanges}
				onSearchChange={setSearchQuery}
				onCreateTodo={handleCreateNewTodo}
				onTodoSelect={handleTodoSelect}
				onDeleteTodo={handleDeleteTodo}
				onEditTodo={handleEditTodo}
			/>
			{selectedTodo ? (
				<Editor
					todo={selectedTodo}
					title={editTitle}
					description={editDescription}
					tags={editTags}
					newTag={newTag}
					isPreview={isPreview}
					onTitleChange={setEditTitle}
					onDescriptionChange={setEditDescription}
					onDeleteTodo={() => handleDeleteTodo(selectedTodo.id)}
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
					onSave={handleSaveTodo}
					isSaving={isSaving}
					onTogglePreview={() => setIsPreview(!isPreview)}
				/>
			) : (
				<div className="flex-1 flex flex-col h-screen w-screen">
					<div className="sticky top-0 bg-background px-4 py-3 md:p-6 flex justify-between items-center">
						<div></div>
						<div className="flex items-center gap-3">
							<ImportTodos />
							<Theme variant="outline" />
							<button className="mr-1" title="Logout">
								<LogOut onClick={logout} className="text-red-500" />
							</button>
						</div>
					</div>
					<div className="flex-1 flex items-center justify-center bg-background dark:text-gray-200 text-gray-700">
						Select a todo or create a new one
					</div>
				</div>
			)}
		</div>
	);
};

export default Todos;
