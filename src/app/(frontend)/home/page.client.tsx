'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusCircle, Check, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CreateTaskButtonProps {
  createTask: () => Promise<{ success: boolean; data?: any; error?: string }>
}

export function CreateTaskButton({ createTask }: CreateTaskButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCreateTask = async () => {
    setIsLoading(true)
    try {
      const result = await createTask()
      if (!result.success) throw new Error('Failed to create task')
      
      setIsSuccess(true)
      setShowPopover(true)
      setTimeout(() => setShowPopover(false), 2000)
    } catch (error) {
      setIsSuccess(false)
      setShowPopover(true)
      setTimeout(() => setShowPopover(false), 2000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Popover open={showPopover}>
      <PopoverTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={handleCreateTask}
            disabled={isLoading}
            className="group"
          >
            <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
            {isLoading ? "Creating..." : "Create New Task"}
          </Button>
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
  )
}