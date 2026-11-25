import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import type { ComponentPropsWithoutRef } from "react";

interface MarkdownContentProps {
  content: string;
}

type PreProps = ComponentPropsWithoutRef<"pre">;

function FocusablePre({ children, className }: PreProps) {
  return (
    <pre tabIndex={0} className={className}>
      {children}
    </pre>
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown">
      <ReactMarkdown
        components={{ pre: FocusablePre }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
