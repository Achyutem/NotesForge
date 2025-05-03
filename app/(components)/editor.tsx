import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import {
	LogOut,
	Trash,
	Tag,
	X,
	Save,
	Clock,
	Eye,
	Edit3,
	Upload,
} from "lucide-react";
import { Theme } from "./themeColor";
import { logout } from "../utils/logout";
import MarkdownGuidePopover from "./markdownGuide";
import CodeBlock from "./codeBlock";
import ShortcutsPopover from "./shortcutPopover";
import { useLastUpdated } from "../hooks/useLastUpdated";
import { useShortcuts } from "../hooks/useShortcuts";
import { EditorProps } from "../utils/types";

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
	const lastUpdated = useLastUpdated(todo.updatedAt, todo.createdAt);
	const [isShortcutOpen, setIsShortcutOpen] = useState(false);
	const [isMarkdownOpen, setIsMarkdownOpen] = useState(false);

	const transition = { duration: 0.25, ease: "easeInOut" };

	useShortcuts({
		onTogglePreview,
		onDeleteTodo,
		setIsShortcutOpen,
		setIsMarkdownOpen,
	});

	const editorVariants = {
		hidden: { opacity: 0, x: -20, scale: 0.98 },
		visible: { opacity: 1, x: 0, scale: 1 },
		exit: { opacity: 0, x: -20, scale: 0.98 },
	};

	const previewVariants = {
		hidden: { opacity: 0, x: 20, scale: 0.98 },
		visible: { opacity: 1, x: 0, scale: 1 },
		exit: { opacity: 0, x: 20, scale: 0.98 },
	};

	const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && newTag.trim()) {
			e.preventDefault();
			onAddTag(newTag.trim());
		}
	};

	return (
		<div className="flex flex-col h-screen w-screen">
			<div className="sticky top-0 bg-background border-b border-gray-300 px-4 py-3 md:p-3 flex justify-between items-center">
				<input
					id="todo-title-input"
					type="text"
					value={title}
					onChange={(e) => onTitleChange(e.target.value)}
					className="bg-transparent text-primary text-xl font-medium focus:outline-none flex-1 min-w-[200px]"
					placeholder="Note title"
				/>
				<div className="flex items-center gap-1">
					<button
						onClick={onSave}
						disabled={isSaving}
						className="p-2 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors mr-1"
						title="Save (Ctrl + S)"
						aria-label="Save"
					>
						<Save className="w-5 h-5" />
					</button>
					{todo.id && (
						<button
							onClick={onDeleteTodo}
							className="p-2 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors mr-1"
							title="Delete (Ctrl + D)"
						>
							<Trash className="w-5 h-5" />
						</button>
					)}
					<button
						className="p-2 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors mr-1"
						onClick={async () => {
							try {
								const response = await fetch("/api/export");
								if (response.ok) {
									const blob = await response.blob();
									const url = URL.createObjectURL(blob);
									const link = document.createElement("a");
									link.href = url;
									link.download = "todos.csv";
									document.body.appendChild(link);
									link.click();
									document.body.removeChild(link);
									URL.revokeObjectURL(url);
								} else {
									console.error("Failed to export todos");
								}
							} catch (error) {
								console.error("Error exporting todos:", error);
							}
						}}
						title="Export Todos"
					>
						<Upload className="w-5 h-5" />
					</button>
					<Theme />
					<button onClick={onSave} title="Logout" className="pl-2">
						<LogOut
							onClick={logout}
							className="text-red-500 ml-1 hover:animate-bounce"
						/>
					</button>
				</div>
			</div>
			<div className="border-b border-gray-300 px-4 flex items-center gap-2 bg-background">
				<Tag className="w-4 h-4 text-primary" />
				<div className="flex flex-wrap gap-2 items-center flex-1">
					{tags.map((tag) => (
						<span
							key={tag}
							className="bg-gray-200 font-semibold dark:bg-slate-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
						>
							<span className="text-primary">{tag}</span>
							<button
								onClick={() => onRemoveTag(tag)}
								className="text-gray-500 hover:text-red-500 p-0.5"
							>
								<X className="w-3 h-3" />
							</button>
						</span>
					))}
					<input
						type="text"
						value={newTag}
						onChange={(e) => onNewTagChange(e.target.value)}
						onKeyDown={handleTagKeyDown}
						placeholder="Add tag"
						className="bg-transparent text-primary text-sm focus:outline-none min-w-[80px] flex-1"
					/>
				</div>
				<div className="px-2 py-2 text-sm flex items-center gap-2 dark:text-gray-200 text-gray-700">
					<Clock className="w-4 h-4 text-primary inline-block" />
					Last Updated: <strong>{lastUpdated}</strong>
					<MarkdownGuidePopover
						isOpen={isMarkdownOpen}
						onToggle={setIsMarkdownOpen}
					/>
					<ShortcutsPopover
						isOpen={isShortcutOpen}
						onToggle={setIsShortcutOpen}
					/>
				</div>
			</div>
			<div className="relative flex-1 w-full overflow-hidden">
				<button
					onClick={onTogglePreview}
					title="Toggle Preview (Ctrl + P)"
					className="absolute top-2 right-4 text-primary text-sm hover:underline flex items-center gap-1 z-10"
				>
					{isPreview ? (
						<>
							<Edit3 className="w-4 h-4" /> Edit
						</>
					) : (
						<>
							<Eye className="w-4 h-4" /> Preview
						</>
					)}
				</button>
				<AnimatePresence mode="wait">
					<div className="relative h-full w-full bg-background text-black dark:text-white">
						{isPreview ? (
							<motion.div
								key="preview"
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={previewVariants}
								transition={transition}
								className="absolute inset-0 h-full w-full overflow-auto bg-inherit p-6"
							>
								<ReactMarkdown
									remarkPlugins={[remarkGfm, remarkBreaks]}
									rehypePlugins={[rehypeRaw]}
									components={{
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										li: ({ node, children, ...props }: any) => {
											const isTaskList = node.children[0]?.tagName === "input";
											return (
												<li
													{...props}
													className={
														isTaskList
															? "list-none flex items-center gap-2"
															: "list-disc"
													}
												>
													{children}
												</li>
											);
										},
										input: ({ checked, ...props }) => (
											<input
												type="checkbox"
												checked={checked}
												readOnly
												className="form-checkbox rounded text-primary"
												{...props}
											/>
										),
										...CodeBlock,
									}}
									className="markdown-content prose prose-sm sm:prose-base dark:prose-invert max-w-none"
								>
									{description}
								</ReactMarkdown>
							</motion.div>
						) : (
							<motion.div>
								<motion.textarea
									id="text-description"
									key="editor"
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={editorVariants}
									transition={transition}
									value={description}
									onChange={(e) => onDescriptionChange(e.target.value)}
									className="absolute inset-0 w-full h-full bg-inherit text-black dark:text-white resize-none focus:outline-none font-mono p-6"
									placeholder="Start writing here... (Supports Markdown)"
								/>
							</motion.div>
						)}
					</div>
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Editor;
