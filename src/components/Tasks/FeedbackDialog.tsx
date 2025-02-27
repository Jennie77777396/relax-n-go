'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Task } from '@/payload-types'
import { updateTask } from '@/actions/tasks-rest'

export function FeedbackDialog({
  task,
  isOpen,
  onClose,
}: {
  task: Task
  isOpen: boolean
  onClose?: () => void
}) {
  const [learned, setLearned] = useState('')
  const [status, setStatus] = useState([0.5])

  const handleSubmit = async () => {
    try {
      if (onClose) {
        onClose()
      }
      await updateTask(task.id, { feedback: learned, status: status[0] })
    } catch (err) {
      console.error('error updating task: ', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="learned">What are values you gained?</Label>
            <Textarea
              id="learned"
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="Enter what you've learned..."
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Slider
              id="status"
              min={0}
              max={1}
              step={0.01}
              value={status}
              onValueChange={setStatus}
            />
            <div className="text-right text-sm text-muted-foreground">
              {status?.length > 0 && status[0] && status[0].toFixed(2)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
