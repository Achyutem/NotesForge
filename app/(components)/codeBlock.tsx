import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	code({ inline, className, children, ...props }: any) {
		const match = /language-(\w+)/.exec(className || "");
		return !inline && match ? (
			<SyntaxHighlighter
				style={oneDark}
				language={match[1]}
				wrapLongLines
				PreTag="div"
				{...props}
			>
				{String(children).replace(/\n$/, "")}
			</SyntaxHighlighter>
		) : (
			<code className={className} {...props}>
				{children}
			</code>
		);
	},
};

export default CodeBlock;
