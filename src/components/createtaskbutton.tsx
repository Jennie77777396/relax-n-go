'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Check, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFieldStore } from '@/stores/useFieldStore'
import { createTask } from '@/app/(frontend)/actions1'

export function CreateTaskButton2() {
  //set up default values
  const [isLoading, setIsLoading] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskEmoji, setTaskEmoji] = useState('✨')
  const { fields, fetchFields } = useFieldStore()
  const [selectedFieldId, setSelectedFieldId] = useState<string>('')
  const selectedField = fields.find((field) => field.id.toString() === selectedFieldId)

  const handleCreateTask = async () => {
    setIsLoading(true)
    try {
      const result = await createTask({
        taskName,
        taskEmoji,
        status: 'Not Started',
        id: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      if (!result.success) throw new Error('Failed to create task')

      setIsSuccess(true)
      setShowPopover(true)
      setTimeout(() => setShowPopover(false), 2000)
      setTaskName('')
      setTaskEmoji('✨')
    } catch (error) {
      setIsSuccess(false)
      setShowPopover(true)

      setTimeout(() => setShowPopover(false), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFields()
  }, [])

  return (
    <Dialog>
      <Popover open={showPopover}>
        <PopoverTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogTrigger asChild>
              <Button className="group">
                <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                Create New Task
              </Button>
            </DialogTrigger>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Task created successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>Failed to create task</span>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          <div>
            <Label htmlFor="taskEmoji">Task Emoji</Label>
            <Input
              id="taskEmoji"
              value={taskEmoji}
              onChange={(e) => setTaskEmoji(e.target.value)}
              placeholder="Enter task emoji"
            />
          </div>
          <div>
            <Label htmlFor="field">Field</Label>
            <Select onValueChange={(value) => setSelectedFieldId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id.toString()}>
                    {field.fieldName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
          </div>
          <div>
            <Label htmlFor="importance">Importance</Label>
          </div>

          <Button onClick={handleCreateTask} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
