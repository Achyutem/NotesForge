"use client";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import {
	HelpCircle,
	Trash,
	Tag,
	X,
	Clock,
	Keyboard,
	Check,
	Loader2,
	Eye,
	Edit3,
} from "lucide-react";
import { Theme } from "./themeColor";
import MarkdownGuideDialog from "./markdownGuide";
import CodeBlock from "./codeBlock";
import ShortcutsDialog from "./shortcutPopover";
import { useShortcuts } from "../hooks/useShortcuts";
import { EditorProps } from "../utils/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const useLastUpdated = (createdAt?: string, updatedAt?: string) => {
	const [relativeTime, setRelativeTime] = useState("just now");

	useEffect(() => {
		const update = () => {
			const dateToUse =
				updatedAt && updatedAt > (createdAt || "") ? updatedAt : createdAt;
			if (!dateToUse) return;

			const mostRecentDate = new Date(
				dateToUse.endsWith("Z") ? dateToUse : dateToUse + "Z"
			);

			const now = new Date();
			const diffInSeconds = Math.floor(
				(now.getTime() - mostRecentDate.getTime()) / 1000
			);

			if (diffInSeconds < 5) {
				setRelativeTime("just now");
				return;
			}
			const minutes = Math.floor(diffInSeconds / 60);
			if (minutes < 60) {
				setRelativeTime(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
				return;
			}
			const hours = Math.floor(minutes / 60);
			if (hours < 24) {
				setRelativeTime(`${hours} hour${hours > 1 ? "s" : ""} ago`);
				return;
			}
			setRelativeTime(mostRecentDate.toLocaleDateString());
		};

		update();
		const interval = setInterval(update, 60000);
		return () => clearInterval(interval);
	}, [createdAt, updatedAt]);

	return relativeTime;
};

const Editor: React.FC<EditorProps> = ({
	todo,
	title,
	description,
	tags,
	newTag,
	isSaving,
	isPreview,
	onTitleChange,
	onDescriptionChange,
	onDeleteTodo,
	onAddTag,
	onRemoveTag,
	onNewTagChange,
	onSave,
	onTogglePreview,
}) => {
	const lastUpdated = useLastUpdated(todo.createdAt, todo.updatedAt);
	const [showShortcuts, setShowShortcuts] = useState(false);
	const [showMarkdownGuide, setShowMarkdownGuide] = useState(false);
	const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
		"idle"
	);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isSaving) {
			setSaveState("saving");
		} else if (saveState === "saving") {
			setSaveState("saved");
			const timer = setTimeout(() => setSaveState("idle"), 2000);
			return () => clearTimeout(timer);
		}
	}, [isSaving, saveState]);

	useEffect(() => {
		if (!isPreview && textareaRef.current) {
			setTimeout(() => {
				textareaRef.current?.focus();
			}, 100);
		}
	}, [isPreview]);

	useShortcuts({
		onTogglePreview,
		onDeleteTodo,
		setIsShortcutOpen: setShowShortcuts,
		setIsMarkdownOpen: setShowMarkdownGuide,
		onSave,
	});

	const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && newTag.trim()) {
			e.preventDefault();
			onAddTag(newTag.trim());
		}
	};

	return (
		<main className="flex flex-col h-screen w-full bg-background">
			<header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 px-6 flex justify-between items-center border-b border-border h-[65px]">
				<input
					id="todo-title-input"
					type="text"
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					className="bg-transparent text-xl font-semibold focus:outline-none flex-1 min-w-[150px] text-foreground placeholder:text-muted-foreground caret-primary"
					placeholder="Untitled Note"
				/>
				<div className="flex items-center gap-2">
					<AnimatePresence mode="wait">
						<motion.div
							key={saveState}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							className="flex items-center gap-2 text-sm text-muted-foreground w-24 justify-center"
						>
							{saveState === "saving" && (
								<>
									<Loader2 className="w-4 h-4 animate-spin" /> Saving...
								</>
							)}
							{saveState === "saved" && (
								<>
									<Check className="w-4 h-4 text-green-500" /> Saved
								</>
							)}
						</motion.div>
					</AnimatePresence>
					<Button
						onClick={onTogglePreview}
						variant="outline"
						size="sm"
						className="gap-2"
					>
						<AnimatePresence mode="wait">
							{isPreview ? (
								<motion.div
									key="edit"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center gap-2 text-primary"
								>
									<Edit3 className="w-4 h-4" /> Edit
								</motion.div>
							) : (
								<motion.div
									key="preview"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center gap-2 text-primary"
								>
									<Eye className="w-4 h-4" /> Preview
								</motion.div>
							)}
						</AnimatePresence>
					</Button>
					{todo.id && (
						<Button
							onClick={onDeleteTodo}
							variant="outline"
							size="icon"
							className="text-red-500 hover:text-red-600 hover:border-red-600"
							title="Delete"
						>
							<Trash className="w-4 h-4" />
						</Button>
					)}
					<Theme variant="outline" />
				</div>
			</header>

			<div className="bg-muted/30 border-b border-border px-6 py-2 flex items-center gap-2 text-sm">
				<Tag className="w-4 h-4 shrink-0 text-primary" />
				<div className="flex flex-wrap gap-1.5 items-center">
					{tags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="flex items-center gap-1.5 hover:bg-secondary/80"
						>
							{tag}
							<button
								onClick={() => onRemoveTag(tag)}
								className="rounded-full hover:bg-black/20 dark:hover:bg-white/20 -mr-1"
							>
								<X className="w-3 h-3" />
							</button>
						</Badge>
					))}
					<input
						type="text"
						value={newTag}
						onChange={(e) => onNewTagChange(e.target.value)}
						onKeyDown={handleTagKeyDown}
						placeholder="Add a tag..."
						className="bg-transparent focus:outline-none min-w-[80px] flex-1 text-sm caret-primary"
					/>
				</div>
			</div>

			<div className="relative flex-1 w-full overflow-hidden">
				<AnimatePresence mode="wait">
					{isPreview ? (
						<motion.div
							key="preview"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 h-full w-full overflow-y-auto p-8"
						>
							<ReactMarkdown
								remarkPlugins={[remarkGfm, remarkBreaks]}
								rehypePlugins={[rehypeRaw]}
								className="prose prose-purple dark:prose-invert max-w-none"
								components={{
									...CodeBlock,
									input: ({ checked, ...props }) => (
										<input
											type="checkbox"
											checked={checked}
											readOnly
											{...props}
										/>
									),
								}}
							>
								{description}
							</ReactMarkdown>
						</motion.div>
					) : (
						<motion.div
							key="editor"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 h-full w-full"
							onAnimationComplete={() => {
								textareaRef.current?.focus();
							}}
						>
							<textarea
								ref={textareaRef}
								id="text-description"
								value={description}
								onChange={(e) => onDescriptionChange(e.target.value)}
								className="w-full h-full bg-transparent text-foreground resize-none focus:outline-none font-mono p-8 text-base leading-relaxed focus:ring-2 focus:ring-primary caret-primary"
								placeholder="Start writing your note here..."
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<footer className="border-t border-border px-4 py-1.5 flex items-center justify-end text-sm text-muted-foreground">
				<div className="flex items-center gap-4">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={() => setShowMarkdownGuide(true)}
									variant="ghost"
									size="icon"
									className="hover:text-primary"
								>
									<HelpCircle className="w-4 h-4 text-primary" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Markdown Guide</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<div className="hidden md:block">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={() => setShowShortcuts(true)}
										variant="ghost"
										size="icon"
										className="hover:text-primary"
									>
										<Keyboard className="w-4 h-4 text-primary" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Shortcuts</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div className="h-4 w-px bg-border mx-1"></div>

					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4 text-primary" />
						<span>Updated {lastUpdated}</span>
					</div>
				</div>
			</footer>

			<MarkdownGuideDialog
				open={showMarkdownGuide}
				onOpenChange={setShowMarkdownGuide}
			/>
			<ShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
		</main>
	);
};

export default Editor;
