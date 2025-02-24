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

export function FeedbackDialog({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const [learned, setLearned] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [status, setStatus] = useState([0.5])

  const handleSubmit = () => {
    // Handle the submission logic here
    console.log('Feedback submitted:', { learned, nextStep, status: status[0] })
    onClose && onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="learned">What have you learned?</Label>
            <Textarea
              id="learned"
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="Enter what you've learned..."
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="next-step">Next Step</Label>
            <Textarea
              id="next-step"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              placeholder="Enter your next step..."
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
