import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className }) => {
  return (
    <div className={`prose prose-lg prose-slate max-w-none 
      prose-headings:font-bold prose-headings:text-slate-900 
      prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-6
      prose-p:leading-relaxed prose-p:text-slate-600
      prose-li:text-slate-600
      prose-strong:text-slate-800 prose-strong:font-bold
      prose-a:text-orange-700 prose-a:no-underline hover:prose-a:underline
      marker:text-orange-500 ${className || ''}`}>
      <ReactMarkdown
        components={{
          // Override component handling if necessary, e.g. for images or custom components
          img: ({node, ...props}) => <img {...props} className="rounded-xl shadow-lg my-8" />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
