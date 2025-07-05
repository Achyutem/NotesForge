import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<kbd className="px-2 py-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
		{children}
	</kbd>
);

const ShortcutsDialog: React.FC<Props> = ({ open, onOpenChange }) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-md">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold">
					Keyboard Shortcuts
				</DialogTitle>
				<DialogDescription>
					Boost your productivity with these shortcuts.
				</DialogDescription>
			</DialogHeader>
			<ul className="space-y-3 mt-4 text-sm">
				<li className="flex justify-between items-center">
					<span>New Note</span>
					<div className="flex items-center gap-1">
						<Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>N</Kbd>
					</div>
				</li>
				<li className="flex justify-between items-center">
					<span>Save Note</span>
					<div className="flex items-center gap-1">
						<Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
					</div>
				</li>
				<li className="flex justify-between items-center">
					<span>Delete Note</span>
					<div className="flex items-center gap-1">
						<Kbd>Ctrl</Kbd> + <Kbd>D</Kbd>
					</div>
				</li>
				<li className="flex justify-between items-center">
					<span>Toggle Sidebar</span>
					<div className="flex items-center gap-1">
						<Kbd>Ctrl</Kbd> + <Kbd>B</Kbd>
					</div>
				</li>
				<li className="flex justify-between items-center">
					<span>Toggle Preview</span>
					<div className="flex items-center gap-1">
						<Kbd>Ctrl</Kbd> + <Kbd>P</Kbd>
					</div>
				</li>
				<li className="flex justify-between items-center">
					<span>Markdown Guide</span>
					<div className="flex items-center gap-1">
						<Kbd>Ctrl</Kbd> + <Kbd>M</Kbd>
					</div>
				</li>
				<li className="flex justify-between items-center">
					<span>Shortcuts Guide</span>
					<div className="flex items-center gap-1">
						<Kbd>Ctrl</Kbd> + <Kbd>H</Kbd>
					</div>
				</li>
			</ul>
		</DialogContent>
	</Dialog>
);

export default ShortcutsDialog;
