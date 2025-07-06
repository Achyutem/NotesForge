import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	FilePlus,
	Save,
	Trash2,
	PanelLeftClose,
	Eye,
	BookText,
	Keyboard as KeyboardIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<kbd
		className={cn(
			"px-2 py-1 text-xs font-semibold text-foreground bg-muted border shadow-sm rounded-md",
			"dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // Ensure focus style
		)}
	>
		{children}
	</kbd>
);

const shortcuts = [
	{ icon: FilePlus, label: "New Note", keys: ["Ctrl", "Shift", "N"] },
	{ icon: Save, label: "Save Note", keys: ["Ctrl", "S"] },
	{ icon: Trash2, label: "Delete Note", keys: ["Ctrl", "D"] },
	{ icon: PanelLeftClose, label: "Toggle Sidebar", keys: ["Ctrl", "B"] },
	{ icon: Eye, label: "Toggle Preview", keys: ["Ctrl", "P"] },
	{ icon: BookText, label: "Markdown Guide", keys: ["Ctrl", "M"] },
	{ icon: KeyboardIcon, label: "Shortcuts Guide", keys: ["Ctrl", "H"] },
];

const ShortcutsDialog: React.FC<Props> = ({ open, onOpenChange }) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-lg bg-background/80 backdrop-blur-xl border border-primary">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
					<KeyboardIcon className="w-6 h-6" /> Keyboard Shortcuts
				</DialogTitle>
				<DialogDescription>
					Boost your productivity with these shortcuts.
				</DialogDescription>
			</DialogHeader>
			<div className="space-y-3 mt-4 text-sm">
				{shortcuts.map(({ icon: Icon, label, keys }) => (
					<div
						key={label}
						className="flex justify-between items-center p-2 rounded-lg hover:bg-muted"
					>
						<div className="flex items-center gap-3">
							<Icon className="w-5 h-5  text-primary" />
							<span className="font-medium text-foreground">{label}</span>
						</div>
						<div className="flex items-center gap-1.5">
							{keys.map((key) => (
								<Kbd key={key}>{key}</Kbd>
							))}
						</div>
					</div>
				))}
			</div>
		</DialogContent>
	</Dialog>
);

export default ShortcutsDialog;
