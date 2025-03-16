// components/StopwatchCard.tsx (with SWR)
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useStopwatch } from '@/hooks/useStopwatch'
import { getTaskById } from '@/actions/tasks'

interface StopwatchCardProps {
  taskId: string
  initialSeconds?: number
  initialTotalTimeSpent?: number
}

const fetcher = async (taskId: string) => {
  return getTaskById(taskId).then((task) => task?.total_spent || 0)
}

export function Stopwatch({
  taskId,
  initialSeconds = 0,
  initialTotalTimeSpent = 0,
}: StopwatchCardProps) {
  const { data: totalTimeSpent, mutate } = useSWR<number>(
    taskId ? `/task/${taskId}` : null,
    () => fetcher(taskId),
    {
      fallbackData: initialTotalTimeSpent,
    },
  )
  const { time, seconds, isRunning, start, pause, reset, save } = useStopwatch(
    taskId,
    initialSeconds,
  )
  const [showTotal, setShowTotal] = useState(false)

  const handleSave = () => {
    save().then((result) => {
      if (result.success) {
        console.log('Save successful, syncing total time')
        mutate() // Re-fetch totalTimeSpent
      } else {
        console.error('Save failed:', result.error)
      }
    })
  }

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="inline-block p-2 bg-gray-100 rounded-lg shadow-md text-sm">
      <div className="flex items-center space-x-2">
        <div className="font-semibold">
          Session: <span className="text-blue-600">{time}</span>
        </div>
        {showTotal && (
          <div className="font-semibold">
            Total: <span className="text-green-600">{formatTime(totalTimeSpent! + seconds)}</span>
          </div>
        )}
        <button
          onClick={() => setShowTotal((prev) => !prev)}
          className="px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          {showTotal ? 'Hide Total' : 'Show Total'}
        </button>
        <button
          onClick={isRunning ? pause : start}
          className={`px-2 py-1 rounded ${
            isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          disabled={seconds === 0}
        >
          Save
        </button>
      </div>
    </div>
  )
}
