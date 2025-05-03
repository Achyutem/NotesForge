import { Shortcut } from "./types";

export const shortcuts: Shortcut[] = [
	{
		key: "p",
		ctrlKey: true,
		description: "Toggle preview mode",
		action: (context) => {
			context?.onTogglePreview?.();
			requestAnimationFrame(() => {
				const textarea = document.getElementById(
					"text-description"
				) as HTMLTextAreaElement;
				textarea?.focus();
				// Move cursor to the end
				if (textarea) {
					const length = textarea.value.length;
					textarea.setSelectionRange(length, length);
				}
			});
		},
	},

	{
		key: "d",
		ctrlKey: true,
		description: "Delete current todo",
		action: (context) => context?.onDeleteTodo?.(),
	},
	{
		key: "h",
		ctrlKey: true,
		description: "Toggle shortcuts popover",
		action: (context) => context?.setIsShortcutOpen?.((prev: boolean) => !prev),
	},
	{
		key: "m",
		ctrlKey: true,
		description: "Toggle markdown guide",
		action: (context) => context?.setIsMarkdownOpen?.((prev: boolean) => !prev),
	},
	{
		key: "n",
		ctrlKey: true,
		shiftKey: true,
		description: "Create new todo",
		action: (context) => context?.handleCreateNewTodo?.(),
	},
	{
		key: "f",
		ctrlKey: true,
		description: "Focus search input",
		action: () => {
			const searchInput = document.getElementById(
				"search-input"
			) as HTMLInputElement;
			searchInput?.focus();
			searchInput?.select();
		},
	},
	{
		key: "s",
		ctrlKey: true,
		description: "Save todo",
		action: (context) => context?.handleSaveTodo?.(),
	},
	{
		key: "b",
		ctrlKey: true,
		description: "Toggle sidebar",
		action: (context) => context?.toggleSidebar?.(),
	},
];
