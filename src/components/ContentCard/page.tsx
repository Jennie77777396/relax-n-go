'use client'

import type React from 'react'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Maximize2, Minimize2, Edit, Eye } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MarkdownDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function MarkdownDialog({ isOpen, onClose }: MarkdownDialogProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)

  const [markdownContent, setMarkdownContent] = useState(`
# Sample Concept

This is a sample markdown content that explains a concept.

## Main Points

- Point 1: Important information about the concept
- Point 2: Additional details that are crucial
- Point 3: Examples of how this concept applies

## Code Example

\`\`\`javascript
function example() {
  return "This is an example";
}
\`\`\`
  `)

  const keywords = ['Concept', 'Implementation', 'Framework', 'Paradigm', 'Architecture']

  const toggleFullscreen = useCallback(() => {
    const dialogElement = document.getElementById('markdown-dialog-content')

    if (!isFullscreen) {
      if (dialogElement?.requestFullscreen) {
        dialogElement.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }, [isFullscreen])

  const recordAnswer = useCallback((isCorrect: boolean) => {
    setTotalAttempts((prev) => prev + 1)
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    }
  }, [])

  const successRate = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value)
  }

  return (
    <div className="p-4">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
          id="markdown-dialog-content"
        >
          <DialogHeader>
            <DialogTitle>Study Card</DialogTitle>
          </DialogHeader>

          <div className="absolute top-4 right-4 z-10">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="sr-only">
                {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              </span>
            </Button>
          </div>

          <div className="mt-4 space-y-6">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-2">
                <textarea
                  value={markdownContent}
                  onChange={handleMarkdownChange}
                  className="w-full min-h-[300px] p-4 border rounded-md font-mono text-sm resize-y bg-muted"
                  placeholder="Enter your markdown content here..."
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-2">
                <div className="prose dark:prose-invert max-w-none border rounded-md p-4 bg-card">
                  <ReactMarkdown>{markdownContent}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Key Words</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span>Success Rate: {successRate}%</span>
                  <span>
                    ({correctAnswers} / {totalAttempts})
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500/10"
                    onClick={() => recordAnswer(true)}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={() => recordAnswer(false)}
                  >
                    Incorrect
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
