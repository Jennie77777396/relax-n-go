"use client"

import { Task as TasksBlockType } from "@/payload-types";
import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { PlayCircle, StopCircle, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch" // ShadCN Switch
import { updateTask } from "@/app/(frontend)/actions";


export const TasksBlock = ({ data }: { data: TasksBlockType | undefined }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(data?.totalMinutesSpent ? data.totalMinutesSpent * 60 : 0)
  const [taskStatus, setTaskStatus] = useState(data?.status || null)
  const [startTime, setStartTime] = useState<number | null>(null) // track start time
  const [endTime, setEndTime] = useState<number | null>(null) // track end time

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && startTime !== null) {
      interval = setInterval(() => {
        const previousTime = elapsedTime // Store previous accumulated time
        setElapsedTime(previousTime + Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, startTime])

  const toggleTimer = () => {
    if (isRunning) {
      setEndTime(Date.now()) // stop time
      updateTask(data?.id || 0, {
        totalMinutesSpent: Math.floor(elapsedTime / 60), // convert seconds to minutes for storage
      })
    } else {
      setStartTime(Date.now()) // start time
      // Don't reset elapsed time here anymore
    }
    setIsRunning(!isRunning)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleStatus = () => {
    // Cycle through: null -> success -> failure -> null
    if (!taskStatus) setTaskStatus("Not Started")
    else if (taskStatus === "Not Started") setTaskStatus("In Progress")
    else if (taskStatus === "In Progress") setTaskStatus("Completed")
    else setTaskStatus(null)
  }

  return (
    <TooltipProvider>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{data?.taskEmoji || "📌"}</span>
            <h3 className="text-lg font-semibold">{data?.taskName}</h3>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isRunning}
                  onCheckedChange={toggleTimer}
                  className={`transition-colors duration-200 ${isRunning ? 'bg-green-500' : 'bg-gray-300'}`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRunning ? "Stop" : "Start"} timer</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Elapsed time</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleStatus}
                variant="ghost"
                size="sm"
                className={`transition-colors duration-200 flex items-center space-x-2 ${
                  taskStatus === "Not Started"
                    ? "text-green-500 hover:text-green-600"
                    : taskStatus === "In Progress"
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400 hover:text-gray-500"
                }`}
              >
                {taskStatus === "Not Started" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : taskStatus === "In Progress" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm">Set Status</span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle task status</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {data?.tags && data?.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data?.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-3 py-1 rounded-full bg-lime-400 transition-all duration-200 hover:scale-105 flex items-center space-x-1`}
              >         
                <span>{tag.emoji}</span>
              </span>

            ))}
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  )
}
