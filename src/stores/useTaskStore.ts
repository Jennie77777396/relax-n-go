import { create } from 'zustand'
import { createTask, getTasks, updateTask } from '@/actions/tasks'
import { Task } from '@/payload-types'

interface TaskStore {
  tasks: Task[]
  currentPage: number
  totalPages: number
  totalDocs: number
  hasPrevPage: boolean
  hasNextPage: boolean
  loading: boolean
  error: string | null
  limit: number

  fetchTasks: () => Promise<void>
  toggleTimer: (taskId: number, isRunning: boolean) => Promise<void>
  addTask: (title: string, fields?: string[]) => Promise<void>
  setCurrentPage: (page: number) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  totalDocs: 0,
  limit: 2,
  hasPrevPage: false,
  hasNextPage: false,
  error: null,

  fetchTasks: async () => {
    console.log('Fetching tasks...')
    const { tasks, totalPages, totalDocs, hasPrevPage, hasNextPage } = await getTasks(
      {},
      '-createdAt',
      get().currentPage,
      get().limit,
    )
    set({ tasks, totalPages, totalDocs, hasPrevPage, hasNextPage })
    console.log('In Zustand,Tasks fetched:', tasks)
  },

  addTask: async (title: string, fields?: string[]) => {
    set({ loading: true, error: null })
    try {
      const result = await createTask({
        title,
        emoji: '🌴',
        fields: fields,
      })

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
    console.log('toggleTimer id ', taskId), console.log('toggleTime isRunning', isRunning)
    set({ loading: true, error: null })
    const task = get().tasks.find((task) => task.id === taskId)
    console.log('task to toggle: ', JSON.stringify(task, null, 2))
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

  setCurrentPage: async (page: number) => {
    set({ currentPage: page })
    await get().fetchTasks()
  },
}))
