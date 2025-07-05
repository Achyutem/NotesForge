"use client";

import React from "react";
import {
	Search,
	ChevronsLeft,
	ChevronsRight,
	MoreVertical,
	Pencil,
	Trash,
	FolderOpen,
	XCircle,
	LogOut,
	Settings,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useShortcuts } from "../hooks/useShortcuts";
import { TodoSidebarProps } from "../utils/types";
import { logout } from "../utils/logout";
import ImportTodos from "./import";
import ExportTodos from "./export";

const formatRelativeTime = (createdAt: string, updatedAt: string) => {
	const dateToUse = updatedAt > createdAt ? updatedAt : createdAt;

	const mostRecentDate = new Date(
		dateToUse.endsWith("Z") ? dateToUse : dateToUse + "Z"
	);

	const now = new Date();
	// Get difference in seconds
	const diffInSeconds = Math.floor(
		(now.getTime() - mostRecentDate.getTime()) / 1000
	);

	if (diffInSeconds < 60) return "just now";
	const minutes = Math.floor(diffInSeconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	return mostRecentDate.toLocaleDateString();
};

const ActionsMenu = () => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button
				variant="ghost"
				className="w-full justify-start gap-2 px-3 text-muted-foreground hover:text-foreground"
			>
				<Settings className="w-4 h-4" />
				<span>Actions & Settings</span>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent
			align="end"
			side="top"
			className="w-56 mb-1 p-2 border-border/20 bg-background/80 backdrop-blur-xl rounded-xl shadow-2xl"
		>
			<DropdownMenuLabel className="px-2 py-1.5 font-semibold">
				Data Management
			</DropdownMenuLabel>
			<DropdownMenuSeparator className="bg-border/50" />
			<ImportTodos />
			<ExportTodos />
			<DropdownMenuSeparator className="bg-border/50" />
			<DropdownMenuItem
				onClick={logout}
				className="rounded-md p-2 gap-2 font-medium text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
			>
				<LogOut className="w-4 h-4" />
				Logout
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

const ActionsMenuCollapsed = () => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost" size="icon">
				<Settings className="w-5 h-5" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent
			align="end"
			side="right"
			className="w-56 ml-1 p-2 border-border/20 bg-background/80 backdrop-blur-xl rounded-xl shadow-2xl"
		>
			<DropdownMenuLabel className="px-2 py-1.5 font-semibold">
				Data Management
			</DropdownMenuLabel>
			<DropdownMenuSeparator className="bg-border/50" />
			<ImportTodos />
			<ExportTodos />
			<DropdownMenuSeparator className="bg-border/50" />
			<DropdownMenuItem
				onClick={logout}
				className="rounded-md p-2 gap-2 font-medium text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
			>
				<LogOut className="w-4 h-4" />
				Logout
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

const TodoSidebar: React.FC<TodoSidebarProps> = ({
	todos,
	searchQuery,
	selectedTodo,
	unsavedTitle,
	unsavedTags,
	hasUnsavedChanges,
	onSearchChange,
	onTodoSelect,
	onDeleteTodo,
	onEditTodo,
}) => {
	const [isCollapsed, setIsCollapsed] = React.useState(false);

	useShortcuts({
		// onCreateTodo is no longer triggered from a button here, but the shortcut still works
		toggleSidebar: () => setIsCollapsed((prev) => !prev),
	});

	const sidebarVariants = {
		expanded: { width: 320, transition: { duration: 0.3, ease: "easeInOut" } },
		collapsed: { width: 80, transition: { duration: 0.3, ease: "easeInOut" } },
	};

	return (
		<motion.aside
			variants={sidebarVariants}
			initial={isCollapsed ? "collapsed" : "expanded"}
			animate={isCollapsed ? "collapsed" : "expanded"}
			className="bg-muted/30 border-r border-border h-full flex flex-col"
		>
			<div className="flex items-center justify-between p-4 border-b border-border shrink-0 h-[65px]">
				<AnimatePresence>
					{!isCollapsed ? (
						<motion.div
							key="expanded-header"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="flex items-center justify-between w-full"
						>
							<div className="flex items-center gap-1.5 overflow-hidden">
								<Image
									src="/favicon.ico"
									alt="NotesForge logo"
									width={24}
									height={24}
									priority
								/>
								<h1 className="text-base font-bold text-foreground">
									NotesForge
								</h1>
							</div>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											onClick={() => setIsCollapsed(true)}
										>
											<ChevronsLeft className="w-4 h-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Collapse Sidebar</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</motion.div>
					) : (
						<motion.div
							key="collapsed-header"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex flex-col items-center w-full"
						>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											size="icon"
											variant="ghost"
											onClick={() => setIsCollapsed(false)}
										>
											<ChevronsRight className="w-5 h-5" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="right">
										<p>Expand Sidebar</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="flex-1 flex flex-col overflow-y-auto">
				{!isCollapsed && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="p-3 border-b border-border"
					>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="search-input"
								value={searchQuery}
								onChange={(e) => onSearchChange(e.target.value)}
								placeholder="Search notes..."
								className="pl-9 pr-8 text-sm rounded-md bg-background border-border"
							/>
							{searchQuery && (
								<button
									onClick={() => onSearchChange("")}
									className="absolute right-2 top-1/2 -translate-y-1/2"
								>
									<XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
								</button>
							)}
						</div>
					</motion.div>
				)}

				<div className="flex-1 overflow-y-auto p-2 space-y-1">
					{todos.length === 0 && !isCollapsed ? (
						<div className="text-center p-10 text-muted-foreground">
							<FolderOpen className="h-10 w-10 mx-auto mb-3" />
							<p className="font-medium">No notes yet</p>
							<p className="text-sm">Create your first note!</p>
						</div>
					) : isCollapsed ? (
						todos.map((todo) => (
							<TooltipProvider key={todo.id}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant={
												selectedTodo?.id === todo.id ? "secondary" : "ghost"
											}
											className="w-full h-14 text-lg font-bold"
											onClick={() => onTodoSelect(todo)}
										>
											{(todo.title?.charAt(0) || "N").toUpperCase()}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="right">
										<p>{todo.title || "Untitled"}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						))
					) : (
						todos.map((todo) => {
							const isSelected = selectedTodo?.id === todo.id;
							return (
								<motion.div
									key={todo.id}
									layout
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									onClick={() => onTodoSelect(todo)}
									className={`relative p-3 cursor-pointer rounded-lg transition-colors ${
										isSelected
											? "bg-primary/10"
											: "hover:bg-primary/10 hover:bg-opacity-50"
									}`}
								>
									{isSelected && (
										<motion.div
											layoutId="selected-indicator"
											className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
										/>
									)}
									<div className="flex justify-between items-start gap-2">
										<h3
											className={`text-sm font-semibold truncate ${
												isSelected ? "text-primary" : "text-foreground"
											}`}
										>
											{hasUnsavedChanges && isSelected
												? unsavedTitle
												: todo.title || "Untitled"}
										</h3>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													size="icon"
													variant="ghost"
													className="h-7 w-7 rounded-full shrink-0"
													onClick={(e) => e.stopPropagation()}
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-40 p-1.5 border-border/20 bg-background/80 backdrop-blur-xl rounded-xl shadow-2xl"
											>
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														onEditTodo(todo);
													}}
													className="rounded-md p-2 gap-2 font-medium cursor-pointer"
												>
													<Pencil className="w-4 h-4 text-muted-foreground" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuSeparator className="bg-border/50 my-1" />
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														onDeleteTodo(todo.id);
													}}
													className="rounded-md p-2 gap-2 font-medium text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
												>
													<Trash className="w-4 h-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									<div className="flex justify-between items-end mt-1">
										<div
											className="flex flex-wrap gap-1.5"
											onClick={(e) => e.stopPropagation()}
										>
											{(hasUnsavedChanges && isSelected
												? unsavedTags
												: todo.tags
											)
												?.slice(0, 3)
												.map((tag) => (
													<Badge
														key={tag}
														variant="secondary"
														className="text-xs"
													>
														{tag}
													</Badge>
												))}
										</div>
										<span className="text-xs text-muted-foreground shrink-0">
											{formatRelativeTime(todo.createdAt, todo.updatedAt)}
										</span>
									</div>
								</motion.div>
							);
						})
					)}
				</div>
			</div>

			<div className="p-2 border-t border-border shrink-0">
				{isCollapsed ? <ActionsMenuCollapsed /> : <ActionsMenu />}
			</div>
		</motion.aside>
	);
};

export default TodoSidebar;
