import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const MarkdownGuideDialog: React.FC<Props> = ({ open, onOpenChange }) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-2xl">
			<DialogHeader>
				<DialogTitle className="text-2xl font-bold">Markdown Guide</DialogTitle>
			</DialogHeader>
			<div className="overflow-auto max-h-[70vh] space-y-4 font-mono text-sm bg-muted p-4 rounded-md mt-4">
				<pre className="whitespace-pre-wrap">{`# H1
## H2
### H3

**Bold Text** or __Bold Text__
*Italic Text* or _Italic Text_
~~Strikethrough~~

> Blockquote

- Unordered List Item 1
- Unordered List Item 2

1. Ordered List Item 1
2. Ordered List Item 2

[A Link to Google](https://www.google.com)
![An Image](https://via.placeholder.com/150)

\`Inline code\` with backticks

\`\`\`javascript
// Code Block
function greet() {
  console.log("Hello, world!");
}
\`\`\`

---

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

- [x] Task List Item (checked)
- [ ] Task List Item (unchecked)
`}</pre>
			</div>
		</DialogContent>
	</Dialog>
);

export default MarkdownGuideDialog;
