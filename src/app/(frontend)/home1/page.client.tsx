'use client'
import TaskList from './lib/ListTasks'
import TaskPagination from './lib/TaskPagination'
import { PaginatedDocs } from 'payload'
import { stringify, parse } from 'qs-esm'

stringify('', { addQueryPrefix: true })
import { useEffect, useState } from 'react'
import { useTaskStore } from '@/stores/useTaskStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { PlusCircle, Check, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname, useRouter, useParams, useSearchParams } from 'next/navigation'
import { PaginationType } from './lib/types'

export function CreateTaskButton() {
  const { addTask, loading, error, fetchTasks, tasks } = useTaskStore()
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('🌴')
  const [open, setOpen] = useState(false)

  async function handleAddTask() {}

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add Task
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task Title Input */}
            <Input
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Emoji Input */}
            <Input placeholder="Emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} />

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4 mr-2" /> {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleAddTask}
              disabled={loading}
              className="w-full flex items-center gap-2"
            >
              {loading ? 'Creating...' : <Check className="w-4 h-4" />}
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

export default function PageClient({ tasks }: { tasks: PaginatedDocs }) {
  const router = useRouter()
  const pathName = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  const pageChangeHandled = async (pagination: PaginationType) => {
    const queryObj = parse(searchParams.toString()) as Record<string, any>
    queryObj.pages = pagination

    const newUrl = `${pathName}?${stringify(queryObj)}`
    router.push(newUrl)
  }

  return (
    <div className="flex flex-col gap-4">
      <CreateTaskButton />
      <TaskList tasks={tasks.docs} />
      <TaskPagination page={tasks} changeHandle={pageChangeHandled} />
    </div>
  )
}
