export interface Todo {
	id: string;
	title: string;
	description: string;
	tags?: string[];
	userId: number;
	createdAt: string;
	updatedAt: string;
}

export interface ApiResponse {
	todo?: Todo;
	todos?: Todo[];
	message?: string;
	status: number;
}

export interface EditorProps {
	todo: Todo;
	title: string;
	description: string;
	tags: string[];
	newTag: string;
	isSaving: boolean;
	isPreview: boolean;
	onTitleChange: (title: string) => void;
	onDescriptionChange: (description: string) => void;
	onDeleteTodo: () => void;
	onAddTag: (tag: string) => void;
	onRemoveTag: (tag: string) => void;
	onNewTagChange: (tag: string) => void;
	onSave: () => void;
	onTogglePreview: () => void;
}

export interface TodoSidebarProps {
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

export type ThemeColors =
	| "Zinc"
	| "Rose"
	| "Blue"
	| "Green"
	| "Orange"
	| "Purple";

export interface Shortcut {
	key: string; // e.g., 'p', 'shift + n', 'b'
	ctrlKey?: boolean; // Whether Ctrl (or Cmd on Mac) is required
	shiftKey?: boolean; // Whether Shift is required
	description: string; // Description for UI (e.g., ShortcutsPopover)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	action: (context?: any) => void; // Function to execute; context allows passing component-specific data
}
