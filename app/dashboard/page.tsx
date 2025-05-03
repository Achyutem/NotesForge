/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useRef } from "react";
import TodoSidebar from "../(components)/todoSidebar";
import Editor from "../(components)/editor";
import { Theme } from "../(components)/themeColor";
import ImportTodos from "../(components)/import";
import { logout } from "../utils/logout";
import { LogOut } from "lucide-react";
import { useTodoManager } from "../hooks/useTodoManager";
import { useTodoEditorState } from "../hooks/useTodoEdtitorState";
import { useShortcuts } from "../hooks/useShortcuts";
import { useTodoHandlers } from "../hooks/useTodoHandler";

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

	const {
		handleCreateNewTodo,
		handleSaveTodo,
		handleDeleteTodo,
		handleTodoSelect,
		handleEditTodo,
	} = useTodoHandlers({
		selectedTodo,
		setSelectedTodo,
		editTitle,
		setEditTitle,
		editDescription,
		setEditDescription,
		editTags,
		setEditTags,
		setNewTag,
		isSaving,
		setIsSaving,
		setIsPreview,
		resetEditorState,
		createTodo,
		saveTodo,
		deleteTodo,
		fetchTodos,
		setError,
	});

	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

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

	useShortcuts({
		handleCreateNewTodo,
		handleSaveTodo,
		handleDeleteTodo: () => selectedTodo?.id && deleteTodo(selectedTodo.id),
	});

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
