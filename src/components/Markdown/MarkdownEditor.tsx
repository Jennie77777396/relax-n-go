'use client'

import { useCallback } from 'react'

// Define the props interface
interface MarkdownEditorProps {
  value: string // Type for the value prop
  onChange: (value: string) => void // Type for the onChange prop
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <textarea
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]"
      value={value}
      onChange={handleChange}
      placeholder="Enter markdown content"
    />
  )
}
