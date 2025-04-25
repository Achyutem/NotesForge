"use client";

import React, { useEffect, useState, useRef } from "react";
import {
	Plus,
	Search,
	ChevronsLeft,
	ChevronsRight,
	MoreVertical,
	Pencil,
	Trash,
} from "lucide-react";
import { Todo } from "../utils/types";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface TodoSidebarProps {
	todos: Todo[];
	searchQuery: string;
	selectedTodo?: Todo | null;
	unsavedTitle?: string;
	unsavedTags?: string[];
	hasUnsavedChanges?: boolean | null;
	onSearchChange: (query: string) => void;
	onCreateTodo: () => void;
	onTodoSelect: (todo: Todo) => void;
	onDeleteTodo: (id: string) => void;
	onEditTodo: (todo: Todo) => void;
}

const TodoSidebar: React.FC<TodoSidebarProps> = ({
	todos,
	searchQuery,
	selectedTodo,
	unsavedTitle,
	unsavedTags,
	hasUnsavedChanges,
	onSearchChange,
	onCreateTodo,
	onTodoSelect,
	onDeleteTodo,
	onEditTodo,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(320);
	const resizerRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [isResizing, setIsResizing] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
				e.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isResizing || !sidebarRef.current) return;
			const newWidth =
				e.clientX - sidebarRef.current.getBoundingClientRect().left;
			setSidebarWidth(Math.max(300, Math.min(newWidth, 600)));
		};

		const handleMouseUp = () => {
			if (isResizing) setIsResizing(false);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isResizing]);

	const toggleSidebar = () => {
		setIsCollapsed((prev) => {
			return !prev;
		});
	};

	return (
		<aside
			ref={sidebarRef}
			style={{ width: isCollapsed ? 56 : sidebarWidth }}
			className="transition-all duration-300 border-r bg-background h-full flex flex-col relative"
		>
			<div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-background z-10">
				{!isCollapsed ? (
					<>
						<div className="flex items-center gap-2">
							<Image
								src="/favicon.ico"
								alt="NotesForge logo"
								width={20}
								height={20}
								className="w-5 h-5"
								priority
							/>
							<h1 className="text-sm sm:text-lg font-bold text-primary">
								NotesForge
							</h1>
						</div>
						<div className="flex items-center gap-2">
							<Button
								size="icon"
								variant="ghost"
								className="min-w-8 w-8 h-8 p-1"
								onClick={onCreateTodo}
								title="New Note (ctrl+shift+n)"
							>
								<Plus className="w-4 h-4" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="min-w-8 w-8 h-8 p-1"
								onClick={toggleSidebar}
								title="Collapse Sidebar (Ctrl+B)"
							>
								<ChevronsLeft className="w-5 h-5" />
							</Button>
						</div>
					</>
				) : (
					<div className="flex flex-col items-center w-full gap-2 py-2">
						<Button
							size="icon"
							variant="ghost"
							className="min-w-8 w-8 h-8 p-1"
							onClick={toggleSidebar}
							title="Expand Sidebar"
						>
							<ChevronsRight className="w-5 h-5" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							className="min-w-8 w-8 h-8 p-1"
							onClick={onCreateTodo}
							title="New Note"
						>
							<Plus className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>

			{!isCollapsed && (
				<div className="px-4 py-2">
					<div className="relative rounded-md overflow-hidden shadow-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							id="search-input"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder="Search...(ctrl + f)"
							className="pl-9 text-sm bg-muted focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>
			)}

			<div className="flex-1 overflow-y-auto">
				{!isCollapsed &&
					todos.map((todo) => {
						const isSelected = selectedTodo?.id === todo.id;
						const displayTitle =
							isSelected && hasUnsavedChanges
								? unsavedTitle || "Untitled"
								: todo.title || "Untitled";
						const displayTags =
							isSelected && hasUnsavedChanges ? unsavedTags : todo.tags;

						return (
							<div
								key={todo.id}
								onClick={() => onTodoSelect(todo)}
								className={`px-4 py-3 flex items-start justify-between cursor-pointer transition-colors ${
									isSelected ? "bg-muted" : "hover:bg-muted/80"
								}`}
							>
								<div className="flex-1 overflow-hidden">
									<h3 className="text-sm font-medium truncate text-primary">
										{displayTitle}
									</h3>
									{displayTags && displayTags.length > 0 && (
										<div className="flex flex-wrap gap-1 mt-1">
											{displayTags.map((tag) => (
												<span
													key={tag}
													className="bg-muted text-primary text-xs font-semibold px-2 py-0.5 rounded-full"
												>
													{tag}
												</span>
											))}
										</div>
									)}
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											className="text-muted-foreground"
											onClick={(e) => e.stopPropagation()}
										>
											<MoreVertical className="w-4 h-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												onEditTodo(todo);
											}}
										>
											<Pencil className="w-4 h-4 mr-2" /> Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												onDeleteTodo(todo.id);
											}}
											className="text-red-600"
										>
											<Trash className="w-4 h-4 mr-2" /> Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						);
					})}
			</div>

			<div
				ref={resizerRef}
				onMouseDown={() => setIsResizing(true)}
				className="absolute top-0 right-0 w-2 cursor-ew-resize h-full z-20"
			/>
		</aside>
	);
};

export default TodoSidebar;
