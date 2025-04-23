import React from "react";
import { motion } from "framer-motion";
import { Keyboard } from "lucide-react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";

interface Props {
	isOpen: boolean;
	onToggle: (open: boolean) => void;
}

const ShortcutsPopover: React.FC<Props> = ({ isOpen, onToggle }) => (
	<Popover open={isOpen} onOpenChange={onToggle}>
		<PopoverTrigger asChild>
			<motion.button
				whileTap={{ scale: 0.9 }}
				className="py-2 px-1 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
			>
				<Keyboard className="w-5 h-5" />
			</motion.button>
		</PopoverTrigger>
		<PopoverContent asChild>
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.2 }}
				className="w-80 p-4 text-sm bg-background border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl"
			>
				<h3 className="font-semibold text-lg mb-3 text-primary">
					Keyboard Shortcuts
				</h3>
				<ul className="space-y-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
					<li>Ctrl + Shift + N → New Note</li>
					<li>Ctrl + D → Delete Note</li>
					<li>Ctrl + B → Collapse/Expand Sidebar</li>
					<li>Ctrl + P → Preview</li>
					<li>Ctrl + M → View Markdown Cheatsheet</li>
					<li>Ctrl + H → View Shortcuts</li>
				</ul>
			</motion.div>
		</PopoverContent>
	</Popover>
);

export default ShortcutsPopover;
