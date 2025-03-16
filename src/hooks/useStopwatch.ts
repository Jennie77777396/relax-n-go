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

  console.log(`[useStopwatch] Initialized - taskId: ${taskId}, initialSeconds: ${initialSeconds}`)

  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    console.log(`[useStopwatch] Formatted time - ${totalSeconds} seconds: ${formatted}`)
    return formatted
  }, [])

  useEffect(() => {
    console.log(
      `[useStopwatch] Tick - Task: ${taskId}, isRunning: ${state.isRunning}, seconds: ${state.seconds}`,
    )
    let interval: NodeJS.Timeout | null = null
    if (state.isRunning) {
      interval = setInterval(() => {
        setState((prev) => {
          const newSeconds = prev.seconds + 1
          console.log(`[useStopwatch] Incrementing to: ${newSeconds}`)
          return { ...prev, seconds: newSeconds }
        })
      }, 1000)
    }
    return () => {
      if (interval) {
        console.log(`[useStopwatch] Clearing interval for task ${taskId}`)
        clearInterval(interval)
      }
    }
  }, [state.isRunning, taskId])

  const save = useCallback(async () => {
    console.log(`[useStopwatch] Entering save - Task Id: ${taskId}, seconds: ${state.seconds}`)

    if (!taskId || state.seconds <= 0) {
      console.log(`[useStopwatch] Save skipped - taskId: ${taskId}, seconds: ${state.seconds}`)
      return { success: false, error: 'No taskId or seconds to save' }
    }

    const today = new Date().toISOString().split('T')[0]
    console.log(`[useStopwatch] Saving ${state.seconds} seconds for task ${taskId} on ${today}`)

    try {
      console.log(
        `[useStopwatch] Calling upsertTaskTimeLog with task: ${Number(taskId)}, date: ${today}, seconds: ${state.seconds}`,
      )
      const result = await upsertTaskTimeLog({
        task: Number(taskId),
        date: today,
        seconds: state.seconds,
      })
      console.log(`[useStopwatch] Save result: ${JSON.stringify(result)}`)
      if (result.success) {
        console.log(`[useStopwatch] Save successful, resetting seconds to 0`)
        setState((prev) => ({ ...prev, seconds: 0 }))
      }
      return result
    } catch (error: unknown) {
      console.error(
        `[useStopwatch] Save error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
      throw error
    }
  }, [taskId, state.seconds])

  const start = () =>
    setState((prev) => {
      console.log(`[useStopwatch] Starting - task ${taskId}`)
      return { ...prev, isRunning: true }
    })
  const pause = () =>
    setState((prev) => {
      console.log(`[useStopwatch] Pausing - task ${taskId}`)
      return { ...prev, isRunning: false }
    })
  const reset = () => {
    console.log(`[useStopwatch] Resetting - task ${taskId}`)
    setState({ seconds: 0, isRunning: false })
  }

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
