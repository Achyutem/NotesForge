/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import TodoSidebar from "../(components)/todoSidebar";
import Editor from "../(components)/editor";
import { FilePlus2, FileDown } from "lucide-react";
import { useTodoManager } from "../hooks/useTodoManager";
import { useTodoEditorState } from "../hooks/useTodoEdtitorState";
import { useShortcuts } from "../hooks/useShortcuts";
import { useTodoHandlers } from "../hooks/useTodoHandler";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Theme } from "../(components)/themeColor";
import { useImportHandler } from "../hooks/useImportHandler";

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
	const { triggerImport, renderFileInput } = useImportHandler();

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
			<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
				Loading your notes...
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center text-destructive">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-background text-foreground">
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
				filterTag={null}
				onTagSelect={function (_tag: string): void {
					throw new Error("Function not implemented.");
				}}
				onClearTagFilter={function (): void {
					throw new Error("Function not implemented.");
				}}
			/>
			<main className="flex-1 flex flex-col h-screen">
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
					<div className="flex-1 flex flex-col">
						<header className="flex justify-end items-center p-4 gap-4">
							<Theme variant="outline" />
						</header>
						<div className="flex-1 flex flex-col items-center justify-center text-center p-4 -mt-16">
							<FilePlus2 className="w-16 h-16 text-muted-foreground/50 mb-4" />
							<h2 className="text-2xl font-semibold text-foreground mb-2">
								Welcome to NotesForge
							</h2>
							<p className="text-muted-foreground max-w-sm">
								Select a note from the sidebar to start editing, or create a new
								one using the button below.
							</p>
							<Button onClick={triggerImport} className="mt-6 gap-2">
								<FileDown className="w-4 h-4" />
								Import from CSV
							</Button>
						</div>
					</div>
				)}
			</main>

			{renderFileInput()}
		</div>
	);
};

export default Todos;
