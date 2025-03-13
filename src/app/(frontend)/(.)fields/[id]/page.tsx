'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Maximize2, Edit, Eye } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { updateTask, getTaskById } from '@/actions/tasks'
import { Task } from '@/payload-types'
import rehypeRaw from 'rehype-raw'
import { use } from 'react'

const CustomDetails = (props: React.HTMLAttributes<HTMLDetailsElement>) => (
  <details {...props} className="border rounded-md p-2 my-2" />
)

const CustomSummary = (props: React.HTMLAttributes<HTMLElement>) => (
  <summary {...props} className="font-bold cursor-pointer" />
)

export default function NextDialog({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const params = use(paramsPromise)
  const [task, setTask] = useState<Task | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [markdownContent, setMarkdownContent] = useState('')
  const keywords = ['Concept', 'Implementation', 'Framework', 'Paradigm', 'Architecture']

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const data = await getTaskById(params.id)
        if (data) {
          setTask(data)
          setCorrectAnswers(data.success_attempts || 0)
          setTotalAttempts(data.total_attempts || 0)
          setMarkdownContent(data.content || '')
        }
      } catch (error) {
        console.error('Failed fetching task data:', error)
      }
    }
    fetchTaskData()
  }, [params.id])

  const goToFullPage = useCallback(() => {
    router.push(`/tasks/${params.id}`)
  }, [router, params.id])

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

  const handleOnClose = async () => {
    try {
      if (task) {
        await updateTask(task.id.toString(), {
          content: markdownContent,
          success_attempts: correctAnswers,
          total_attempts: totalAttempts,
        })
      }
      router.back()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  if (!task) return <div className="text-white">Loading...</div>

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="relative p-6">
        <h2 className="text-xl font-semibold">Study Card</h2>
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" onClick={goToFullPage} className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">Go to full page</span>
          </Button>
        </div>
      </div>

      <div className="p-6 pt-0 space-y-6">
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
              value={markdownContent || ''}
              onChange={handleMarkdownChange}
              className="w-full min-h-[300px] p-4 border rounded-md font-mono text-sm resize-y bg-muted"
              placeholder="Enter your markdown content here..."
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-2">
            <div className="prose dark:prose-invert max-w-none border rounded-md p-4 bg-card">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{ details: CustomDetails, summary: CustomSummary }}
              >
                {markdownContent}
              </ReactMarkdown>
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
    </div>
  )
}
