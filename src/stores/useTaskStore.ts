import { create } from 'zustand'
import { createTask, getTaskById, getTasks, updateTask } from '@/actions/tasks'
import { Task } from '@/payload-types'

interface TaskStore {
  tasks: Task[]
  itemsPerPage: number
  currentPage: number
  totalPages: number
  totalDocs: number
  hasPrevPage: boolean
  hasNextPage: boolean
  loading: boolean
  error: string | null

  fetchTasks: (page: number, limit: number) => Promise<void>
  toggleTimer: (taskId: number, isRunning: boolean) => Promise<void>
  addTask: (title: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  currentPage: 1,
  itemsPerPage: 2,
  totalPages: 1,
  totalDocs: 0,

  hasPrevPage: false,
  hasNextPage: false,
  error: null,

  fetchTasks: async (page: number = 1, limit: number = 2) => {
    console.log('Fetching tasks...')
    const { tasks, totalPages, totalDocs, hasPrevPage, hasNextPage } = await getTasks(
      {},
      '-createdAt',
      limit,
      page,
    )
    set({ tasks, totalPages, totalDocs, hasPrevPage, hasNextPage })
    console.log('In Zustand,Tasks fetched:', tasks)
  },

  addTask: async (title) => {
    set({ loading: true, error: null })
    try {
      const result = await createTask({ title, emoji: '🌴' })
      console.log('In Zustand,Task created:', result)

      if (result.success) {
        set((state) => ({
          tasks: [...state.tasks, result.task as Task],
        }))
      }
    } catch (error) {
      console.error('Error in addTask:', error)
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  },

  toggleTimer: async (taskId: number, isRunning: boolean) => {
    set({ loading: true, error: null })
    const task = get().tasks.find((task) => task.id === taskId)
    if (!task) return

    try {
      if (!isRunning) {
        // Start timer - single state update
        const startTime = new Date().toISOString()
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, startTime, is_running: true } : t,
          ),
        }))

        await updateTask(taskId.toString(), {
          startTime,
          is_running: true,
        })
      } else {
        // Stop timer - calculate locally
        const endTime = Date.now()
        const elapsed = Math.floor((endTime - new Date(task.startTime!).getTime()) / 1000)
        const newTimer = task.timer + elapsed

        // Single state update
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  timer: newTimer,
                  startTime: null,
                  is_running: false,
                }
              : t,
          ),
        }))

        await updateTask(taskId.toString(), {
          timer: newTimer,
          startTime: null,
          is_running: false,
        })
      }
    } catch (error) {
      // Revert local state on error
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, is_running: isRunning } : t)),
      }))
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  },
}))
