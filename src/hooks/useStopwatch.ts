// hooks/useStopwatch.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { upsertTaskTimeLog } from '@/actions/task-time-log-rest'

interface StopwatchState {
  seconds: number
  isRunning: boolean
}

export function useStopwatch(taskId: string, initialSeconds: number = 0) {
  const [state, setState] = useState<StopwatchState>({
    seconds: initialSeconds,
    isRunning: true,
  })

  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Increment seconds every second while running
  useEffect(() => {
    console.log(`Tick - Task ${taskId}, isRunning: ${state.isRunning}, seconds: ${state.seconds}`)
    let interval: NodeJS.Timeout | null = null
    if (state.isRunning) {
      interval = setInterval(() => {
        setState((prev) => ({ ...prev, seconds: prev.seconds + 1 }))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isRunning, taskId])

  // Manual save function with .then()
  const save = useCallback(async () => {
    console.log(
      `in saving function of useStopWatchHook. Task Id: ${taskId}, state.seconds ${state.seconds}`,
    )
    if (!taskId || state.seconds <= 0) {
      console.log('Save skipped - No taskId or seconds to save')
      return { success: false, error: 'No taskId or seconds to save' }
    }

    const today = new Date().toISOString().split('T')[0]
    console.log(`Saving ${state.seconds} seconds for task ${taskId} on ${today}`)

    return upsertTaskTimeLog({
      task: Number(taskId), // Convert to number as in your original
      date: today,
      seconds: state.seconds,
    }).then((result) => {
      console.log('Save result:', JSON.stringify(result))
      if (result.success) {
        setState((prev) => ({ ...prev, seconds: 0 })) // Reset seconds after save
      }
      return result
    })
  }, [taskId])

  const start = () => setState((prev) => ({ ...prev, isRunning: true }))
  const pause = () => setState((prev) => ({ ...prev, isRunning: false }))
  const reset = () => setState({ seconds: 0, isRunning: false })

  return {
    time: formatTime(state.seconds),
    seconds: state.seconds,
    isRunning: state.isRunning,
    start,
    pause,
    reset,
    save,
  }
}
