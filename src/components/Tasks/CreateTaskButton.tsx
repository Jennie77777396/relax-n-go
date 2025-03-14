'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { PlusCircle, Check, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { createTaskREST } from '@/actions/tasks'
import { mutate } from 'swr'
import { Where } from 'payload'

export function CreateTaskButton({
  fields,
  swrKey,
}: {
  fields: string[]
  swrKey?: (string | number | Where)[]
}) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('🌴')
  const [importance, setImportance] = useState<number | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddTask() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (importance !== null && (importance < 0 || importance > 5)) {
      setError('Importance must be a number between 0 and 5')
      return
    }
    setError(null) // Reset error state
    setLoading(true)
    try {
      const result = await createTaskREST({
        title,
        emoji,
        importance,
        tags,
        fields,
      })
      if (!result.success) {
        setError(result.error || 'Failed to create task')
      } else {
        console.log('New task added successfully', result.task)
        mutate(swrKey)
        // Reset fields after successful creation
        setOpen(false)
        setTitle('')
        setImportance(0)
        setEmoji('🌴')
        setTags([])
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-[140px]"
        >
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full rounded-md" // Rounded button
          >
            <motion.span
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <PlusCircle className="w-4 h-4" />
            </motion.span>
            Add Task
          </Button>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 rounded-xl">
        <Card className="shadow-lg border border-gray-200 rounded-xl">
          <CardHeader>
            <CardTitle>Create a New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task Title Input */}
            <Input
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 focus:ring-2 focus:ring-primary transition-all rounded-lg"
            />

            {/* Emoji Input */}
            <Input
              placeholder="Emoji"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="border border-gray-300 focus:ring-2 focus:ring-primary transition-all rounded-lg"
            />

            {/* Importance Input */}
            <Input
              type="number"
              placeholder="Importance"
              value={importance !== null ? importance : ''}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (!isNaN(value) && value >= 0 && value <= 5) {
                  setImportance(value)
                } else {
                  setImportance(null)
                }
              }}
              className="border border-gray-300 focus:ring-2 focus:ring-primary transition-all rounded-lg"
            />

            {/* Tags Input */}

            {/* Submit Button with Loading Animation */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleAddTask}
                disabled={loading}
                className="w-full flex items-center gap-2 rounded-full"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </motion.span>
                    Creating...
                  </>
                ) : (
                  <>
                    <motion.span
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.span>
                    Create Task
                  </>
                )}
              </Button>
            </motion.div>

            {error && <div className="error">{error}</div>}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
