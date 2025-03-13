import ReactMarkdown from 'react-markdown'

export const MarkdownRenderer = ({ content }: { content: string }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>
}
