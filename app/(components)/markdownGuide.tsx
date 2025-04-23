import { HelpCircle } from "lucide-react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import React from "react";

interface Props {
	isOpen: boolean;
	onToggle: (open: boolean) => void;
}

const MarkdownGuidePopover: React.FC<Props> = ({ isOpen, onToggle }) => (
	<Popover open={isOpen} onOpenChange={onToggle}>
		<PopoverTrigger asChild>
			<motion.button
				whileTap={{ scale: 0.9 }}
				className="py-2 px-1 rounded-md text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
			>
				<HelpCircle className="w-5 h-5" />
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
				<h3 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
					Markdown Guide
				</h3>
				<div className="overflow-auto max-h-72 space-y-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
					<pre className="whitespace-pre-wrap">{`# H1
## H2
**Bold**:  **text**
*Italic*:  *text*
\`Code\`:  \`inline\`

- Item 1
- Item 2

[Link](https://example.com)

\`\`\`js
console.log("Code Block");
\`\`\`

| Head | Head |
|------|------|
| Row  | Row |`}</pre>
				</div>
			</motion.div>
		</PopoverContent>
	</Popover>
);

export default MarkdownGuidePopover;
