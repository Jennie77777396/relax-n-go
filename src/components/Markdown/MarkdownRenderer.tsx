import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw' // For raw HTML like <details> and <summary>
import remarkGfm from 'remark-gfm' // For GFM features like tables
import rehypeSanitize from 'rehype-sanitize' // Optional: Sanitize HTML
import { defaultSchema } from 'hast-util-sanitize'

// Extend sanitization schema to allow <details> and <summary>
const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'details', 'summary'],
}

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // Enable tables and other GFM features
      rehypePlugins={[
        rehypeRaw, // Parse raw HTML
        [rehypeSanitize, customSchema], // Remove [rehypeSanitize] if not needed
      ]}
      components={{
        // Basic table rendering with Tailwind styling
        table: ({ node, ...props }) => (
          <table className="my-4 w-full border-collapse border border-gray-200" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th
            className="bg-gray-100 p-2 text-left font-semibold border border-gray-200"
            {...props}
          />
        ),
        td: ({ node, ...props }) => <td className="p-2 border border-gray-200" {...props} />,

        // <details> and <summary> with Tailwind styling
        details: ({ node, ...props }) => (
          <details className="my-4 rounded-md border border-gray-200 p-2" {...props} />
        ),
        summary: ({ node, ...props }) => (
          <summary className="cursor-pointer bg-gray-50 p-2 hover:bg-gray-100" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
