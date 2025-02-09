import { useState, useEffect } from 'react'

export const useStopwatch = (
  taskId: number,
  initialTime: number = 0,
  isRunning: boolean = false,
) => {
  const [elapsedTime, setElapsedTime] = useState(initialTime)
  const storageKey = `task_${taskId}_time`
  const startTimeKey = `task_${taskId}_start`

  useEffect(() => {
    let worker: Worker

    if (isRunning) {
      // Store start time in localStorage
      const startTime = localStorage.getItem(startTimeKey) || Date.now().toString()
      localStorage.setItem(startTimeKey, startTime)

      // Create Worker
      worker = new Worker(new URL('../lib/stopwatch/timerWorker.ts', import.meta.url))

      worker.onmessage = () => {
        const start = parseInt(localStorage.getItem(startTimeKey) || '0')
        const currentElapsed = Math.floor((Date.now() - start) / 1000) + initialTime
        setElapsedTime(currentElapsed)
        localStorage.setItem(storageKey, currentElapsed.toString())
      }

      worker.postMessage({ type: 'START' })

      // Sync with localStorage on visibility change
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          const start = parseInt(localStorage.getItem(startTimeKey) || '0')
          const stored = Math.floor((Date.now() - start) / 1000) + initialTime
          setElapsedTime(stored)
        }
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        worker.postMessage({ type: 'STOP' })
        worker.terminate()
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    } else {
      // Clean up localStorage when stopped
      localStorage.removeItem(startTimeKey)
    }
  }, [isRunning, taskId, initialTime, startTimeKey, storageKey])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
  }
}
