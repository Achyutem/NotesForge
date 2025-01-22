import React from "react";
import { parseMarkdown, sanitizeHtml } from "../utils/markdownParser";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  className = "",
}) => {
  const parsedContent = React.useMemo(() => {
    const parsed = parseMarkdown(content || "No content");
    return sanitizeHtml(parsed);
  }, [content]);

  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
};

export default MarkdownPreview;
