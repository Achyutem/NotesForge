import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { BookText } from "lucide-react";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const guideItems = [
	{ description: "Heading 1", syntax: "# H1" },
	{ description: "Heading 2", syntax: "## H2" },
	{ description: "Bold Text", syntax: "**Bold Text**" },
	{ description: "Italic Text", syntax: "*Italic Text*" },
	{ description: "Strikethrough", syntax: "~~Strikethrough~~" },
	{ description: "Link", syntax: "[NotesForge](https://google.com)" },
	{ description: "Code Block", syntax: "````js\nconsole.log('Hello');\n````" },
	{ description: "Inline Code", syntax: "`inline code`" },
	{ description: "Unordered List", syntax: "- Item 1\n- Item 2" },
	{ description: "Ordered List", syntax: "1. Item 1\n2. Item 2" },
	{ description: "Task List", syntax: "- [x] Done\n- [ ] To Do" },
	{ description: "Blockquote", syntax: "> To be or not to be..." },
	{ description: "Horizontal Rule", syntax: "---" },
	{ description: "Image", syntax: "![](https://via.placeholder.com/50)" },
	{
		description: "Table",
		syntax:
			"| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |",
	},
];

const MarkdownGuideDialog: React.FC<Props> = ({ open, onOpenChange }) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-3xl bg-background/80 backdrop-blur-xl border-primary">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold flex items-center gap-2 text-primary">
					<BookText className="w-6 h-6" /> Markdown Guide
				</DialogTitle>
				<DialogDescription>
					A quick reference for formatting your notes.
				</DialogDescription>
			</DialogHeader>
			<div className="overflow-auto max-h-[70vh] mt-4 rounded-md border border-primary">
				<table className="w-full text-sm">
					<thead className="sticky top-0 bg-muted text-primary">
						<tr className="text-left">
							<th className="p-3 font-semibold">Element</th>
							<th className="p-3 font-semibold">Syntax</th>
							<th className="p-3 font-semibold">Result</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{guideItems.map(({ description, syntax }) => (
							<tr key={description}>
								<td className="p-3 font-medium text-foreground">
									{description}
								</td>
								<td className="p-3">
									<pre className="p-2 bg-muted/80 rounded-md text-foreground whitespace-pre-wrap font-mono text-xs">
										<code>{syntax}</code>
									</pre>
								</td>
								<td className="p-3 prose prose-sm dark:prose-invert">
									<ReactMarkdown>{syntax}</ReactMarkdown>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</DialogContent>
	</Dialog>
);

export default MarkdownGuideDialog;
